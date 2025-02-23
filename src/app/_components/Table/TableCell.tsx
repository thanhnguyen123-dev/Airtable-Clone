import React, { useState, useEffect, useRef } from "react";
import { api } from "~/trpc/react";

type TableCellProps = {
  columnId: string;
  recordId: string;
  data: string;
  searchValue: string;
  isSorted: boolean;
  isFiltered: boolean;
  columnType: string;
};

const TableCell = ({
  columnId,
  recordId,
  data,
  searchValue,
  isSorted,
  isFiltered,
  columnType,
}: TableCellProps) => {
  const [value, setValue] = useState(data);
  const [lastSaved, setLastSaved] = useState(data);
  const [isFocused, setIsFocused] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const utils = api.useUtils();
  const updateCellMutation = api.table.updateCell.useMutation({
    onMutate: async () => {
      await utils.table.getById.cancel();
      return { prevValue: value };
    },
    onError: (err, _, context) => {
      if (context?.prevValue) {
        setValue(context.prevValue);
      }
    },
    onSettled: () => {
      void utils.table.getById.invalidate();
      void utils.table.getRecords.invalidate();
    },
  });

  useEffect(() => {
    // Debounce saving
    const timer = setTimeout(() => {
      if (value !== lastSaved) {
        updateCellMutation.mutate({ columnId, recordId, data: value });
        setLastSaved(value);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [value, lastSaved, columnId, recordId, updateCellMutation]);

  useEffect(() => {
    setValue(data);
    setLastSaved(data);
  }, [data]);


  const handleBlur = () => {
    setIsEditing(false);
    setIsFocused(false);
  };

  const handleContainerClick = () => {
    if (!isFocused) {
      setIsFocused(true);
    } else if (isFocused && !isEditing) {
      setIsEditing(true);
      inputRef.current?.focus();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (
      columnType === "NUMBER" &&
      e.target.value !== "" &&
      !/^\d+$/.test(e.target.value)
    ) {
      return;
    }

    setValue(e.target.value);
  };

  const hasBothFilterAndSort = isFiltered && isSorted;
  
  const colorize = (searchValue: string, isFiltered: boolean, isSorted: boolean) => {
    if (searchValue && value.toLowerCase().includes(searchValue.toLowerCase())) {
      return "bg-yellow-200";
    }
    if (hasBothFilterAndSort) {
      return "bg-[#EBE6A7]";
    }
    if (isFiltered && !hasBothFilterAndSort) {
      return "bg-[#EBFBEC]";
    }
    if (isSorted && !hasBothFilterAndSort) {
      return "bg-[#FFF2EA]";
    }
    return "";
  }


  return (
    <div
      className={` flex items-center
        border-r border-gray-300 text-xs w-full h-full py-[1px]
      `}
      onClick={handleContainerClick}
    >
      <input
        ref={inputRef}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        readOnly={!isEditing}
        className={`w-full h-full px-2 focus:outline-blue-500 
          ${isEditing ? "cursor-text" : "cursor-default"}
          ${colorize(searchValue, isFiltered, isSorted)}
          `}
      />
    </div>
  );
};

export default TableCell;
