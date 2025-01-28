import TableCell from "./TableCell";
import TableRow from "./TableRow";
import TableHeader from "./TableHeader";

const Table = () => {
  return (
    <div className="flex-grow overflow-auto bg-white">
      <div className="grid grid-cols-[200px_repeat(4,1fr)]">
        <TableHeader headerName="Name" d="" />
        <TableHeader headerName="Notes" d="" />
        <TableHeader headerName="Assigne" d="" />
        <TableHeader headerName="Status" d="" />
      </div>
      <div className="grid grid-cols-[200px_repeat(4,1fr)] hover:bg-gray-50">
        <TableCell />
        <TableCell />
        <TableCell />
        <TableCell />
      </div>
      <div className="grid grid-cols-[200px_repeat(4,1fr)] hover:bg-gray-50">
        <TableCell />
        <TableCell />
        <TableCell />
        <TableCell />
      </div>
      <div className="grid grid-cols-[200px_repeat(4,1fr)] hover:bg-gray-50">
        <TableCell />
        <TableCell />
        <TableCell />
        <TableCell />
      </div>
      <div className="grid grid-cols-[200px_repeat(4,1fr)] hover:bg-gray-50">
        <TableCell />
        <TableCell />
        <TableCell />
        <TableCell />
      </div>
  </div>

  )
}

export default Table;