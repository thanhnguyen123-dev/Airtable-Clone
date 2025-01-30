"use client";
import { usePathname } from "next/navigation";
import { api } from "~/trpc/react";
import BaseNavBar from "../_components/Base/BaseNavBar";
import BaseToolBar from "../_components/Base/BaseToolBar";
import Loader from "../_components/Loader";
import TableToolBar from "../_components/Table/TableToolBar";
import TableSideBar from "../_components/Table/TableSideBar";
import { FcBrokenLink } from "react-icons/fc";
import React, { useState, useEffect } from "react";
import TanStackTable from "../_components/Table/Table";
import type { Column, Record, Cell } from "@prisma/client"

const BasePage = () => {
  // Call getById to load the base
  const baseId = usePathname().split("/")[1];

  // Load the base
  const { data: base, isLoading: isBaseLoading } = api.base.getById.useQuery(
    { id: baseId! },
    { enabled: !!baseId }
  );

  // extract all tables from the base
  const { data: tables, isLoading: isTablesLoading } = api.table.getAll.useQuery(
    { baseId: baseId! },
    { enabled: !!baseId }
  );

  const [currentTableId, setCurrentTableId] = useState<string | undefined>(tables?.[0]?.id);

  useEffect(() => {
    if (tables?.[0] && tables.length > 0 && !currentTableId) {
      setCurrentTableId(tables[0].id);
    }
  }, [tables, currentTableId]);

  const [cellsRecord, setCellsRecord] = useState<Cell[]>([]);

  const { data: table, isLoading: isTableLoading, refetch: refetchTable } = api.table.getById.useQuery(
    { tableId: currentTableId! },
    { enabled: !!currentTableId }
  );


  if (isBaseLoading || isTablesLoading || isTableLoading) {
    return <Loader />;
  }

  if (!base?.id) {
    return (
      <div className="fixed inset-0 flex flex-col gap-4 items-center justify-center bg-white z-50">
        <FcBrokenLink size={64} />
        <p className="text-3xl font-bold">BASE NOT FOUND</p>
      </div>
    );
  }

  return (
    <div className="bg-grey flex flex-col w-full max-w-10xl h-screen">
      <BaseNavBar />
      <BaseToolBar 
        baseId={baseId!}
        tables={tables!}
        currentTableId={currentTableId!}
        handleTableSwitch={setCurrentTableId}
      />
      <TableToolBar />
      <div className="h-screen max-w-10xl flex flex-grow overflow-y-auto">
        <TableSideBar />
        <TanStackTable 
          tableId={currentTableId}
          cellsRecord={cellsRecord}
          setCellsRecord={setCellsRecord}
          refetchTable={refetchTable}
        />
      </div>
    </div>
  );
}

export default BasePage;