import {Popover, PopoverTrigger, PopoverContent} from "@heroui/popover";
import { type Column } from "@prisma/client";
import { useState, type Dispatch, type SetStateAction } from "react";

type SortColumnDropdownProps = {
  columns: Column[];
  selectedColumnIndex: number;
  setSelectedColumnIndex: Dispatch<SetStateAction<number>>;
}

const SortColumnDropdown = ({
  columns, selectedColumnIndex, setSelectedColumnIndex
} : SortColumnDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedColumnName: string = columns?.[selectedColumnIndex]?.name ?? "error 404";

  return (
    <Popover 
      isOpen={isOpen} 
      onOpenChange={(open) => setIsOpen(open)} 
      placement={"bottom"}
      offset={0}
      >
      <PopoverTrigger

      >
        <div 
          role='button' 
          className="flex justify-between items-center gap-1 rounded-md px-2 py-1
          hover:bg-slate-50 border-slate-200 border w-[250px]"
        >
          <span>{selectedColumnName}</span>
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
        className="p-0 text-xs w-[250px]"
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
                ${index === 0 ? "rounded-t-md " : ""}
                ${index === columns.length - 1 ? "rounded-b-md " : ""}
              `}
            >
              <span>{col.name}</span>
            </div>
          );
        })}
      </PopoverContent>
    </Popover>

  );
}

export default SortColumnDropdown;