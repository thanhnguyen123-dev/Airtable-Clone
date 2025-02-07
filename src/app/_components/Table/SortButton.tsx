import {Popover, PopoverTrigger, PopoverContent} from "@heroui/popover";
import { useState, useEffect, type SetStateAction, type Dispatch } from "react";
import { api } from "~/trpc/react";
import SortColumnDropdown from "./SortColumnDropDown";
import SortOrderDropdown from "./SortOrderDropDown";
import { set } from "zod";

type SearchRecordButtonProps = {
  tableId: string;
  sort: string;
  setSort: Dispatch<SetStateAction<string>>;
  sortColumnId: string;
  setSortColumnId: Dispatch<SetStateAction<string>>;
}

const SortButton = (
  { tableId, sort, setSort, sortColumnId, setSortColumnId } : SearchRecordButtonProps
) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: columns, isLoading: isColumnsLoading } = api.table.getTableHeaders.useQuery(
    { tableId: tableId },
    { enabled: !!tableId }
  );

  const [colIndex, setColIndex] = useState(() => 
    columns?.findIndex((col) => col.id === sortColumnId) ?? 0
  );

  const [sortOp, setSortOp] = useState(sort === "" ? "A - Z" : sort);
  const [hasSort, setHasSort] = useState(false);
  

  const handleClick = () => {
    setIsOpen(false);
    setSortColumnId(columns?.[colIndex]?.id ?? "");
    setSort(sortOp);
    setHasSort(true);
  }

  const removeSort = () => {  
    setSort("");
    setSortColumnId("");
    setHasSort(false);
  }

  useEffect(() => {
    setHasSort(sortColumnId !== "");
  }, [sortColumnId]);

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
          <svg
            width={16}
            height={16}
            viewBox="0 0 16 16"
            className="flex-none"
            fill="rgb(71, 85, 105)"
          >
            <path fill-rule="non-zero" d="M4.99999 2.5C4.86738 2.5 4.7402 2.55268 4.64643 2.64645C4.55266 2.74021 4.49999 2.86739 4.49999 3V11.793L3.3535 10.6465C3.25974 10.5527 3.13258 10.5001 2.99999 10.5001C2.8674 10.5001 2.74023 10.5527 2.64647 10.6465C2.55272 10.7402 2.50006 10.8674 2.50006 11C2.50006 11.1326 2.55272 11.2598 2.64647 11.3535L4.64647 13.3535C4.74022 13.4473 4.86738 13.5 4.99999 13.5C5.13259 13.5 5.25975 13.4473 5.3535 13.3535L7.3535 11.3535C7.44725 11.2598 7.49991 11.1326 7.49991 11C7.49991 10.8674 7.44725 10.7402 7.3535 10.6465C7.25974 10.5527 7.13258 10.5001 6.99999 10.5001C6.8674 10.5001 6.74024 10.5527 6.64647 10.6465L5.49999 11.793V3C5.49999 2.86739 5.44731 2.74021 5.35354 2.64645C5.25977 2.55268 5.13259 2.5 4.99999 2.5Z M11 2.5C10.8674 2.50003 10.7402 2.55272 10.6465 2.64648L8.64647 4.64648C8.55272 4.74025 8.50006 4.86741 8.50006 5C8.50006 5.13259 8.55272 5.25975 8.64647 5.35352C8.74024 5.44726 8.8674 5.49992 8.99999 5.49992C9.13258 5.49992 9.25974 5.44726 9.3535 5.35352L10.5 4.20703V13C10.5 13.1326 10.5527 13.2598 10.6464 13.3536C10.7402 13.4473 10.8674 13.5 11 13.5C11.1326 13.5 11.2598 13.4473 11.3535 13.3536C11.4473 13.2598 11.5 13.1326 11.5 13V4.20703L12.6465 5.35352C12.7402 5.44726 12.8674 5.49992 13 5.49992C13.1326 5.49992 13.2597 5.44726 13.3535 5.35352C13.4472 5.25975 13.4999 5.13259 13.4999 5C13.4999 4.86741 13.4472 4.74025 13.3535 4.64648L11.3535 2.64648C11.3487 2.64437 11.3438 2.64234 11.3389 2.64038C11.2478 2.55235 11.1266 2.50218 11 2.5Z" />
          </svg>
          <span className='text-slate-600'>Sort</span>
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

export default SortButton;