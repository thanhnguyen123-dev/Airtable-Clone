import {Popover, PopoverTrigger, PopoverContent} from "@heroui/popover";
import { useState, useEffect, type SetStateAction, type Dispatch } from "react";
import { api } from "~/trpc/react";
import { type Column } from "@prisma/client";

type FilterColumnDropdownProps = {
  columns: Column[];
  selectedColumnIndex: number;
  setSelectedColumnIndex: Dispatch<SetStateAction<number>>;
}

const FilterColumnDropdown = ({
  columns, 
  selectedColumnIndex, 
  setSelectedColumnIndex
} : FilterColumnDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedColumnName: string = columns?.[selectedColumnIndex]?.name ?? "";

  return (
    <Popover 
    isOpen={isOpen} 
    onOpenChange={(open) => setIsOpen(open)} 
    placement={"bottom"}
    offset={0}
    triggerScaleOnOpen={false}
    classNames={{
      content: [
        "rounded-md shadow-none border border-gray-300",
      ]
    }}
    >
      <PopoverTrigger
      >
        <div 
          role='button' 
          className="flex justify-between items-center gap-1 rounded-l-sm px-2 py-1
          hover:bg-slate-50 border-slate-200 border w-[124px]"
        >
          <span className="text-slate-600 text-xs">{selectedColumnName}</span>
          <svg
              width={16}
              height={16}
              viewBox="0 0 16 16"
              className="flex-none"
              fill="currentColor"
            >
              <use href="icons/icons_definitions.svg#ChevronDown"></use>
          </svg>
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="p-0 text-xs w-[124px]"
      >
        {columns.map((col, index) => {
          return (
            <div 
              key={index}
              role="button"
              onClick={() => {
                setSelectedColumnIndex(index);
                setIsOpen(false);
              }}
              className={`flex items-center justify-start p-2 w-full hover:bg-slate-100
                ${index === 0 ? "rounded-t-sm " : ""}
                ${index === columns.length - 1 ? "rounded-b-sm " : ""}
              `}
            >
              <span className="text-slate-600 text-xs">{col.name}</span>
            </div>
          );
        })}
      </PopoverContent>  
    </Popover>
  );
}

export default FilterColumnDropdown;