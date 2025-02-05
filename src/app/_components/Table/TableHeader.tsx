import React from "react";

type TableHeaderProps = {
  header: string;
  index?: string;
};

const TableHeader = ({ header, index }: TableHeaderProps) => {
  const isFirstCol = index === "0";
  const containerWidth = isFirstCol ? "w-[230px]" : "w-[160px]";

  return (
    <div className={`flex h-8 items-center ${containerWidth}  border-r border-gray-300 bg-gray-100`}>
      <div className={`w-full flex items-center justify-between p-1`}>
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

          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 16 16" 
            className="flex-none">
            <use
              fill="gray"
              href="/icons/icons_definitions.svg#Paragraph"
            />
          </svg>

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
