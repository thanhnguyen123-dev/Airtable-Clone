import { useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@heroui/popover";

type ColumnTypeDropDownProps = {
  columnType: string;
  setColumnType: (type: string) => void;
};

const COLUMN_TYPES = [
  { label: "Text", value: "TEXT" },
  { label: "Number", value: "NUMBER" },
];  

const ColumnTypeDropDown = ({ columnType, setColumnType }: ColumnTypeDropDownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      placement="bottom-start"
      classNames={{
        content: [
          "no-animation rounded-md shadow-none border border-gray-300",
        ]
      }}
    >
      <PopoverTrigger>
        <div 
          className="flex items-center justify-between border border-slate-200 py-1 px-2 rounded-md text-sm w-full focus:outline-none"
          role="button"
          >
          <div className="flex items-center gap-2">
            <svg
              width={16}
              height={16}
              viewBox="0 0 16 16"
              className="flex-none"
              fill="rgb(71, 85, 105)"
            >
              {COLUMN_TYPES.find(type => type.value === columnType)?.label === "Text" ? <use href="icons/icons_definitions.svg#TextAlt"></use> : <use href="icons/icons_definitions.svg#HashStraight"></use>}
            </svg>
            <span className="text-slate-600">
              {COLUMN_TYPES.find(type => type.value === columnType)?.label}
            </span>
          </div>
          <svg
            width={14}
            height={14}
            viewBox="0 0 16 16"
            className="flex-none"
            fill="rgb(71, 85, 105)"
          >
            <use href="icons/icons_definitions.svg#ChevronDown"></use>
          </svg>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-full px-1">
        <div className="flex flex-col w-[342px]">
          {COLUMN_TYPES.map((type) => (
            <div
              key={type.value}
              role="button"
              className={`flex items-center gap-2 px-2 py-1 text-sm rounded-md text-slate-500 hover:bg-gray-100`}
              onClick={() => {
                setColumnType(type.value);
                setIsOpen(false);
              }}
            > 
              <svg
                width={16}
                height={16}
                viewBox="0 0 16 16"
                className="flex-none"
                fill="rgb(71, 85, 105)"
              >
                {type.label === "Text" ? <use href="icons/icons_definitions.svg#TextAlt"></use> : <use href="icons/icons_definitions.svg#HashStraight"></use>}
              </svg>
              {type.label}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ColumnTypeDropDown;