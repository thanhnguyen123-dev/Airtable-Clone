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

  const utils = api.useUtils();
  const createColumnMutation = api.table.createColumn.useMutation({
    onMutate: async (newColumnInfo) => {
      await utils.table.getById.cancel();

      // snapshot old columns
      const prevColumns = [...columns];
      // create an optimistic column ID
      const fakeId = `tmp-${Date.now()}`;
      const optimisticColumn: Column = {
        id: fakeId,
        tableId: newColumnInfo.tableId,
        name: newColumnInfo.name,
      };

      // add the new column to local state
      setColumns((old) => [...old, optimisticColumn]);

      // add an empty cell for each existing record
      const newCells: Cell[] = records.map((rec) => ({
        id: `${rec.id}-${fakeId}`,
        recordId: rec.id,
        columnId: fakeId,
        data: "",
      }));
      setCells((old) => [...old, ...newCells]);

      // return context so we can revert if needed
      return { prevColumns, newCells };
    },
    onError: (err, _, context) => {
      if (context?.prevColumns) {
        setColumns(context.prevColumns);
      }
      if (context?.newCells) {
        setCells((old) =>
          old.filter((c) => !context.newCells.find((nc) => nc.id === c.id))
        );
      }
    },
    onSettled: () => {
      void refetch();
    },
  });

  const createRecordMutation = api.table.createRecord.useMutation({
    onMutate: async () => {
      await utils.table.getById.cancel();
      const prevRecords = [...records];

      const fakeId = `tmp-${Date.now()}`;
      const optimisticRecord: _Record = {
        id: fakeId,
        tableId: tableId!,
        rowIndex: records.length,
      };

      setRecords((old) => [...old, optimisticRecord]);

      const newCells: Cell[] = columns.map((col) => ({
        id: `${fakeId}-${col.id}`,
        recordId: fakeId,
        columnId: col.id,
        data: "",
      }));
      setCells((old) => [...old, ...newCells]);

      return { prevRecords, newCells };
    },
    onError: (err, _, context) => {
      if (context?.prevRecords) setRecords(context.prevRecords);
      if (context?.newCells) setCells((old) => old.filter((c) => !context.newCells.includes(c)));
    },
    onSettled: () => void refetch(),
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

  return (
    <div className="flex w-full bg-white">
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
            onClick={() => createRecordMutation.mutate({
              tableId: tableId,
              rowIndex: records.length,
            })}
            >
              <span className="p-3 text-gray-500">add</span>
          </div>
      </div>

      <AddColumn
        onCreated={(colName) => {
          createColumnMutation.mutate({
            tableId: tableId,
            name: colName,
          });
        }}
      />
    </div>
  );
};

export default TanStackTable;
