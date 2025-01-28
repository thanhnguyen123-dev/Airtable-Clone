type TableRowProps = {
  children: React.ReactNode
}


const TableRow = ({children} : TableRowProps) => {
  return (
    <div className="flex">
      {children}
    </div>
  );
}

export default TableRow;