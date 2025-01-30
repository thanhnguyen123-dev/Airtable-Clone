type TableCellProps = {
  columnId: string;
  recordId: string;
  data: string;
  rowIndex?: number
}

const TableCell = ({ columnId, recordId, data, rowIndex }: TableCellProps) => {
  return (
    <div>
      <input
        type="text"
        className="border border-slate-300 w-full px-2 py-1"
      />
    </div>
  );
}

export default TableCell;