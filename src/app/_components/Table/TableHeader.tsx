import React from 'react'

type TableHeaderProps = {
  name: string,
  index?: string
}

const TableHeader = ({name, index} : TableHeaderProps) => {
  return (
    <div className="bg-slate-200 border border-slate-300 px-2 py-1 text-slate-600">
      <span>{name}</span>
    </div>
  );
}

export default TableHeader;