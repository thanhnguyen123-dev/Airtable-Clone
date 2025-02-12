"use client";

import React, { useEffect, useState, useMemo, useRef, type Dispatch, type SetStateAction } from "react";
import { api } from "~/trpc/react";
import Loader from "../Loader";
import TableHeader from "./TableHeader";
import TableCell from "./TableCell";
import AddColumnButton from "./AddColumnButton";
import AddRecordButton from "./AddRecordButton";
import TableRow from "./TableRow";
import LoaderTable from "./LoaderTable";
import { faker } from '@faker-js/faker';

import type { Column, Cell, Record as _Record } from "@prisma/client";
import { useReactTable, type ColumnDef, getCoreRowModel, flexRender } from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";

const FAKER_RECORDS_COUNT = 200;

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
  filterValue: string) => {
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
}

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

   // fetch the current table
   const { data: tableData, isLoading: isTablesLoading, isRefetching: isTableRefetching, refetch } = api.table.getById.useQuery(
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

  const { data: tableRecords, isLoading: isRecordsLoading, refetch: refetchRecords } = api.table.getRecords.useQuery(
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

  // local states for optimistic updates
  const [columns, setColumns] = useState<Column[]>([]);
  const [records, setRecords] = useState<_Record[]>([]);
  const [cells, setCells] = useState<Cell[]>([]);


  useEffect(() => {
    if (tableData && tableRecords) {
      setColumns(tableData.columns);
      setRecords(tableRecords);
      const combined = tableRecords.flatMap((rec) => rec.cells);
      setCells(combined);
    }
  }, [tableData, tableRecords]);

  const createFakeRecordsMutation = api.table.createFakeRecords.useMutation({
    onSuccess: () => refetch(),
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
        header: ({column}) => {
          const isSorted = (col.id === sortColumnId && sort !== "");
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
          const isSorted = (col.id === sortColumnId && sort !== "");
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

  const parentRef = useRef<HTMLDivElement>(null);
  const rowVirtualizer = useVirtualizer({
    count: rowData.length,
    getScrollElement: () => parentRef.current!,
    estimateSize: () => 40,
    overscan: 5,
  });

  if (!tableId) {
    return <div className="flex-grow bg-white p-4">No table selected</div>;
  }

  if (isTablesLoading) {
    return <LoaderTable />;
  }
  if (!tableData) {
    return <div>Table not found</div>;
  }

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
      console.error("Error creating record", error);    }
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
  
  
  const handleAddFakeRecords = () => {
    if (tableData.columns) {
      const columnIds = tableData.columns.map((col) => col.id);

      createFakeRecordsMutation.mutate({
        tableId: tableId,
        columnIds: columnIds,
        count: FAKER_RECORDS_COUNT,
      });
    }
  };

  return (
    <div className="flex w-full bg-white overflow-y-auto overflow-x-auto">
      <div className="flex flex-col">
        <TableRow>
          {tableInstance.getHeaderGroups().flatMap(headerGroup =>
            headerGroup.headers.map(header => (
              <div key={header.id}>
                {flexRender(header.column.columnDef.header, header.getContext())}
              </div>
            ))
          )}
        </TableRow>
        {tableInstance.getRowModel().rows.map((row, index) => {
          return (
            <TableRow key={index}>
              {row?.getVisibleCells().map((cell, colIndex) => {
                return (
                  <div key={cell.id} className={`flex items-center justify-center m-0 p-0 w-full`}>
                    {colIndex === 0 && (
                      <div className="flex items-center justify-start w-[70px] pl-[15px]">
                        <span className="flex items-center justify-start text-xs text-gray-500">
                          {index + 1}
                        </span>
                      </div>
                    )}
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </div>
                );
              })}
            </TableRow>
          );
        })}
        <AddRecordButton 
          handleClick={handleAddRecord} 
          text="Add record"
        />
        <AddRecordButton 
          handleClick={handleAddFakeRecords} 
          text={`Add ${FAKER_RECORDS_COUNT} records`}
        />

      </div>
      <AddColumnButton
        onCreated={handleAddColumn}
      />
    </div>
  );
};

export default TanStackTable;
