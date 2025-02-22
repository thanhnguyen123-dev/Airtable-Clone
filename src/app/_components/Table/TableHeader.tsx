import React from "react";

type TableHeaderProps = {
  header: string;
  index?: string;
  isSorted: boolean;
  isFiltered: boolean;
  columnType: string;
};

const TableHeader = ({ 
  header, 
  index, 
  isSorted, 
  isFiltered, 
  columnType }: TableHeaderProps) => {
  const isFirstCol = index === "0";

  return (
    <div className={`flex items-center justify-between px-2 border-gray-300 w-full
      ${isSorted ? "bg-orange-100" : "bg-gray-100"}
      ${isFiltered ? "bg-green-100" : ""}
    `}>
      <div className="flex items-center">
        {isFirstCol && (
          <div className="flex items-center justify-center pl-[9px]">
            <input
              type="checkbox"
              name="select"
              className="mr-2 h-3 w-3"
            />
          </div>
        )}
        <div className="flex items-center mr-1">
          {columnType === "TEXT" ?
            (
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                className="flex-none"
                fill="rgb(71, 85, 105)"
              >
                <use href="icons/icons_definitions.svg#TextAlt"></use>
              </svg>
            ) : (
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                className="flex-none"
                fill="rgb(71, 85, 105)"
              >
                <use href="icons/icons_definitions.svg#HashStraight"></use>
              </svg>
            )
          }
        </div>
        <span className="text-xs text-slate-700 font-normal">{header}</span>
      </div>  
      <svg
        role="button"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        className="flex-none"
      >
        <use href="icons/icons_definitions.svg#ChevronDown"></use>
      </svg>  
    </div>
  );
};

export default TableHeader;
