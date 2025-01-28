import { useState, useRef, useEffect } from "react";
import { api } from "~/trpc/react";

type TableHeaderProps = {
  tableId: string;
  refetch: () => void;
};

const TableHeader = ({ tableId, refetch }: TableHeaderProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [columnName, setColumnName] = useState("");
  const [columnType, setColumnType] = useState<"TEXT" | "NUMBER">("TEXT");

  const dropdownRef = useRef<HTMLDivElement>(null);

  const createColumnMutation = api.table.create.useMutation({
    onSuccess: () => {
      refetch();
      setColumnName("");
      setColumnType("TEXT");
      setIsAdding(false);
    },
  });

  const handleCreateColumn = async () => {
    if (columnName.trim() === "") {
      return;
    }

    try {
      await createColumnMutation.mutateAsync({
        baseId: tableId,
        name: columnName,
        type: columnType,
      });
    } catch (error) {
      console.log("Failed to create column: ", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsAdding(false);
      }
    };

    if (isAdding) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isAdding]);

  return (
    <div className="relative flex flex-col items-start gap-2">
      <button
        onClick={() => setIsAdding(!isAdding)}
        className="flex items-center justify-center bg-[#e7edf6] px-8 py-[0.35rem]"
      >
        <svg
          width={16}
          height={16}
          viewBox="0 0 16 16"
          fill="black"
          className="flex-none"
        >
          <use href="icons/icons_definitions.svg#Plus"></use>
        </svg>
      </button>
      {isAdding && (
        <div
          ref={dropdownRef}
          className="absolute top-8 left-0 flex flex-col gap-2 border rounded-md p-3 z-50 bg-white w-64 shadow-md"
        >
          <input
            type="text"
            value={columnName}
            onChange={(e) => setColumnName(e.target.value)}
            placeholder="Field name"
            className="border p-2 rounded-md text-xs w-full"
          />
          <select
            value={columnType}
            onChange={(e) => setColumnType(e.target.value as "TEXT" | "NUMBER")}
            className="border p-2 rounded-md text-xs w-full"
          >
            <option value="TEXT">Single line text</option>
            <option value="NUMBER">Number</option>
          </select>
          <div className="flex justify-end gap-2 mt-1">
            <button
              onClick={() => setIsAdding(false)}
              className="hover:bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateColumn}
              className="bg-blue-600 text-white px-2 py-1 rounded-md text-xs"
            >
              Add field
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableHeader;
