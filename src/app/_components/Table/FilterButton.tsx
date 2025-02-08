import {Popover, PopoverTrigger, PopoverContent} from "@heroui/popover";
import { useState, useEffect, type SetStateAction, type Dispatch } from "react";
import { api } from "~/trpc/react";
import SortColumnDropdown from "./SortColumnDropDown";
import SortOrderDropdown from "./SortOrderDropDown";

type FilterButtonProps = {
  tableId: string;
  filterColumnId: string;
  setFilterColumnId: Dispatch<SetStateAction<string>>;
  filterValue: string;
  setFilterValue: Dispatch<SetStateAction<string>>;
  filter: string;
  setFilter: Dispatch<SetStateAction<string>>;
  hasFilter: boolean;
  setHasFilter: Dispatch<SetStateAction<boolean>>;
}

const FilterButton = ({ 
  tableId, 
  filterColumnId, 
  setFilterColumnId, 
  filterValue, 
  setFilterValue, 
  filter, 
  setFilter,
  hasFilter,
  setHasFilter
} : FilterButtonProps
  ) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: columns, isLoading: isColumnsLoading } = api.table.getTableHeaders.useQuery(
    { tableId: tableId },
    { enabled: !!tableId }
  );

  const [colIndex, setColIndex] = useState(() => 
    columns?.findIndex((col) => col.id === filterColumnId) ?? 0
  );


  return (
    <Popover 
      isOpen={isOpen} 
      onOpenChange={(open) => setIsOpen(open)} 
      placement={"bottom-start"}
      classNames={{
        content: [
          "rounded-sm shadow-none border border-gray-300",
        ]
      }}
      >
      <PopoverTrigger>
        <div 
          role='button' 
          className='flex justify-center items-center gap-1 rounded-md px-2 py-1 hover:bg-slate-200'
        >
          <span className='text-slate-600'>In this view, show records</span>
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="w-[450px]"
      >
        <div className="flex flex-col gap-2 p-2 w-full">
          <div className="flex items-center gap-1">
            <span className="text-xs font-medium text-slate-500">Sort by</span>
            <svg
              width={14}
              height={14}
              viewBox="0 0 16 16"
              className="flex-none"
              fill="gray"
            >
              <use href="icons/icons_definitions.svg#Question"></use>
            </svg>
          </div>
          <hr className="mb-2" />
          <div className="flex items-center justify-between gap-2 text-xs">
            <SortColumnDropdown
              columns={columns ?? []}
              selectedColumnIndex={colIndex}
              setSelectedColumnIndex={setColIndex}
            />
            <SortOrderDropdown 
              sortOrder={sortOp}
              setSortOrder={setSortOp}
            />
            {hasSort && (
              <svg
                role="button"
                width={16}
                height={16}
                viewBox="0 0 16 16"
                className="flex-none"
                onClick={removeSort}
                fill="currentColor"
              >
                <use
                  href="/icons/icons_definitions.svg#X"
                ></use>
              </svg>
            )}
          </div>
          <div className="">
            <button onClick={handleClick} className="bg-blue-600 text-xs my-2 py-1 px-2 hover:bg-blue-500 text-white rounded-md">
              Sort
            </button>

          </div>
        </div>
      </PopoverContent>
    </Popover>

  );
}

export default FilterButton;