import {Popover, PopoverTrigger, PopoverContent} from "@heroui/popover";
import { useState, type SetStateAction, type Dispatch } from "react";


type CreateViewButtonProps = {
  viewName: string;
  setViewName:Dispatch<SetStateAction<string>>;
  handleCreateView: () => void;
};

const CreateViewButton = ({ 
  viewName, 
  setViewName, 
  handleCreateView  } : CreateViewButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleCreateViewAndClose = () => {
    handleCreateView();
    setIsOpen(false);
  }

  return (
    <div className="flex flex-col gap-2">
      <Popover 
        isOpen={isOpen} 
        onOpenChange={
          (open) => {
            setIsOpen(open);
            if (open) setViewName("Grid View");
          }
        } 
        offset={10}
        placement={"right-start"}
        triggerScaleOnOpen={false}
        classNames={{
          content: [
            "rounded-md shadow-none border border-gray-300 ",
          ]
        }}
        >
        <PopoverTrigger>
          <div role='button' className='w-full flex items-center justify-between p-2 rounded-md hover:bg-slate-200'>
            <div className='flex items-center gap-2'>     
              <svg
              width={16}
              height={16}
              viewBox="0 0 16 16"
              className="flex-none"
              fill="rgb(22, 110, 225)"
              fill-rule="evenodd"
              >
                <path fill-rule="non-zero" d={"M2.5 2C1.67157 2 1 2.67157 1 3.5V12.5C1 13.3284 1.67157 14 2.5 14H13.5C14.3284 14 15 13.3284 15 12.5V3.5C15 2.67157 14.3284 2 13.5 2H2.5ZM2 3.5C2 3.22386 2.22386 3 2.5 3H13.5C13.7761 3 14 3.22386 14 3.5V5H2V3.5ZM8.5 6H14V9H8.5V6ZM7.5 9V6H2V9H7.5ZM2 10V12.5C2 12.7761 2.22386 13 2.5 13H7.5V10H2ZM8.5 10H14V12.5C14 12.7761 13.7761 13 13.5 13H8.5V10Z"} />
              </svg>
              <span className='text-[10px] font-medium'>Grid</span>
            </div>
            <svg
              width={16}
              height={16}
              viewBox="0 0 16 16"
              className="flex-none"
              fill="rgb(71, 85, 105)"
            >
              <use href="icons/icons_definitions.svg#Plus"></use>
            </svg>
          </div>
        </PopoverTrigger>
        <PopoverContent>
          <div className="w-[380px] flex flex-col p-2 gap-6">
            <input 
              type="text"
              className="bg-gray-100 py-1 px-2 border rounded-md focus:outline-gray-300"
              placeholder="Enter view name"
              value={viewName}
              onChange={(e) => setViewName(e.target.value)}
            />
            <div className="flex flex-col gap-2">
              <span className="text-md font-medium">Who can edit</span>
              <div className="flex gap-2 w-full items-center justify-between">
                <EditPermission text="Collaborative" d="UsersThree" check={true} />
                <EditPermission text="Personal" d="User" d2="UpsellStar" />
                <EditPermission text="Locked" d="Lock" d2="UpsellStar" />
              </div>
              <span className="text-xs font-light ">All collaborators can edit the configuration</span>
            </div>
            <div className="flex justify-end gap-2 text-xs">
              <button
                className="hover:bg-gray-100 text-gray-600 p-2 rounded-md"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 text-white p-2 rounded-md font-medium"
                onClick={handleCreateViewAndClose}
              >
                Create new view
              </button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

const EditPermission = ({text, d, d2, check}: {text: string, d: string, d2?: string, check?: boolean}) => {
  return (
    <div className="flex gap-1">
      <div className="flex items-center justify-center rounded-full w-4 h-4 bg-[#FFFFFF] border border-slate-200">
        {check && <div className="rounded-full w-2 h-2 bg-[#166EE1]"></div>}
      </div>
      <svg
          width={16}
          height={16}
          viewBox="0 0 16 16"
          className="flex-none"
          fill="rgb(71, 85, 105)"
        >
          <use href={`icons/icons_definitions.svg#${d}`}></use>
      </svg>      
      <span className="text-xs">{text}</span>
      {d2 && (
        <svg
          width={16}
          height={16}
          viewBox="0 0 16 16"
          className="flex-none"
          fill="#1591EA"
        >
          <use href={`icons/icons_definitions.svg#${d2}`}></use>
        </svg>
      )}
    </div>
  )
}

export default CreateViewButton;