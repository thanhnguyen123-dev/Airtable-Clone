import TableCell from "./TableCell";
import TableRow from "./TableRow";
import TableHeader from "./AddColumn";

const Table = () => {
  return (
    <div className="flex-grow overflow-auto bg-white">
      <div className="grid grid-cols-[200px_repeat(4,1fr)]">
        <TableHeader />
      </div>
  </div>

  )
}

export default Table;