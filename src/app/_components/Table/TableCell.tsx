import React, { useState } from "react";
import { api } from "~/trpc/react";

type TableCellProps = {
  columnId: string;
  recordId: string;
  data: string;
};

const TableCell = ({ columnId, recordId, data }: TableCellProps) => {
  const [value, setValue] = useState(data);
  const [isEditing, setIsEditing] = useState(false);

  const utils = api.useUtils();
  const updateCellMutation = api.table.updateCell.useMutation({
    onMutate: async ({ data }) => {
      await utils.table.getById.cancel();
      return { prevValue: value };
    },
    onError: (err, _, context) => {
      if (context?.prevValue) {
        setValue(context.prevValue); // Revert value if error occurs
      }
    },
    onSettled: () => void utils.table.getById.invalidate(), // Ensure the UI stays in sync
  });

  const handleBlur = () => {
    setIsEditing(false);
    if (value !== data) {
      updateCellMutation.mutate({ columnId, recordId, data: value });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleBlur();
    }
  };

  return (
    <div className="h-[30px] w-[160px] border-r border-gray-300 text-xs">
      <input
        type="text"
        value={value}
        onFocus={() => setIsEditing(true)}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="w-full h-full px-2 bg-transparent focus:outline-blue-500"
      />
    </div>
  );
};

export default TableCell;
