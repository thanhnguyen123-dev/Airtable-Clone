import {Popover, PopoverTrigger, PopoverContent} from "@heroui/popover";
import { useState, useEffect, type SetStateAction, type Dispatch } from "react";
import { api } from "~/trpc/react";
import FilterColumnDropdown from "./FilterColumnDropDown";
import FilterConditionDropdown from "./FilterConditionDropDown";
import { Span } from "next/dist/trace";
import { set } from "zod";

type FilterButtonProps = {
  tableId: string;
  currentView: string;
  filter: string;
  setFilter: Dispatch<SetStateAction<string>>;
  filterColumnId: string;
  setFilterColumnId: Dispatch<SetStateAction<string>>;
  filterValue: string;
  setFilterValue: Dispatch<SetStateAction<string>>;

  sort: string;
  sortColumnId: string;
}


const FilterButton = ({  
    tableId,
    currentView,
    filter,
    setFilter,
    filterColumnId,
    setFilterColumnId,
    filterValue,
    setFilterValue,
    sort,
    sortColumnId,
  } : FilterButtonProps) => {
  const { data: columns } = api.table.getColumns.useQuery(
    { tableId: tableId },
    { refetchOnWindowFocus: false }
  );

  const [isOpen, setIsOpen] = useState(false);

  const [colIndex, setColIndex] = useState(() =>
    columns?.findIndex((col) => col.id === filterColumnId) ?? 0
  );

  const [filterOp, setFilterOp] = useState(filter ? filter : columns?.[colIndex]?.type === "TEXT" ? "contains" : "greater than");
  const [inputValue, setInputValue] = useState(filterValue);

  const [hasFilter, setHasFilter] = useState(false);

  useEffect(() => {
    setFilterOp(columns?.[colIndex]?.type === "TEXT" ? "contains" : "greater than");
  }, [colIndex, columns]);

  const updateViewMutation = api.table.updateTableView.useMutation({
    onSuccess: async () => {
      await utils.table.getRecords.invalidate();
      await utils.table.getById.invalidate();
    }
  });

  const utils = api.useUtils();
  const handleFilter = async () => {
    setIsOpen(false);
    const newFilterColumnId = columns?.[colIndex]?.id ?? "";
    setFilterColumnId(columns?.[colIndex]?.id ?? "");
    setFilter(filterOp);
    setFilterValue(inputValue);
    setHasFilter(true);

    // if (currentView) {
    //   await updateViewMutation.mutateAsync({
    //     viewId: currentView,
    //     sortOrder: sort,
    //     sortColumnId: sortColumnId,
    //     filterCond: filterOp,
    //     filterColumnId: newFilterColumnId,
    //     filterValue: inputValue,
    //   });
    // }
  }

  const removeFilter = async () => {
    setIsOpen(false);
    setFilter(columns?.[colIndex]?.type === "TEXT" ? "contains" : "greater than");
    setFilterColumnId("");
    setFilterValue("");
    setHasFilter(false);

    // if (currentView) {
    //   await updateViewMutation.mutateAsync({
    //     viewId: currentView,
    //     sortOrder: sort,
    //     sortColumnId: sortColumnId,
    //     filterCond: "contains",
    //     filterColumnId: "",
    //     filterValue: "",
    //   });
    // }
  }

  useEffect(() => {
    setInputValue(filterValue);
  }, [filterValue]);

  useEffect(() => {
    setFilterOp(filter);
  }, [filter]);

  useEffect(() => {
    setHasFilter(sortColumnId !== "");
  }, [sortColumnId]);

  const isFiltering = (filter: string, filterVal: string) => {
    switch (filter) {
      case "contains":
        return filterVal !== "";
      case "does not contain":
        return filterVal !== "";
      case "is":
        return filterVal !== "";
      case "is not":
        return filterVal !== "";
      case "is empty":
        return true;
      case "is not empty":
        return true;
      case "greater than":
        return filterVal !== "";
      case "smaller than":
        return filterVal !== "";
      default:
        return false;
    }
  }

  const shouldShowInput = (filterOp: string) => {
    if (filterOp === "is empty" || filterOp === "is not empty") {
      return false;
    }
    return true;
  }

  return (
    <Popover
    isOpen={isOpen}
    onOpenChange={(open) => setIsOpen(open)}
    placement="bottom-start"
    triggerScaleOnOpen={false}
    classNames={{
      content: [
        "no-animation rounded-md shadow-none border border-gray-300",
      ]
    }}
    >
      <PopoverTrigger>
        <div
          role="button"
          className={`flex justify-center items-center gap-1 rounded-md px-2 py-1
            hover:bg-slate-200
            ${isFiltering(filterOp, filterValue) && hasFilter ? "bg-green-300 hover:bg-green-200" : ""}
          `}
        >
          <svg
            width={16}
            height={16}
            viewBox="0 0 16 16"
            className="flex-none"
            fill="rgb(71, 85, 105)"
          >
            <path
              fill-rule="non-zero"
              d="M6.5 10.5C6.36739 10.5 6.24021 10.5527 6.14645 10.6464C6.05268 10.7402 6 10.8674 6 11C6 11.1326 6.05268 11.2598 6.14645 11.3536C6.24021 11.4473 6.36739 11.5 6.5 11.5H9.5C9.63261 11.5 9.75979 11.4473 9.85355 11.3536C9.94732 11.2598 10 11.1326 10 11C10 10.8674 9.94732 10.7402 9.85355 10.6464C9.75979 10.5527 9.63261 10.5 9.5 10.5H6.5Z M1.5 4.5C1.36739 4.5 1.24021 4.55268 1.14645 4.64645C1.05268 4.74021 1 4.86739 1 5C1 5.13261 1.05268 5.25979 1.14645 5.35355C1.24021 5.44732 1.36739 5.5 1.5 5.5H14.5C14.6326 5.5 14.7598 5.44732 14.8536 5.35355C14.9473 5.25979 15 5.13261 15 5C15 4.86739 14.9473 4.74021 14.8536 4.64645C14.7598 4.55268 14.6326 4.5 14.5 4.5H1.5Z M4 7.5C3.86739 7.5 3.74021 7.55268 3.64645 7.64645C3.55268 7.74021 3.5 7.86739 3.5 8C3.5 8.13261 3.55268 8.25979 3.64645 8.35355C3.74021 8.44732 3.86739 8.5 4 8.5H12C12.1326 8.5 12.2598 8.44732 12.3536 8.35355C12.4473 8.25979 12.5 8.13261 12.5 8C12.5 7.86739 12.4473 7.74021 12.3536 7.64645C12.2598 7.55268 12.1326 7.5 12 7.5H4Z"
              >
              </path>
          </svg>
          <span className="text-slate-600">
            {isFiltering(filterOp, filterValue) && hasFilter ? `Filtered by ${columns?.[colIndex]?.name}` : "Filter"}
          </span>
        </div>
      </PopoverTrigger>
      <PopoverContent className={`${true ? "w-[560px]" : "w-[327px]"}`}>
        <div className="flex flex-col gap-2 p-2 w-full">
          {false ? (
            <>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-light">No filter conditions are applied</span>
                <svg
                  width={16}
                  height={16}
                  viewBox="0 0 16 16"
                  className="flex-none"
                  fill="#94a3b8"
                >
                  <use href="icons/icons_definitions.svg#Question"></use>
                </svg>
              </div>
              <div 
                role="button" 
                className="flex items-center mt-1"
                onClick={() => {
                  setHasFilter(true);
                }}
              >
                <div className="flex items-center gap-1">
                  <svg
                    width={12}
                    height={12}
                    viewBox="0 0 16 16"
                    className="flex-none"
                    fill="rgb(71, 85, 105)"
                  >
                    <use href="icons/icons_definitions.svg#Plus"></use>
                  </svg>
                  <span className="text-slate-500 text-xs font-semibold">Add a condition</span>
                </div>
              </div>
            </>
          ) : 
          (
            <>
              <div className="text-xs font-normal text-slate-500">
                <span>In this view, show records</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="text-xs mr-3 text-slate-600">Where</span>
                <div className="flex items-center justify-center">
                  <FilterColumnDropdown
                    columns={columns ?? []}
                    selectedColumnIndex={colIndex}
                    setSelectedColumnIndex={setColIndex}
                  />
                  <FilterConditionDropdown
                    filterCondition={filterOp}
                    setFilterCondition={setFilterOp}
                    columnType={columns?.[colIndex]?.type ?? ""}
                  />
                  <div className="flex items-center px-2 h-[25.6px] w-[124px] border-slate-200 border">
                    {shouldShowInput(filterOp) && (
                      <input
                        type="text"
                        className="w-full text-xs text-slate-600 focus:outline-none"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Enter value"
                      />
                    )}
                  </div>
                  <div
                    role="button"
                    className="flex items-center justify-center px-2 h-[25.6px] w-[30px] border-y hover:bg-gray-100"
                    onClick={removeFilter}
                  >
                    <svg
                      width={14}
                      height={14}
                      viewBox="0 0 16 16"
                      className="flex-none"
                      fill="rgb(71, 85, 105)"
                    >
                      <use href="icons/icons_definitions.svg#Trash"></use>
                    </svg>
                  </div>
                  <div
                    role="button"
                    className="flex items-center justify-center px-2 h-[25.6px] w-[30px] border rounded-r-sm hover:bg-gray-100"
                  >
                    <svg
                      width={14}
                      height={14}
                      viewBox="0 0 16 16"
                      className="flex-none"
                      fill="rgb(71, 85, 105)"
                    >
                      <use href="icons/icons_definitions.svg#DotsSixVertical"></use>
                    </svg>
                  </div>
                </div>
              </div>
              <div 
                role="button"
                onClick={handleFilter}
                className="flex items-center gap-1">
                {/* <svg
                  width={12}
                  height={12}
                  viewBox="0 0 16 16"
                  className="flex-none"
                  fill="rgb(71, 85, 105)"
                >
                  <use href="icons/icons_definitions.svg#Plus"></use>
                </svg> */}
                <span className="text-blue-500 text-xs font-semibold">Filter</span>
              </div>
            </>
          )}
          
        </div>
       </PopoverContent> 
    </Popover>
  );
}





export default FilterButton;
