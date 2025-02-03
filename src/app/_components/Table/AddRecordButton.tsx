type AddRecordButtonProps = {
  handleClick: () => void;
  text: string;
}

const AddRecordButton = ({ handleClick, text } : AddRecordButtonProps) => {
  return (
    <div
    className={`flex pl-[0.1rem] h-8 items-center border-b border-r w-full border-gray-300 bg-white pr-5 text-left text-[13px] text-gray-500 hover:bg-gray-50`}
    role="button"
    onClick={handleClick}
    >
      <span className="p-3 text-gray-500">{text}</span>
  </div>
  )
}

export default AddRecordButton;