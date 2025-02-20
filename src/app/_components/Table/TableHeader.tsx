import React from "react";

type TableHeaderProps = {
  header: string;
  index?: string;
  isSorted: boolean;
  isFiltered: boolean;
};

const TableHeader = ({ header, index, isSorted, isFiltered }: TableHeaderProps) => {
  const isFirstCol = index === "0";
  const containerWidth = isFirstCol ? "w-[230px]" : "w-[160px]";

  return (
    <div className={`flex h-8 items-center ${containerWidth} border-gray-300
      ${isSorted ? "bg-orange-100" : "bg-gray-100"}
      ${isFiltered ? "bg-green-100" : ""}
    `}>
      <div className={`w-full flex items-center justify-between p-2`}>
        <div className="flex items-center gap-2">
          {isFirstCol && (
            <div className="flex items-center justify-center pl-[9px]">
              <input
                type="checkbox"
                name="select"
                className="mr-2 h-3 w-3"
              />
            </div>
          )}
          <span className="text-xs text-slate-700 font-normal">{header}</span>
        </div>
        <svg
          role="button"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          className="flex-none"
        >
          <use
            fill="currentColor"
            href="/icons/icons_definitions.svg#ChevronDown"
          />
        </svg>
        
      </div>
    </div>
  );
};

export default TableHeader;
