import React from 'react'

type TableHeaderProps = {
  header: string,
  index?: string
}

const TableHeader = ({header, index} : TableHeaderProps) => {
  return (
    <div className="bg-slate-200 border border-slate-300 px-2 py-1 text-slate-600">
      <span>{header}</span>
    </div>
  );
}

export default TableHeader;