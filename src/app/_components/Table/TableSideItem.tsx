import React from 'react';

type TableSideItemProps = {
  handleClick?: () => void,
  name: string,
  color?: string
  d?: string
}

const TableSideItem = ({handleClick, name, color, d} : TableSideItemProps) => {
  return (
    <div role='button' onClick={handleClick}  className='w-full flex items-center justify-between p-2 rounded-md hover:bg-slate-200'>
      <div className='flex items-center gap-2'>
        <svg
          width={16}
          height={16}
          viewBox="0 0 16 16"
          className="flex-none"
          fill={color}
        >
          <path fill-rule="non-zero" d={d} />
        </svg>
        <span className='text-xs font-medium'>{name}</span>
      </div>

      <svg
        width={16}
        height={16}
        viewBox="0 0 16 16"
        className="flex-none"
        fill="rgb(71 85 105)"
      >
        <use href="icons/icons_definitions.svg#Plus"></use>
      </svg>
    </div>
  );
}

export default TableSideItem;