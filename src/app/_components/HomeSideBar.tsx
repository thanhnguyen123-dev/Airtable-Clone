import { GoHome } from "react-icons/go";
import { MdKeyboardArrowRight } from "react-icons/md";


const HomeSideBar = ({isSideBarOpen}  : {isSideBarOpen: boolean}) => {
  return (
    <div
    className={`bg-white shadow-md transition-all duration-300 ${
      isSideBarOpen ? "w-64" : "w-12"
    } flex flex-col items-start h-full`}
    >
      {/* Collapsed/Expanded Sidebar Content */}
      <div className="flex flex-col w-full h-full p-4">
        <div className="flex flex-col">
          {isSideBarOpen ? (
            <div className="flex flex-col items-center gap-6">
              {/**Home */}
              <div className="flex flex-row justify-between w-full">
                <p>Home</p>
                <div className="flex items-center justify-center">
                  <button>
                    <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    className="flex-none"
                    >
                      <use href="/icons/icons_definitions.svg#ChevronRight"></use>
                    </svg>
                  </button>
                </div>
              </div>

              {/** Workspace */}
              <div className="flex flex-row justify-between w-full">
                <p>Workspace</p>
                <div className="flex items-center gap-2">
                  <button>
                    <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    className="flex-none"
                    >
                      <use href="/icons/icons_definitions.svg#Plus"></use>
                    </svg>
                  </button>
                  <button>
                    <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    className="flex-none"
                    >
                      <use href="/icons/icons_definitions.svg#ChevronRight"></use>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ) 
          : (
            <div className="flex flex-col items-center justify-center gap-4">
              <svg
                width="20"
                height="20"
                viewBox="0 0 16 16"
                className="flex-none"
              >
                <path fill-rule="nonzero" d="M8 1.67725C7.75721 1.67725 7.51436 1.76397 7.32495 1.93726L2.32617 6.47986C2.32379 6.48203 2.32143 6.48423 2.31909 6.48645C2.11974 6.67482 2.00463 6.93622 2.00012 7.21045C2.00006 7.21318 2.00002 7.2159 2 7.21863V12.9999C2.00007 13.5462 2.45357 13.9998 2.99988 13.9999C2.99984 13.9999 2.99992 13.9999 2.99988 13.9999H6C6.54636 13.9999 7 13.5462 7 12.9999V9.99988H9V12.9999C9 13.5462 9.45364 13.9999 10 13.9999H13C13.5464 13.9999 14 13.5462 14 12.9999V7.21863C14 7.21594 13.9999 7.21326 13.9999 7.21057C13.9954 6.93627 13.8802 6.67471 13.6808 6.48633C13.6785 6.48415 13.6762 6.48199 13.6738 6.47986L8.67505 1.93726C8.48564 1.76397 8.24279 1.67725 8 1.67725ZM8 2.67505C8.00041 2.67542 8.00081 2.67578 8.00122 2.67615L12.9941 7.21338C12.9979 7.21694 12.9998 7.22129 13 7.22644V12.9999H10V9.99988C10 9.45352 9.54636 8.99988 9 8.99988H7C6.45363 8.99988 6 9.45352 6 9.99988V12.9999H3.00012L3 7.22656C3.00015 7.22145 3.00206 7.21707 3.00573 7.2135L7.99878 2.67615C7.99919 2.67578 7.99959 2.67542 8 2.67505Z" />
              </svg>
              
              <svg
                width="20"
                height="20"
                viewBox="0 0 16 16"
                className="flex-none"
              >
                <use href="/icons/icons_definitions.svg#UsersThree"></use>
              </svg>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}
export default HomeSideBar;