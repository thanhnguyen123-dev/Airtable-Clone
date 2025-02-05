type AddRecordButtonProps = {
  handleClick: () => void;
  text?: string;
}

const AddRecordButton = ({ handleClick, text } : AddRecordButtonProps) => {
  return (
    <div
    className={`flex h-[30px] items-center border-b border-r w-full border-gray-300 bg-white pr-5 text-left text-[13px] text-gray-500 hover:bg-gray-50`}
    role="button"
    onClick={handleClick}
    > 
      <div className="flex items-center w-[230px] h-full border-r border-gray-300 pl-[13px]">
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          className="flex-none"
          fill="rgb(71, 85, 105)"
        >
          <use href="icons/icons_definitions.svg#Plus"></use>
        </svg>
      </div>
      <span className="p-2 text-gray-400">{text}</span>
  </div>
  )
}

export default AddRecordButton;