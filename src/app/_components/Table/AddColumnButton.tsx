import React, { useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@heroui/popover";
import ColumnTypeDropDown from "./ColumnTypeDropDown";

type AddColumnProps = {
  onCreated?: (columnName: string, columnType: string) => void;
  colType?: string;
};

const AddColumnButton = ({ onCreated, colType = "TEXT" }: AddColumnProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [columnName, setColumnName] = useState("");
  const [columnType, setColumnType] = useState(colType);

  const handleCreate = () => {
    if (!columnName.trim()) return;
    onCreated?.(columnName.trim(), columnType);
    setColumnName("");
    setColumnType(colType);
    setIsOpen(false);
  };

  return (
    <Popover
      key="add-col-btn"
      isOpen={isOpen}
      onOpenChange={(open) => setIsOpen(open)}
      placement="bottom-start"
      offset={1}
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
          className="border-r border-gray-300 flex items-center justify-center text-xs w-[92px] bg-gray-100"
        >
          <svg
            width={16}
            height={16}
            viewBox="0 0 16 16"
            className="flex-none"
            fill="rgb(71, 85, 105)"
          >
            <use href="icons/icons_definitions.svg#Plus"></use>
          </svg>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[400px]">
        <div className="flex flex-col gap-2 p-2 w-full">
          <div className="flex flex-col gap-3">
            <input
              type="text"
              value={columnName}
              onChange={(e) => setColumnName(e.target.value)}
              placeholder="Field name"
              className="border border-slate-200 px-2 py-1 rounded-md text-sm w-full focus:outline-none focus:border-blue-600 focus:border-2"
            />

            <ColumnTypeDropDown 
              columnType={columnType}
              setColumnType={setColumnType}
            />
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={() => setIsOpen(false)}
              className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={!columnName.trim()}
              className={`px-3 py-1.5 text-xs text-white rounded-md bg-blue-600 hover:bg-blue-500
                ${columnName.trim() 
                  ? "" 
                  : "cursor-not-allowed"}`}
            >
              Create field
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AddColumnButton;