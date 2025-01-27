
import React from "react";

type HomeCreateButtonProps = {
  handleCreateBase: () => void;
};

const HomeCreateButton = ({handleCreateBase} : HomeCreateButtonProps) => {
  return (
    <button 
      className="bg-blue-600 w-full flex justify-center items-center p-[0.4rem] rounded-md gap-2 mt-2"
      onClick={handleCreateBase}>
      <svg
        width="14"
        height="14"
        viewBox="0 0 16 16"
        className="flex-none"
        fill="white"
      >
        <use href="/icons/icons_definitions.svg#Plus"></use>
      </svg>
      <span className="text-white text-[0.75rem]">Create</span>
    </button>
  )
}

export default HomeCreateButton;