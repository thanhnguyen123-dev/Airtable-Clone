import { useState } from "react";
import { api } from "~/trpc/react";

type TableHeaderProps = {
  tableId: string;
  refetch: () => void;
}

const TableHeader = ({tableId, refetch} : TableHeaderProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [columnName, setColumnName] = useState("");
  const [columnType, setColumnType] = useState<"TEXT" | "NUMBER">("TEXT");

  const createColumnMutation = api.table.create.useMutation({
    onSuccess: () => {
      refetch();
      setIsAdding(false);
      setColumnName("");
      setColumnType("TEXT");
    }
  });



  return (
    <div className="flex items-center justify-between border bg-slate-100 p-2">
      <div className="flex items-center gap-2">
        <svg
          width={16}
          height={16}
          viewBox="0 0 16 16"
          fill="none"
        >
          <path d={d} fill="black" />
        </svg>
        <span className="text-xs">{headerName}</span>
      </div>
      <svg
        width={16}
        height={16}
        viewBox="0 0 16 16"
        fill="black"
      >
        <use href="icons/icons_definitions.svg#ChevronDown"></use>
      </svg>
    </div>
  );
}

export default TableHeader;