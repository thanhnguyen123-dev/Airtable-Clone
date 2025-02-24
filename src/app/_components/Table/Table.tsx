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
import TableHeader from "./TableHeader";
import TableCell from "./TableCell";
import AddColumnButton from "./AddColumnButton";
import AddRecordButton from "./AddRecordButton";
import TableRow from "./TableRow";
import LoaderTable from "./LoaderTable";
import { useVirtualizer } from "@tanstack/react-virtual";

import type { Column, Cell, Record as _Record } from "@prisma/client";
import {
  useReactTable,
  type ColumnDef,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";

const FAKER_RECORDS_COUNT = 5000;
const FETCH_RECORD_LIMIT = 100;

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
  records: _Record[];
  setRecords: Dispatch<SetStateAction<_Record[]>>;
}

const isFiltering = (
  colId1: string,
  colId2: string,
  filter: string,
  filterValue: string
) => {
  const matchesColId = colId1 === colId2;
  switch (filter) {
    case "contains":
    case "does not contain":
    case "is":
    case "is not":
      return matchesColId && filterValue !== "";
    case "is empty":
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
  records,
  setRecords,
}: TableProps) => {
  const utils = api.useUtils();
  const [page, setPage] = useState(0);

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
      searchValue: searchValue,
    },
    { 
      enabled: !!tableId,
    }
  );

  const {
    data: tableRecords,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching: isRecordsFetching,
    isLoading: isRecordsLoading,
    refetch: refetchRecords,
  } = api.table.getRecords.useInfiniteQuery(
    {
      tableId: tableId,
      sortColumnId: sortColumnId,
      sortOrder: sort,
      filterColumnId: filterColumnId,
      filterCond: filter,
      filterValue: filterValue,
      searchValue: searchValue,
      limit: FETCH_RECORD_LIMIT,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      refetchOnWindowFocus: false,
    }
  );


  const [columns, setColumns] = useState<Column[]>([]);
  // const [records, setRecords] = useState<_Record[]>([]);
  const [cells, setCells] = useState<Cell[]>([]);

  const allRecords = useMemo(() => {
    return tableRecords?.pages.flatMap((page) => page.records) ?? [];
  }, [tableRecords]);

  useEffect(() => {
    if (tableRecords) {
      setColumns(tableRecords?.pages[0]?.columns ?? []);
      setRecords(allRecords);
      const combinedCells = allRecords.flatMap((r) => r.cells);
      setCells(combinedCells);
    }
  }, [tableRecords, allRecords, setColumns, setRecords]);


  const createFakeRecordsMutation = api.table.createFakeRecords.useMutation({
    onSuccess: async () => {
      await refetch();
      await utils.table.getRecords.invalidate();
    },
  });
  const createColumnMutation = api.table.createColumn.useMutation({
    onSuccess: async () => {
      await refetch();
      await utils.table.getRecords.invalidate();
    },
  });
  const createRecordMutation = api.table.createRecord.useMutation({
    onSuccess: async () => {
      await refetch();
      await utils.table.getRecords.invalidate();
    },
  });

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
              columnType={col.type} 
            />
          );
        },
        cell: ({ row }) => {
          const val = row.original[col.id] ?? "";
          const recId = row.original.recordId;
          const isSorted = col.id === sortColumnId && sort !== "";
          const isFiltered = col.id === filterColumnId && filter !== "" && 
          (filterValue !== "" || filter === "is empty" || filter === "is not empty");
          return (
            <TableCell
              columnId={col.id}
              recordId={recId!}
              data={val}
              searchValue={searchValue}
              isSorted={isSorted}
              isFiltered={isFiltered}
              columnType={col.type}
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

  const handleAddColumn = async (colName: string, colType: string) => {
    try {
      const newColId = crypto.randomUUID();

      const column = await createColumnMutation.mutateAsync({
        tableId: tableId,
        name: colName,
        type: colType,
        id: newColId,
      });

      utils.table.getRecords.setData(
        { tableId: tableId, limit: FETCH_RECORD_LIMIT },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            columns: [...(old.columns ?? []), column],
          };
        }
      );
    } catch (error) {
      console.error("Error creating column", error);
    }
  };

  const handleAddFakeRecords = async () => {
    if (columns) {
      const columnIds = columns.map((col) => col.id);
      await createFakeRecordsMutation.mutateAsync({
        tableId: tableId,
        columnIds: columnIds,
        count: FAKER_RECORDS_COUNT,
      });
    }
  };


  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastRowRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isFetchingNextPage) return;
      if (observerRef.current) observerRef.current.disconnect();
  
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0]?.isIntersecting && hasNextPage) {
          void fetchNextPage();
        }
        
      },
      {
        rootMargin: "200px 0px",
        threshold: 0.1,
      }
    );
  
      if (node) observerRef.current.observe(node);
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage]
  );

  const parentRef = useRef<HTMLDivElement>(null);
  const rowVirtualizer = useVirtualizer({
    count: tableInstance.getRowModel().rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 32,
    overscan: 60,
  });
  const virtualRows = rowVirtualizer.getVirtualItems();

  const tableViewMutation = api.table.updateTableView.useMutation();
  const updateTableView = async () => {
    if (!currentView) return;
    await tableViewMutation.mutateAsync({
      viewId: currentView,
      sortOrder: sort,
      sortColumnId: sortColumnId,
      filterCond: filter,
      filterColumnId: filterColumnId,
      filterValue: filterValue,
      searchValue: searchValue,
    }).then(async () => {
      await refetchRecords();
    });
  }

  useEffect(() => {
      void updateTableView();
  }, [sort, sortColumnId, filter, filterColumnId, filterValue, searchValue]);


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
    <div className="bg-white w-full h-full flex flex-col overflow-hidden">
      <TableRow className="flex border-b border-gray-300">
        {tableInstance.getHeaderGroups().map((headerGroup) =>
          headerGroup.headers.map((header, colIndex) => (
            <div
              key={header.id}
              className={`border-r border-gray-300 flex items-center text-xs
                ${colIndex === 0 ? "w-[230px]" : "w-[180px]"}
                bg-gray-100`}
              style={{ height: "32px" }}
            >
              {flexRender(header.column.columnDef.header, header.getContext())}
            </div>
          ))
        )}
        <AddColumnButton 
          onCreated={handleAddColumn}
        />

      </TableRow>
  
      <div ref={parentRef} className="w-full flex-1 overflow-auto">
        <div style={{ width: "fit-content" }}>
          <div
            style={{
              position: "relative",
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: "fit-content",
            }}
          >
            {virtualRows.map((virtualRow) => {
              const row = tableInstance.getRowModel().rows[virtualRow.index];
              const isLastRow =
                virtualRow.index === tableInstance.getRowModel().rows.length - 1;
  
              return (
                <TableRow
                  key={row?.id}
                  ref={isLastRow ? lastRowRef : null}
                  className="flex border-b border-gray-300"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "fit-content",
                    height: "32px",
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  {row?.getVisibleCells().map((cell, colIndex) => (
                    <div
                      key={cell.id}
                      className={`flex items-center border-gray-300 text-xs
                        ${colIndex === 0 ? "w-[230px]" : "w-[180px]"}
                      `}
                      style={{ height: "32px" }}
                    >
                      {colIndex === 0 && (
                        <div className="flex items-center justify-start w-[70px] pl-[15px]">
                          <span className="text-xs text-gray-500">
                            {virtualRow.index + 1}
                          </span>
                        </div>
                      )}
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </div>
                  ))}
                </TableRow>
              );
            })}
          </div>
        </div>
      </div>
  
      <div 
        className={`flex items-center pl-[15px] py-1 gap-24 border-t border-r border-gray-300`}
        style={{
          // width: `calc(230px + 180px * ${columns.length - 1})`,
          width: "100%",
        }}
        >
        <span className="text-xs text-gray-500">
          {`${records.length} records`}
        </span>
        <AddRecordButton 
          handleAddRecord={handleAddRecord} 
          handleAddFakeRecords={handleAddFakeRecords}
          isLoading={isRecordsLoading}
        />
      </div>
    </div>
  );
  
};

export default TanStackTable;
