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

  const [tableColumns, setTableColumns] = useState<Column[]>([]);
  const [tableRecords, setTableRecords] = useState<Record[]>([]);
  const [cellsRecord, setCellsRecord] = useState<Cell[]>([]);

  // Fetch table data
  const { data: table, isLoading: isTableLoading, refetch: refetchTable } = api.table.getById.useQuery(
    { tableId: currentTableId! },
    { enabled: !!currentTableId }
  );

  const createColumnMutation = api.table.createColumn.useMutation({
    onMutate: async (newColumn) => {
      const tempId = Date.now().toString();
      setTableColumns(prev => [...prev, { 
        id: tempId, 
        name: newColumn.name, 
        tableId: currentTableId!,
      }]);
      
      return { tempId };
    },
    onSuccess: (data, context) => {
      // Replace temp ID with real ID
      setTableColumns(prev => 
        prev.map(col => 
          col.id === context?.tempId ? { ...col, id: data.id } : col
        )
      );
    },
  });

  const handleAddColumn = async (name: string) => {
    if (!currentTableId) return;
    
    await createColumnMutation.mutateAsync({
      tableId: currentTableId,
      name: name
    });
    
    await refetchTable();
  };
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
      <div className="h-screen max-w-10xl flex flex-grow overflow-x-auto">
        <TableSideBar />
        <TanStackTable 
          tableId={currentTableId}
          columns={tableColumns}
          records={tableRecords}
          cells={cellsRecord}
          onAddColumn={handleAddColumn}
          refetchTable={refetchTable}
    />
      </div>
    </div>
  );
}

export default BasePage;