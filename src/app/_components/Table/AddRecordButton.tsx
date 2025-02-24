import { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";

type AddRecordButtonProps = {
  handleAddRecord: () => void;
  handleAddFakeRecords: () => Promise<void>;
  isLoading?: boolean;
}

type AddButtonProps = {
  handleClick: () => void;
  text: string;
  d: string;
  isLoading?: boolean;
}

const AddRecordButton = ({ 
  handleAddRecord, 
  handleAddFakeRecords, 
} : AddRecordButtonProps) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateFakeRecords = async () => {
    setIsGenerating(true);
    try {
      await handleAddFakeRecords();
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex items-center gap-24">
      <AddButton 
        handleClick={handleAddRecord} 
        text="Add record" 
        d="Plus" 
      />
      <div className="flex flex-col items-center gap-2">
        <AddButton 
          handleClick={handleGenerateFakeRecords} 
          text="Generate records" 
          d="Database"
          isLoading={isGenerating}
        />
      </div>
    </div>
  )
}

const AddButton = ({ 
  handleClick, 
  text, 
  d,
  isLoading 
} : AddButtonProps) => {
  return (
    <div
      role="button"
      className={`flex gap-2 items-center border-gray-300 text-xs 
        ${!isLoading ? 'hover:bg-gray-100' : 'cursor-not-allowed opacity-50'} 
        h-[1/2] px-1 py-[2px] rounded-md`}
      onClick={!isLoading ? handleClick : undefined}
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
      <span className="text-xs text-blue-600">
        {isLoading ? "Generating..." : text}
      </span>
      {isLoading && (
        <CircularProgress size={10} />
      )}
    </div>
  )
}

export default AddRecordButton;