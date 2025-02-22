import { type Column } from "@prisma/client"

type AddRecordButtonProps = {
  handleAddRecord: () => void;
  handleAddFakeRecords: () => void;
}

type AddButtonProps = {
  handleClick: () => void;
  text: string;
}

const AddRecordButton = ({ 
  handleAddRecord, 
  handleAddFakeRecords, 
} : AddRecordButtonProps) => {
  return (
      <div
      className="flex items-center pl-[15px] gap-24 border-t border-r border-gray-300 h-[40px]"
    >
      <AddButton handleClick={handleAddRecord} text="Add record" />
      <AddButton handleClick={handleAddFakeRecords} text="Generate fake records" />
    </div>
  )
}

const AddButton = ({ 
  handleClick, 
  text } : AddButtonProps) => {
  return (
    <div
    role="button"
    className="flex gap-2 items-center border-gray-300 text-xs hover:bg-gray-100 h-[1/2] px-2 py-1 rounded-md"
    onClick={handleClick}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        className="flex-none"
        fill="rgb(71, 85, 105)"
      >
        <use href="icons/icons_definitions.svg#Plus"></use>
      </svg>
      <span
        className="text-sm text-blue-600"
      >
        {text}
      </span>
    </div>
  )
}

export default AddRecordButton;