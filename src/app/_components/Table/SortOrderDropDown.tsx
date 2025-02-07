  import {Popover, PopoverTrigger, PopoverContent} from "@heroui/popover";
  import { type Column } from "@prisma/client";
  import { useState, type Dispatch, type SetStateAction } from "react";

  type SortOrderDropdownProps = {
    sortOrder: string;
    setSortOrder: Dispatch<SetStateAction<string>>;
  }

  const orders = ["A - Z", "Z - A"];

  const SortOrderDropdown = ({
    sortOrder, setSortOrder
  } : SortOrderDropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);

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
            className="flex justify-between items-center rounded-md px-2 py-1 
            hover:bg-slate-50 border-slate-200 border w-[120px]"
          >
            <span>{sortOrder}</span>
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
          className="p-0 text-xs"
        >
          {orders.map((order, index) => {
            return (
              <div 
                key={index}
                role="button"
                onClick={() => {
                  setIsOpen(false);
                  setSortOrder(order);
                }}
                className={`flex items-center justify-start p-2 w-[120px] hover:bg-slate-100
                  ${index === 0 ? "rounded-t-md " : ""}
                  ${index === orders.length - 1 ? "rounded-b-md " : ""}
                  `}
              >
                <span>{order}</span>
              </div>
            );
          })}
        </PopoverContent>
      </Popover>

    );
  }

  export default SortOrderDropdown;