// File: src/app/_components/Table/Table.tsx
"use client";

import React, { useEffect, useMemo, useRef, type SetStateAction, Dispatch} from "react";
import { api } from "~/trpc/react";
import AddColumn from "./AddColumn";
import Loader from "../Loader";
import TableHeader from "./TableHeader";
import TableCell from "./TableCell";
import type { Column, Cell } from "@prisma/client";
import { useReactTable, ColumnDef, getCoreRowModel, flexRender } from "@tanstack/react-table";

type TableProps = {
  tableId?: string
  cellsRecord: Cell[],
  setCellsRecord: Dispatch<SetStateAction<Cell[]>>
  refetchTable: () => void 
};

const TanStackTable = ({ 
  tableId, 
  cellsRecord, 
  setCellsRecord, 
  refetchTable 
  }: TableProps) => {
  if (!tableId) {
    return <div className="flex-grow bg-white p-4">No table selected</div>;
  }

  const { data: table, refetch } = api.table.getById.useQuery(
    { tableId },
    { enabled: !!tableId }
  );



  return (
    <div className="flex w-full bg-white">
      {/* If still loading, show something */}
      {!table ? (
        <Loader />
      ) : (
        <>
          {table.columns.map((col) => (
            <div key={col.id} className="flex flex-col min-w-[50px]">
              <TableHeader header={col.name} />
            </div>
          ))}
          <AddColumn
            tableId={tableId}
            onCreated={() => {
              void refetch();
            }}
          />
      
        </>

      )}
    </div>
  );
};

export default TanStackTable;