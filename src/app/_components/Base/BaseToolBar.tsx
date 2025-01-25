import React from 'react'

const BaseToolBar = () => {
  return (
    <div 
      style={{backgroundColor: 'var(--pale-teal-green)'}}
      className="flex items-center justify-between w-full h-[2rem] sticky top-0 z-20"
    >
      <div 
        style={{backgroundColor: "var(--dark-teal-green"}}
        className="flex items-center gap-2 w-[88%] h-[2rem] px-4 sticky top-0 rounded-tr-md"
      >
        <div className="flex items-center justify-center bg-white border-none text-sm font-medium text-black p-3 h-full rounded-t-[0.25rem]"
        >
          <span className="text-xs">Table 1</span>
        </div>
        
        <svg
          role='button'
          width={16}
          height={16}
          viewBox="0 0 16 16"
          className="flex-none"
          fill="white"
        >
          <use href="icons/icons_definitions.svg#ChevronDown"></use>
        </svg>

        <div className="separator"></div>

        <div role='button' className="flex items-center justify-center gap-2">
          <svg
            width={16}
            height={16}
            viewBox="0 0 16 16"
            className="flex-none"
            fill="white"
          >
            <use href="icons/icons_definitions.svg#Plus"></use>
          </svg>
          <span className="text-white text-xs">Add or import</span>
        </div>
      </div>

      <div 
        style={{backgroundColor: "var(--dark-teal-green"}}
        className="flex text-white text-xs justify-between items-center w-[11.5%] h-[2rem] px-4 sticky top-0 rounded-tl-md"
      >
        <div role='button'>
          <span>Extensions</span>
        </div>

        <div role='button' className='flex items-center gap-2'>
          <span>Tools</span>
          <svg
            role='button'
            width={16}
            height={16}
            viewBox="0 0 16 16"
            className="flex-none"
            fill="white"
          >
            <use href="icons/icons_definitions.svg#ChevronDown"></use>
          </svg>
        </div>
      </div>
    </div>
  )
}

export default BaseToolBar