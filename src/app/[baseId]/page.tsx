"use client";
import { usePathname } from "next/navigation";
import { api } from "~/trpc/react";
import BaseNavBar from "../_components/Base/BaseNavBar";
import BaseToolBar from "../_components/Base/BaseToolBar";
import Loader from "../_components/Loader";
import TableToolBar from "../_components/Table/TableToolBar";
import TableSideBar from "../_components/Table/TableSideBar";
import { FcBrokenLink } from "react-icons/fc";
import React, { useState, useEffect, useRef } from "react";
import Table from "../_components/Table/Table";
import { type Record as _Record, type Column } from "@prisma/client";

const BasePage = () => {
  // extract the base id based on url
  const baseId = usePathname().split("/")[1];

  // load the current base
  const { data: base, isLoading: isBaseLoading } = api.base.getById.useQuery(
    { id: baseId! },
    { enabled: !!baseId }
  );

  // extract all tables from the base
  const { data: tables, isLoading: isTablesLoading } = api.table.getAll.useQuery(
    { baseId: baseId! },
    { enabled: !!baseId }
  );


  const [currentTableId, setCurrentTableId] = useState<string | undefined>(() => {
    if (typeof window !== "undefined") {
      const lastOpenedTable = localStorage.getItem(`currentTable-${baseId}`);
      return lastOpenedTable ?? "";
    }
    return "";
  });

  useEffect(() => {
    if (currentTableId) {
      localStorage.setItem(`currentTable-${baseId}`, currentTableId);
    }
  }, [currentTableId, baseId]);

  const [searchValue, setSearchValue] = useState("");
  const [appliedSearchValue, setAppliedSearchValue] = useState("");

  const [currentView, setCurrentView] = useState("");

  const [sort, setSort] = useState("");
  const [sortColumnId, setSortColumnId] = useState("");
  const [filter, setFilter] = useState("");
  const [filterColumnId, setFilterColumnId] = useState("");
  const [filterValue, setFilterValue] = useState("");

  const [records, setRecords] = useState<_Record[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);

  const [hasView, setHasView] = useState(false);

  const { 
    data: view,
  } = api.table.getTableView.useQuery(
    { viewId: currentView },
    { 
      // refetchOnWindowFocus: false 
      staleTime: 0,
      refetchOnMount: true,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => { 
    if (view?.id) {
      setHasView(true);
      setSort(view.sortOrder);
      setSortColumnId(view.sortColumnId);
      setFilter(view.filterCond);
      setFilterColumnId(view.filterColumnId);
      setFilterValue(view.filterValue);
    }
  }, [view]);


  useEffect(() => {
    if (tables?.[0] && tables.length > 0 && !currentTableId) {
      setCurrentTableId(tables[0].id);
    }
  }, [tables, currentTableId]);

  useEffect(() => {
    setSearchValue("");
  }, [currentTableId, view]);

  const isFirstRender = useRef(true);

  // useEffect(() => {
  //   setCurrentView("");
  //   setSort("");
  //   setSortColumnId("");
  //   setFilter("");
  //   setFilterColumnId("");
  //   setFilterValue("");

  // }, [currentTableId]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
    }
    else {
      setCurrentView("");
      setSort("");
      setSortColumnId("");
      setFilter("");
      setFilterColumnId("");
      setFilterValue("");
 
    }
  }, [currentTableId]);

  
  if (isBaseLoading || isTablesLoading) {
    return <Loader />
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
        tables={tables ?? []}
        currentTableId={currentTableId ?? ""}
        handleTableSwitch={setCurrentTableId}
      />
      <TableToolBar 
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        tableId={currentTableId ?? ""}
        sort={sort}
        setSort={setSort}
        sortColumnId={sortColumnId}
        setSortColumnId={setSortColumnId}
        currentView={currentView}
        filter={filter}
        setFilter={setFilter}
        filterColumnId={filterColumnId}
        setFilterColumnId={setFilterColumnId}
        filterValue={filterValue}
        setFilterValue={setFilterValue}
        columns={columns}
      />
      <div className="h-screen max-w-10xl flex flex-grow overflow-y-auto">
        <TableSideBar 
          tableId={currentTableId ?? ""}
          currentView={currentView}
          setCurrentView={setCurrentView}
        />
        <Table 
          tableId={currentTableId ?? ""}
          currentView={currentView}
          searchValue={searchValue}
          sortColumnId={sortColumnId}
          sort={sort}
          filter={filter}
          filterColumnId={filterColumnId}
          filterValue={filterValue}
          records={records}
          setRecords={setRecords}
          columns={columns}
          setColumns={setColumns}
        />
      </div>
    </div>
  );
}

export default BasePage;