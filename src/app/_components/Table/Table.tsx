"use client";

import React, { useEffect, useState, useMemo } from "react";
import { api } from "~/trpc/react";
import Loader from "../Loader";
import TableHeader from "./TableHeader";
import TableCell from "./TableCell";
import AddColumn from "./AddColumn";
import TableRow from "./TableRow"

import type { Column, Cell, Record as _Record } from "@prisma/client";
import { useReactTable, type ColumnDef, getCoreRowModel, flexRender } from "@tanstack/react-table";

type TableProps = {
  tableId?: string;
};

const TanStackTable = ({
  tableId,
}: TableProps) => {

  // fetch the current table
  const { data: tableData, isLoading, refetch } = api.table.getById.useQuery(
    { tableId: tableId! },
    { enabled: !!tableId }
  );

  // local states for optimistic updates
  const [columns, setColumns] = useState<Column[]>([]);
  const [records, setRecords] = useState<_Record[]>([]);
  const [cells, setCells] = useState<Cell[]>([]);


  useEffect(() => {
    if (tableData) {
      setColumns(tableData.columns);
      setRecords(tableData.records);
      const combined = tableData.records.flatMap((rec) => rec.cells);
      setCells(combined);
    }
  }, [tableData]);

  const createFakeRecordsMutation = api.table.createFakeRecords.useMutation();
  const createColumnMutation = api.table.createColumn.useMutation();
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
        header: ({column}) => <TableHeader header={col.name} index={String(column.getIndex() ?? "")}/>,
        cell: ({ row }) => {
          const val = row.original[col.id] ?? "";
          const recId = row.original.recordId;
          return (
            <TableCell
              columnId={col.id}
              recordId={recId!}
              data={val}
            />
          );
        },
      })),
    [columns]
  );

  const tableInstance = useReactTable({
    data: rowData,
    columns: columnDefs,
    getCoreRowModel: getCoreRowModel(),
  });

  if (!tableId) {
    return <div className="flex-grow bg-white p-4">No table selected</div>;
  }

  if (isLoading) {
    return <Loader />;
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
      });
    }
  };

  return (
    <div className="flex w-full bg-white overflow-y-auto">
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
                  <div key={cell.id} className="flex items-center justify-center m-0 p-0">
                    {colIndex === 0 && (
                      <div className="flex items-center justify-center w-9 pl-[0.1rem]">
                        <span className="flex items-center justify-center text-center text-xs text-gray-500">
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
          <div
            className={`flex pl-[0.1rem] h-8 items-center border-b border-r w-full border-gray-300 bg-white pr-5 text-left text-[13px] text-gray-500 hover:bg-gray-50`}
            role="button"
            onClick={handleAddRecord}
            >
              <span className="p-3 text-gray-500">Add record</span>
          </div>
          <div
            className={`flex pl-[0.1rem] h-8 items-center border-b border-r w-full border-gray-300 bg-white pr-5 text-left text-[13px] text-gray-500 hover:bg-gray-50`}
            role="button"
            onClick={handleAddFakeRecords}
            >
              <span className="p-3 text-gray-500">Add 15k records</span>
          </div>
      </div>

      <AddColumn
        onCreated={handleAddColumn}
      />
    </div>
  );
};

export default TanStackTable;