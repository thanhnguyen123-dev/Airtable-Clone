import React, { useState, useEffect, useRef, type SetStateAction, type Dispatch } from "react";
import { api } from "~/trpc/react";

type TableCellProps = {
  columnId: string;
  recordId: string;
  data: string;
  searchValue: string;
  isSorted: boolean;
  isFiltered: boolean;
};

const TableCell = ({ 
  columnId,
  recordId, 
  data, 
  searchValue, 
  isSorted, 
  isFiltered
}: TableCellProps) => {
  const [value, setValue] = useState(data);
  const [lastSaved, setLastSaved] = useState(data);
  const [isFocused, setIsFocused] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const utils = api.useUtils();
  const updateCellMutation = api.table.updateCell.useMutation({
    onMutate: async ({ }) => {
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
    if (value === lastSaved) return;

    const timer = setTimeout(() => {
      if (value !== lastSaved) {
        updateCellMutation.mutate({ columnId, recordId, data: value });
        setLastSaved(value);
      }
    }, 500);

 
    return () => clearTimeout(timer);
  }, [value, columnId, recordId, lastSaved, updateCellMutation]);

  const handleBlur = () => {
    setIsEditing(false);
    setIsFocused(false);
  }

  const handleContainerClick = () => {
    if (!isFocused) {
      setIsFocused(true);
    } else if (isFocused && !isEditing) {
      setIsEditing(true);
      inputRef.current?.focus();
    }
  };

  return (
    <div 
      className={`h-[30px] w-[160px] border-r border-gray-300 text-xs 
        ${searchValue && value.includes(searchValue) ? "bg-yellow-200" : ""}
        ${isSorted ? "bg-orange-100" : ""}
        ${isFiltered ? "bg-green-100" : ""}
        `}
      onClick={handleContainerClick}
      >
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleBlur}
        readOnly={!isEditing}
        className={`w-full h-full px-2 bg-transparent focus:outline-blue-500 ${isEditing ? "cursor-text" : "cursor-default"}`}
      />
    </div>
  );
};

export default TableCell;
