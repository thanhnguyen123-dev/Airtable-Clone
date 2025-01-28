import React from 'react'

type TableHeaderProps = {
  name: string;
}

const TableHeader = ({name} : TableHeaderProps) => {
  return (
    <div className="bg-slate-200 border border-slate-300 px-2 py-1">
      <span>{name}</span>
    </div>
  );
}

export default TableHeader;