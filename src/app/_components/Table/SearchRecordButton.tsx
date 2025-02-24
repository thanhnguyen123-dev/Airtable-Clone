import {Popover, PopoverTrigger, PopoverContent} from "@heroui/popover";
import { useState, type SetStateAction, type Dispatch } from "react";

type SearchRecordButtonProps = {
  searchValue: string;
  setSearchValue: Dispatch<SetStateAction<string>>;
}

const SearchRecordButton = ({
  searchValue, 
  setSearchValue, 
} : SearchRecordButtonProps ) => {  

  const [isOpen, setIsOpen] = useState(false);

  const clearSearch = async () => {
    setSearchValue("");
    setIsOpen(false);
  }

  return (
    <div className="flex flex-col gap-2">
      <Popover 
        isOpen={isOpen} 
        onOpenChange={(open) => setIsOpen(open)} 
        placement={"bottom-end"}
        classNames={{
          content: [
            "rounded-sm shadow-none border border-gray-300",
          ]
        }}
        >
        <PopoverTrigger>
          <svg
            role="button"
            width={16}
            height={16}
            viewBox="0 0 16 16"
            className="flex-none"
            fill="black"
          >
            <path fill-rule="nonzero" d="M7.25 1.5C4.08028 1.5 1.5 4.08028 1.5 7.25C1.5 10.4197 4.08028 13 7.25 13C8.65529 13 9.94315 12.4911 10.9432 11.6503L13.6465 14.3534C13.7402 14.4471 13.8674 14.4998 14 14.4998C14.1326 14.4998 14.2598 14.4471 14.3535 14.3534C14.4473 14.2596 14.4999 14.1325 14.4999 13.9999C14.4999 13.8673 14.4473 13.7401 14.3535 13.6464L11.6504 10.9431C12.4912 9.94305 13 8.65523 13 7.25C13 4.08028 10.4197 1.5 7.25 1.5ZM7.25 2.5C9.87928 2.5 12 4.62072 12 7.25C12 8.56227 11.4715 9.74761 10.6154 10.6061C10.6132 10.607 10.611 10.6079 10.6089 10.6088C10.608 10.611 10.6071 10.6132 10.6062 10.6154C9.74772 11.4715 8.5623 12 7.25 12C4.62072 12 2.5 9.87928 2.5 7.25C2.5 4.62072 4.62072 2.5 7.25 2.5Z" />
          </svg>
        </PopoverTrigger>
        <PopoverContent className="p-0">
          <div className="flex flex-col gap-4 pt-2">
            <div className="flex items-center px-2">
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Find in views"
                className="border-none text-xs w-full outline-none"
              />
              <svg
                role="button"
                onClick={clearSearch}
                width={16}
                height={16}
                viewBox="0 0 16 16"
                className="flex-none"
                fill="black"
              >
                <use href="icons/icons_definitions.svg#X"></use>
              </svg>
            </div>
            <div className="flex flex-col gap-2 bg-slate-200 px-2 py-1 justify-center">
              <div className="flex items-center">
                <p className="text-[10px] text-slate-500 font-normal mr-[2px]">Use advanced search options in the </p>
                <div className="flex items-center gap-[2px]">
                  <svg
                    width={16}
                    height={16}
                    viewBox="0 0 16 16"
                    className="flex-none"
                    fill="blue"
                  >
                    <use href="icons/icons_definitions.svg#ExtensionsFeature"></use>
                  </svg>
                  <span className="text-[10px] text-blue-500 font-medium">search extensions</span>
                </div>
              </div>
              {/* <div className="flex justify-end">
                <button
                  className="bg-blue-500 text-white px-2 py-1 rounded-lg text-xs"
                  onClick={handleSearch}
                >
                  Search
                </button>
              </div> */}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default SearchRecordButton;