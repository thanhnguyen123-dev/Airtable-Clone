// File: src/app/_components/Table/Table.tsx
"use client";

import React from "react";
import { api } from "~/trpc/react";
import AddColumn from "./AddColumn";
import Loader from "../Loader";
import TableHeader from "./TableHeader";
import TableCell from "./TableCell";

type TableProps = {
  tableId?: string; 
};

const Table = ({ tableId }: TableProps) => {
  if (!tableId) {
    return <div className="flex-grow bg-white p-4">No table selected</div>;
  }

  // 2) Load the table data, including columns
  const { data: table, refetch } = api.table.getById.useQuery(
    { tableId },
    { enabled: !!tableId }
  );


  // 3) Render
  return (
    <div className="flex w-full bg-white">
      {/* If still loading, show something */}
      {!table ? (
        <Loader />
      ) : (
        <>
          {table.columns.map((col) => (
            <div key={col.id} className="flex flex-col min-w-[50px]">
              <TableHeader name={col.name} />
              <TableCell />
              <TableCell />
              <TableCell />
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

export default Table;
