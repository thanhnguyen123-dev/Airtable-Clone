import React, {type SVGProps } from 'react';

type TableToolItemProps = {
  d: string
  name?: string
  handleClick?: () => void
}

const TableToolItem = ({d, name, handleClick}: TableToolItemProps) => {
  return (
    <div role='button' className='flex justify-center items-center gap-1 rounded-md px-2 py-1 hover:bg-slate-200' onClick={handleClick}>
      <svg
        width={16}
        height={16}
        viewBox="0 0 16 16"
        className="flex-none"
        fill="rgb(71 85 105)"
      >
        <path fill-rul="non-zero" d={d} />
      </svg>
      <span className='text-slate-600'>{name}</span>
    </div>
  );
}

export default TableToolItem;