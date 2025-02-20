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
    },
  });

  useEffect(() => {
    // Debounce saving
    const timer = setTimeout(() => {
      if (value !== lastSaved) {
        updateCellMutation.mutate({ columnId, recordId, data: value });
        setLastSaved(value);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [value, lastSaved, columnId, recordId, updateCellMutation]);

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


  return (
    <div
      className={`
        border-r border-gray-300 text-xs
        ${searchValue && value.includes(searchValue) ? "bg-yellow-200" : ""}
      `}
      style={{ width: "100%", height: "100%" }}
      onClick={handleContainerClick}
    >
      <input
        ref={inputRef}
        // type={columnType === "NUMBER" ? "text" : "text"}
        // inputMode={columnType === "NUMBER" ? "numeric" : "text"}
        // pattern={columnType === "NUMBER" ? "\\d*" : undefined}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        readOnly={!isEditing}
        className="w-full h-full px-2 bg-transparent focus:outline-blue-500"
      />
    </div>
  );
};

export default TableCell;
