"use client";

import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
  type Dispatch,
  type SetStateAction,
} from "react";
import { api } from "~/trpc/react";
import Loader from "../Loader";
import TableHeader from "./TableHeader";
import TableCell from "./TableCell";
import AddColumnButton from "./AddColumnButton";
import AddRecordButton from "./AddRecordButton";
import TableRow from "./TableRow";
import LoaderTable from "./LoaderTable";

import type { Column, Cell, Record as _Record } from "@prisma/client";
import {
  useReactTable,
  type ColumnDef,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";

const FAKER_RECORDS_COUNT = 1000;
const FETCH_RECORD_LIMIT = 50;

type TableProps = {
  tableId: string;
  searchValue: string;
  currentView: string;
  sortColumnId: string;
  sort: string;
  setSort: Dispatch<SetStateAction<string>>;
  setSortColumnId: Dispatch<SetStateAction<string>>;
  hasView: boolean;
  filter: string;
  setFilter: Dispatch<SetStateAction<string>>;
  filterColumnId: string;
  setFilterColumnId: Dispatch<SetStateAction<string>>;
  filterValue: string;
  setFilterValue: Dispatch<SetStateAction<string>>;
};

const isFiltering = (
  colId1: string,
  colId2: string,
  filter: string,
  filterValue: string
) => {
  const matchesColId = colId1 === colId2;
  switch (filter) {
    case "contains":
      return matchesColId && filterValue !== "";
    case "does not contain":
      return matchesColId && filterValue !== "";
    case "is":
      return matchesColId && filterValue !== "";
    case "is not":
      return matchesColId && filterValue !== "";
    case "is empty":
      return matchesColId;
    case "is not empty":
      return matchesColId;
    default:
      return false;
  }
};

const TanStackTable = ({
  tableId,
  searchValue,
  currentView,
  sortColumnId,
  sort,
  setSort,
  setSortColumnId,
  hasView,
  filter,
  setFilter,
  filterColumnId,
  setFilterColumnId,
  filterValue,
  setFilterValue,
}: TableProps) => {
  const utils = api.useUtils();

  // fetch the current table
  const {
    data: tableData,
    isLoading: isTablesLoading,
    refetch,
  } = api.table.getById.useQuery(
    {
      tableId: tableId,
      sortColumnId: sortColumnId,
      sortOrder: sort,
      filterColumnId: filterColumnId,
      filterCond: filter,
      filterValue: filterValue,
    },
    { enabled: !!tableId }
  );

  const {
    data: tableRecords,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching: isRecordsFetching,
    isLoading: isRecordsLoading,
  } = api.table.getRecords.useInfiniteQuery(
    {
      tableId: tableId,
      sortColumnId: sortColumnId,
      sortOrder: sort,
      filterColumnId: filterColumnId,
      filterCond: filter,
      filterValue: filterValue,
      limit: FETCH_RECORD_LIMIT,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  // local states for optimistic updates
  const [columns, setColumns] = useState<Column[]>([]);
  const [records, setRecords] = useState<_Record[]>([]);
  const [cells, setCells] = useState<Cell[]>([]);

  // Combine records from infinite query pages
  const allRecords = useMemo(() => {
    return tableRecords?.pages.flatMap((page) => page.records) ?? [];
  }, [tableRecords]);

  useEffect(() => {
    if (tableData) {
      setColumns(tableData.columns);
      // Use the infinite query records for display
      setRecords(allRecords);
      const combined = allRecords.flatMap((rec) => rec.cells);
      setCells(combined);
    }
  }, [tableData, allRecords]);

  const createFakeRecordsMutation = api.table.createFakeRecords.useMutation({
    onSuccess: async () => {
      // Invalidate both queries so that new records appear immediately
      await refetch();
      await utils.table.getRecords.invalidate();
    },
  });
  const createColumnMutation = api.table.createColumn.useMutation({
    onSuccess: () => refetch(),
  });
  const createRecordMutation = api.table.createRecord.useMutation();

  const rowData = useMemo(() => {
    const map: Record<string, Record<string, string>> = {};
    for (const r of records) {
      map[r.id] = { recordId: r.id };
    }
    for (const cell of cells) {
      const record = map[cell.recordId];
      if (record) {
        record[cell.columnId] = cell.data;
      }
    }
    return Object.values(map);
  }, [records, cells]);

  const columnDefs = useMemo<ColumnDef<Record<string, string>>[]>(
    () =>
      columns.map((col) => ({
        accessorKey: col.id,
        header: ({ column }) => {
          const isSorted = col.id === sortColumnId && sort !== "";
          const isFiltered = isFiltering(col.id, filterColumnId, filter, filterValue);
          return (
            <TableHeader
              header={col.name}
              index={String(column.getIndex() ?? "")}
              isSorted={isSorted}
              isFiltered={isFiltered}
            />
          );
        },
        cell: ({ row }) => {
          const val = row.original[col.id] ?? "";
          const recId = row.original.recordId;
          const isSorted = col.id === sortColumnId && sort !== "";
          const isFiltered = isFiltering(col.id, filterColumnId, filter, filterValue);
          return (
            <TableCell
              columnId={col.id}
              recordId={recId!}
              data={val}
              searchValue={searchValue}
              isSorted={isSorted}
              isFiltered={isFiltered}
            />
          );
        },
      })),
    [columns, searchValue, sortColumnId, sort, filterColumnId, filter, filterValue]
  );

  const tableInstance = useReactTable({
    data: rowData,
    columns: columnDefs,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleAddRecord = async () => {
    try {
      const newId = crypto.randomUUID();
      const optimisticRecord: _Record = {
        id: newId,
        tableId: tableId,
        rowIndex: records.length,
      };
      setRecords((old) => [...old, optimisticRecord]);

      await createRecordMutation.mutateAsync({
        tableId,
        rowIndex: records.length,
        id: newId,
      });
    } catch (error) {
      console.error("Error creating record", error);
    }
  };

  const handleAddColumn = async (colName: string) => {
    try {
      const newColId = crypto.randomUUID();
      const optimisticColumn: Column = {
        id: newColId,
        tableId: tableId,
        name: colName,
      };
      setColumns((old) => [...old, optimisticColumn]);

      const newCells: Cell[] = records.map((record) => ({
        id: `${record.id}-${newColId}`,
        recordId: record.id,
        columnId: newColId,
        data: "",
      }));
      setCells((old) => [...old, ...newCells]);

      await createColumnMutation.mutateAsync({
        tableId: tableId,
        name: colName,
        id: newColId,
      });
    } catch (error) {
      console.error("Error creating column", error);
    }
  };

  const handleAddFakeRecords = async () => {
    if (tableData?.columns) {
      const columnIds = tableData.columns.map((col) => col.id);
      await createFakeRecordsMutation.mutateAsync({
        tableId: tableId,
        columnIds: columnIds,
        count: FAKER_RECORDS_COUNT,
      });
    }
  };


  // Infinite scrolling: set up an Intersection Observer for the last row.
  const observerRef = useRef<IntersectionObserver | null>(null);

  const lastRowRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isFetchingNextPage) return;
      if (observerRef.current) observerRef.current.disconnect();
  
      observerRef.current = new IntersectionObserver(
        (entries: IntersectionObserverEntry[]) => {
          if (entries[0]?.isIntersecting && hasNextPage) {
            void fetchNextPage();
          }
        }
      );
  
      if (node) observerRef.current.observe(node);
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage]
  );
  
  

  if (!tableId) {
    return <div className="flex-grow bg-white p-4">No table selected</div>;
  }

  if (isTablesLoading) {
    return <LoaderTable />;
  }
  if (!tableData) {
    return <div>Table not found</div>;
  }


  return (
    <div className="flex w-full bg-white overflow-y-auto overflow-x-auto">
      <div className="flex flex-col">
        <TableRow>
          {tableInstance.getHeaderGroups().flatMap((headerGroup) =>
            headerGroup.headers.map((header) => (
              <div key={header.id}>
                {flexRender(header.column.columnDef.header, header.getContext())}
              </div>
            ))
          )}
        </TableRow>
        {tableInstance.getRowModel().rows.map((row, index) => {
          // Attach the ref to the last row so that scrolling triggers fetching more data.
          const isLastRow =
            index === tableInstance.getRowModel().rows.length - 1;
          return (
            // IMPORTANT: Ensure that TableRow forwards the ref!
            <TableRow key={index} ref={isLastRow ? lastRowRef : null}>
              {row.getVisibleCells().map((cell, colIndex) => (
                <div
                  key={cell.id}
                  className="flex items-center justify-center m-0 p-0 w-full"
                >
                  {colIndex === 0 && (
                    <div className="flex items-center justify-start w-[70px] pl-[15px]">
                      <span className="flex items-center justify-start text-xs text-gray-500">
                        {index + 1}
                      </span>
                    </div>
                  )}
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </div>
              ))}
            </TableRow>
          );
        })}
        {/* <div>
          {(isRecordsFetching ||
            isRecordsLoading ||
            createFakeRecordsMutation.isPending) && (
            <div className="flex h-[30px] items-center border-b border-r w-full border-gray-300 text-xs pl-4 text-slate-600">
              Loading...
            </div>
          )}
        </div> */}
        <AddRecordButton handleClick={handleAddRecord} text="Add record" />
        <AddRecordButton
          handleClick={handleAddFakeRecords}
          text={`Add ${FAKER_RECORDS_COUNT} records`}
        />
      </div>
      <AddColumnButton onCreated={handleAddColumn} />
    </div>
  );
};

export default TanStackTable;
