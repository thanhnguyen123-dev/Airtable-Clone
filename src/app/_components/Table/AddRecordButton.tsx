import { type Column } from "@prisma/client"

type AddRecordButtonProps = {
  handleAddRecord: () => void;
  handleAddFakeRecords: () => void;
}

type AddButtonProps = {
  handleClick: () => void;
  text: string;
  d: string;
}

const AddRecordButton = ({ 
  handleAddRecord, 
  handleAddFakeRecords, 
} : AddRecordButtonProps) => {
  return (
      <div
      className="flex items-center gap-24"
    >
      <AddButton handleClick={handleAddRecord} text="Add record" d="Plus" />
      <AddButton handleClick={handleAddFakeRecords} text="Generate fake records" d="Database" />
    </div>
  )
}

const AddButton = ({ 
  handleClick, 
  text, 
  d } : AddButtonProps) => {
  return (
    <div
    role="button"
    className="flex gap-2 items-center border-gray-300 text-xs hover:bg-gray-100 h-[1/2] px-1 py-[2px] rounded-md"
    onClick={handleClick}
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 16 16"
        className="flex-none"
        fill="rgb(71, 85, 105)"
      >
        <use href={`icons/icons_definitions.svg#${d}`}></use>
      </svg>
      <span
        className="text-xs text-blue-600"
      >
        {text}
      </span>
    </div>
  )
}

export default AddRecordButton;