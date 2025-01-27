import React from 'react';

type NavTableButtonProps = {
  tableName: string,
  isActive: boolean,
  handleClick: () => void,
}

const NavTableButton = ({tableName, isActive, handleClick} : NavTableButtonProps) => {
  return (
    <>
      <div 
        role="button"
        onClick={handleClick}
        className={`flex items-center justify-center border-none text-sm font-medium 
        text-black p-3 h-full ${isActive ? "rounded-t-[0.20rem] bg-white" : "hover:bg-darker-teal-green bg-dark-teal-green text-white"}`}
      >
        <span className={`text-xs ${isActive ? "font-bold" : "font-normal text-slate-100"}`}>{tableName}</span>
        {isActive && (
          <svg
            role='button'
            width={14}
            height={14}
            viewBox="0 0 16 16"
            className="flex-none ml-2"
            fill="black"
          >
            <use href="icons/icons_definitions.svg#ChevronDown"></use>
          </svg>
        )}
      </div>
    </>
  );
}

export default NavTableButton;