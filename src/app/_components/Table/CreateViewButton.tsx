import {Popover, PopoverTrigger, PopoverContent} from "@heroui/popover";
import { useState, useEffect, SetStateAction, Dispatch } from "react";
import { api } from "~/trpc/react";
import TableSideItem from "./TableSideItem";

type CreateViewButtonProps = {
  tableId: string;
};

const CreateViewButton = ({ tableId } : CreateViewButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewName, setViewName] = useState("Grid View");

  const createViewMutation = api.table.createView.useMutation();

  const handleCreateView = async () => {
    await createViewMutation.mutateAsync({
      name: viewName,
      tableId: tableId
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <Popover 
        isOpen={isOpen} 
        onOpenChange={(open) => setIsOpen(open)} 
        offset={30}
        placement={"bottom-end"}
        classNames={{
          content: [
            "rounded-md shadow-none border border-gray-300",
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
              <span className='text-xs font-medium'>Grid</span>
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
          <div className="flex flex-col p-2 gap-4">
            <input 
              type="text"
              className="bg-gray-100 py-1 px-2"
              placeholder="Enter view name"
              onChange={(e) => setViewName(e.target.value)}
            />
            <div className="flex justify-end gap-2 text-xs">
              <button
                className="hover:bg-gray-100 text-gray-600 p-2 rounded-md"
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 text-white p-2 rounded-md font-medium"
                onClick={handleCreateView}
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

export default CreateViewButton;