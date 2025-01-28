// File: src/app/_components/Table/Table.tsx
"use client";

import React from "react";
import { api } from "~/trpc/react";
import AddColumn from "./AddColumn";
import Loader from "../Loader";

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
    <div className="flex-grow overflow-auto bg-white">
      {/* If still loading, show something */}
      {!table ? (
        <Loader />
      ) : (
        <>
          {/* 4) AddColumn button, with a callback that refetches data */}
          <div className="mb-4">
            <AddColumn
              tableId={tableId}
              onCreated={() => {
                // Once column is created, refetch table
                void refetch();
              }}
            />
          </div>

          {/* 5) Show the columns we have so far */}
          <div>
            <h3 className="font-medium">Columns:</h3>
            <ul className="list-disc list-inside">
              {table.columns.map((col) => (
                <li key={col.id}>{col.name}</li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default Table;
