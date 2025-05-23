import {Popover, PopoverTrigger, PopoverContent} from "@heroui/popover";
import { useState, useEffect, type SetStateAction, type Dispatch } from "react";
import { api } from "~/trpc/react";

type FilterConditionDropdownProps = {
  filterCondition: string;
  setFilterCondition: Dispatch<SetStateAction<string>>;
  columnType: string;
}

const textConds = [
  "contains", 
  "does not contain", 
  "is", 
  "is not", 
  "is empty", 
  "is not empty",
];

const numberConds = [
  "greater than",
  "smaller than",
];

const FilterConditionDropdown = ({
  filterCondition, 
  setFilterCondition, 
  columnType,
} : FilterConditionDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const conds = columnType === "TEXT" ? textConds : numberConds;

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
          className="flex justify-between items-center gap-1 px-2 py-1
          hover:bg-slate-50 border-slate-200 border-y w-[124px]"
        >
          <span className="text-slate-600 text-xs">{(filterCondition === "does not contain" ? "does not con..." : filterCondition)}</span>
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
        {conds.map((cond, index) => {
          return (
            <div 
              key={index}
              role="button"
              onClick={() => {
                setFilterCondition(cond);
                setIsOpen(false);
              }}
              className={`flex items-center justify-start p-2 w-full hover:bg-slate-100
                ${index === 0 ? "rounded-t-sm " : ""}
                ${index === conds.length - 1 ? "rounded-b-sm " : ""}
              `}
            >
              <span className="text-slate-600 text-xs">{cond}</span>
            </div>
          );
        })}
      </PopoverContent>  
    </Popover>
  );
}

export default FilterConditionDropdown;