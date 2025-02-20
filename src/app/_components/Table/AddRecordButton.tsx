import { type Column } from "@prisma/client"

type AddRecordButtonProps = {
  handleClick: () => void;
  text?: string;
  columns?: Column[];
}

const AddRecordButton = ({ handleClick, text, columns } : AddRecordButtonProps) => {
  return (
      <div
      role="button"
      onClick={handleClick}
      className="flex border-t border-r border-gray-300 hover:bg-gray-50"
      style={{
        height: "40px",
      }}
    >
      <div
        className="flex items-center border-gray-300 text-xs w-[230px]"
        style={{ height: "40px" }}
      >
        <div className="flex items-center justify-start w-[70px] pl-[12px]">
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
        <span
          className="text-sm text-blue-600"
        >
          {text}
        </span>
      </div>

      {columns?.slice(1).map((_, i) => (
        <div
          key={`add-record-col-${i}`}
          className="flex items-center border-gray-300 text-xs w-[180px]"
          style={{ height: "40px" }}
        />
      ))}
    </div>
  )
}

export default AddRecordButton;