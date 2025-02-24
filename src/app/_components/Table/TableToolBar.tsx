import React, { useMemo, type SetStateAction, type Dispatch } from 'react';
import TableToolItem from './TableToolItem';
import SearchRecordButton from './SearchRecordButton';
import SortButton from './SortButton';
import FilterButton from './FilterButton';
import { type Record as _Record } from "@prisma/client";
import { api } from "~/trpc/react";

type TableToolBarProps = {
  searchValue: string;
  setSearchValue: Dispatch<SetStateAction<string>>;
  tableId: string;
  sort: string;
  setSort: Dispatch<SetStateAction<string>>;
  sortColumnId: string;
  setSortColumnId: Dispatch<SetStateAction<string>>;
  currentView: string;
  filter: string;
  setFilter: Dispatch<SetStateAction<string>>;
  filterColumnId: string;
  setFilterColumnId: Dispatch<SetStateAction<string>>;
  filterValue: string;
  setFilterValue: Dispatch<SetStateAction<string>>;
  records: _Record[];
  setRecords: Dispatch<SetStateAction<_Record[]>>;
  appliedSearchValue: string;
  setAppliedSearchValue: Dispatch<SetStateAction<string>>;
}

const TableToolBar = ({ 
  searchValue, 
  setSearchValue, 
  tableId , 
  sort, 
  setSort, 
  sortColumnId, 
  setSortColumnId, 
  currentView,
  filter,
  setFilter,
  filterColumnId,
  setFilterColumnId,
  filterValue,
  setFilterValue,
  records,
  setRecords,
  appliedSearchValue,
  setAppliedSearchValue
} : TableToolBarProps ) => {
  // get view name
  const { data: view } = api.table.getTableView.useQuery(
    { viewId: currentView }, 
    { 
      enabled: !!currentView,
      refetchOnWindowFocus: false 
    }
  );

  const viewName = useMemo(() => {
    if (!currentView) return "Grid View";
    return view?.name ?? "Grid View";
  }, [currentView, view?.name]);

  return (
    <div className="flex items-center justify-between w-full border-b h-[40px] px-4 py-3 sticky z-10">
      <div className="flex items-center gap-[0.375rem] text-xs">
        <div role='button' className='flex items-center justify-center gap-1 bg-slate-200 p-1.5 rounded-sm hover:border-1 hover:border-slate-600'>
          <svg
            width={16}
            height={16}
            viewBox="0 0 16 16"
            className="flex-none"
            fill="black"
          >
            <use href="icons/icons_definitions.svg#List"></use>
          </svg>
          <span className='font-medium'>Views</span>
        </div>

        <div className='separator'></div>

        <div role='button' className='flex items-center gap-1 mr-2 rounded-md px-2 py-1 hover:bg-slate-200'>
          <svg
            role='button'
            width={16}
            height={16}
            viewBox="0 0 16 16"
            className="flex-none"
            fill="rgb(22, 110, 225)"
          >
            <use href="icons/icons_definitions.svg#GridFeature"></use>
          </svg>
          <span className='font-medium'>{viewName}</span>
          <svg
            role='button'
            width={16}
            height={16}
            viewBox="0 0 16 16"
            className="flex-none"
            fill="black"
          >
            <use href="icons/icons_definitions.svg#UsersThree"></use>
          </svg>
          <svg
            width={16}
            height={16}
            viewBox="0 0 16 16"
            className="flex-none"
            fill="black"
          >
            <use href="icons/icons_definitions.svg#ChevronDown"></use>
          </svg>
        </div>

        <TableToolItem
          d="EyeSlash"
          name="Hide fields"
        />
        <FilterButton 
          tableId={tableId}
          currentView={currentView}
          filter={filter}
          setFilter={setFilter}
          filterColumnId={filterColumnId}
          setFilterColumnId={setFilterColumnId}
          filterValue={filterValue}
          setFilterValue={setFilterValue}

          sort={sort} 
          sortColumnId={sortColumnId}
        />
        <TableToolItem
          d="Group"
          name='Group'
        />

        <SortButton 
          tableId={tableId}
          sort={sort}
          setSort={setSort}
          sortColumnId={sortColumnId}
          setSortColumnId={setSortColumnId}
          currentView={currentView}

          filter={filter}
          filterColumnId={filterColumnId}
          filterValue={filterValue}

          searchValue={searchValue}
          setSearchValue={setSearchValue}
          
        />
        <div role='button' className='flex justify-center items-center gap-1 rounded-md px-2 py-1 hover:bg-slate-200'>
          <svg
            width={16}
            height={16}
            viewBox="0 0 16 16"
            className="flex-none"
            fill="rgb(71, 85, 105)"
          >
            <use href='icons/icons_definitions.svg#PaintBucket'></use>
          </svg>
          <span className='text-slate-600'>Color</span>
        </div>
        <TableToolItem
          d = "RowHeightSmall"
        />
        <TableToolItem
          d = "ArrowSquareOut"
          name = "Share and sync"
        />

      </div>

      <SearchRecordButton 
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        tableId={tableId}
        records={records}
        setRecords={setRecords}
        appliedSearchValue={appliedSearchValue}
        setAppliedSearchValue={setAppliedSearchValue}
      />

    </div>
  )
}

export default TableToolBar;