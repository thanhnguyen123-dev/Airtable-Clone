import { useState, Dispatch, SetStateAction } from "react";

type NavViewButtonProps = {
  name: string;
  viewId: string;
  currentView: string;
  setCurrentView: Dispatch<SetStateAction<string>>;
}

const NavViewButton = ( {name, viewId, currentView, setCurrentView} : NavViewButtonProps ) => {

  const handleClick = () => {
    setCurrentView(viewId);
  }

  return (
    <div
      role="button"
      className={`flex items-center gap-2 p-2 rounded-md hover:bg-slate-200 ${currentView === viewId ? 'bg-blue-200' : ''}`}
      onClick={handleClick}
    >
      <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      className="flex-none"
      fill="rgb(22, 110, 225)"
      fill-rule="evenodd"
      >
        <path fill-rule="non-zero" d="M2.5 2C1.67157 2 1 2.67157 1 3.5V12.5C1 13.3284 1.67157 14 2.5 14H13.5C14.3284 14 15 13.3284 15 12.5V3.5C15 2.67157 14.3284 2 13.5 2H2.5ZM2 3.5C2 3.22386 2.22386 3 2.5 3H13.5C13.7761 3 14 3.22386 14 3.5V5H2V3.5ZM8.5 6H14V9H8.5V6ZM7.5 9V6H2V9H7.5ZM2 10V12.5C2 12.7761 2.22386 13 2.5 13H7.5V10H2ZM8.5 10H14V12.5C14 12.7761 13.7761 13 13.5 13H8.5V10Z" />
      </svg>
      <span className="font-semibold text-xs">{name}</span>
    </div>
  );
}

export default NavViewButton;