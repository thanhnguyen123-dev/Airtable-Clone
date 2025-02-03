import React, { useState, useEffect } from "react";
import { api } from "~/trpc/react";

type TableCellProps = {
  columnId: string;
  recordId: string;
  data: string;
};

const TableCell = ({ columnId, recordId, data }: TableCellProps) => {
  const [value, setValue] = useState(data);
  const [lastSaved, setLastSaved] = useState(data);

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

  return (
    <div className="h-[30px] w-[160px] border-r border-gray-300 text-xs">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full h-full px-2 bg-transparent focus:outline-blue-500"
      />
    </div>
  );
};

export default TableCell;
