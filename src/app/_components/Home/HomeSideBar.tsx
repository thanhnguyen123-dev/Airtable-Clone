import HomeSideBarItem from "./HomeSideBarItem";
import HomeCreateButton from "./HomeCreateButton";

type HomeSideBarProps = {
  isSideBarOpen: boolean,
  handleCreateBase: () => void
}

const HomeSideBar = ({isSideBarOpen, handleCreateBase} : HomeSideBarProps) => {
  return (
    <div
      className={`bg-white border-1 shadow-md duration-75 ${
        isSideBarOpen ? "w-[300px] min-w-[300px] translate-x-0" : "w-12"
      } flex flex-col items-start h-full`}
    >
      {/* Collapsed/Expanded Sidebar Content */}
      <div className="flex flex-col w-full h-full p-4">
        <div className="flex flex-col h-full w-full">
          {isSideBarOpen ? (
            <div className="flex flex-col justify-between w-full h-full">
              <div className="flex flex-col items-center gap-[0.75rem] w-full font-medium text-[0.95rem]">
                {/**Home */}
                <div className="flex flex-row justify-between w-full rounded-md hover:bg-gray-100 p-2">
                  <p>Home</p>
                  <div className="flex items-center justify-center gap-2">
                    <button className="hover:bg-gray-200 p-1 rounded-md">
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
                <div className="flex flex-row justify-between w-full rounded-md hover:bg-gray-100 p-2">
                  <p>All workspaces</p>
                  <div className="flex items-center gap-2">
                    <button className="hover:bg-gray-200 p-1 rounded-md">
                      <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      className="flex-none"
                      >
                        <use href="/icons/icons_definitions.svg#Plus"></use>
                      </svg>
                    </button>
                    <button className="hover:bg-gray-200 p-1 rounded-md">
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

              <div className="flex flex-col items-center gap-1 w-full">
                <div className="border w-11/12 border-gray-200 mb-2"></div>

                <HomeSideBarItem 
                  title="Templates and apps" 
                  imagePath="/icons/icons_definitions.svg#BookOpen"
                />

                <HomeSideBarItem 
                  title="Marketplace" 
                  imagePath="/icons/icons_definitions.svg#ShoppingBagOpen"
                />

                <HomeSideBarItem 
                  title="Import" 
                  imagePath="/icons/icons_definitions.svg#Plus"
                />
                <HomeCreateButton handleCreateBase={handleCreateBase}/>
              </div>
            </div>
          ) 
          : (
            <div className="flex flex-col justify-between w-full h-full">
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

                <div className="border w-5 border-gray-200"></div>
              </div>

              <div className="flex flex-col items-center justify-center gap-4">
                <div className="border w-5 border-gray-200"></div>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  className="flex-none"
                  fill="gray"
                >
                  <use href="/icons/icons_definitions.svg#BookOpen"></use>
                </svg>

                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  className="flex-none"
                  fill="gray"
                >
                  <use href="/icons/icons_definitions.svg#ShoppingBag"></use>
                </svg>

                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  className="flex-none"
                  fill="gray"
                >
                  <path fill-rule="nonzero" d="M8 2.5C11.0435 2.5 13.5 4.95647 13.5 8C13.5 11.0435 11.0435 13.5 8 13.5C4.95647 13.5 2.5 11.0435 2.5 8C2.5 4.95647 4.95647 2.5 8 2.5ZM8 2.6626C8.18743 2.6626 8.38741 2.74565 8.6217 2.97705C8.856 3.20845 9.10002 3.58333 9.30811 4.06921C9.72428 5.04098 10 6.44599 10 8.00012C10 9.55422 9.72429 10.9593 9.30811 11.931C9.10001 12.4169 8.856 12.7918 8.6217 13.0232C8.3874 13.2546 8.18743 13.3376 8 13.3376C7.81257 13.3376 7.61259 13.2546 7.3783 13.0232C7.144 12.7918 6.89999 12.4169 6.69189 11.931C6.27571 10.9593 6 9.55422 6 8.00012C6 6.44599 6.27572 5.04098 6.69189 4.06921C6.89998 3.58333 7.144 3.20845 7.3783 2.97705C7.61259 2.74565 7.81257 2.6626 8 2.6626Z M8 1.5C4.41604 1.5 1.5 4.41604 1.5 8C1.5 11.5839 4.41603 14.5 8 14.5C11.5839 14.5 14.5 11.5839 14.5 8C14.5 4.41603 11.5839 1.5 8 1.5ZM8 1.6626C7.49709 1.6626 7.03943 1.90624 6.67554 2.26562C6.31165 2.62501 6.01691 3.10505 5.77258 3.67554C5.28394 4.81652 5 6.33026 5 8.00012C5 9.66995 5.28394 11.1837 5.77258 12.3247C6.01691 12.8952 6.31165 13.3752 6.67554 13.7346C7.03943 14.094 7.49708 14.3376 8 14.3376C8.50292 14.3376 8.96057 14.094 9.32446 13.7346C9.68835 13.3752 9.98309 12.8952 10.2274 12.3247C10.7161 11.1837 11 9.66995 11 8.00012C11 6.33026 10.7161 4.81652 10.2274 3.67554C9.98309 3.10505 9.68835 2.62501 9.32446 2.26562C8.96057 1.90624 8.50291 1.6626 8 1.6626ZM2.34375 5.5C2.21114 5.5 2.08396 5.55268 1.9902 5.64645C1.89643 5.74021 1.84375 5.86739 1.84375 6C1.84375 6.13261 1.89643 6.25979 1.9902 6.35355C2.08396 6.44732 2.21114 6.5 2.34375 6.5H13.6562C13.7889 6.5 13.916 6.44732 14.0098 6.35355C14.1036 6.25979 14.1562 6.13261 14.1562 6C14.1562 5.86739 14.1036 5.74021 14.0098 5.64645C13.916 5.55268 13.7889 5.5 13.6562 5.5H2.34375ZM2.34375 9.5C2.21114 9.5 2.08396 9.55268 1.9902 9.64645C1.89643 9.74021 1.84375 9.86739 1.84375 10C1.84375 10.1326 1.89643 10.2598 1.9902 10.3536C2.08396 10.4473 2.21114 10.5 2.34375 10.5H13.6562C13.7889 10.5 13.916 10.4473 14.0098 10.3536C14.1036 10.2598 14.1562 10.1326 14.1562 10C14.1562 9.86739 14.1036 9.74021 14.0098 9.64645C13.916 9.55268 13.7889 9.5 13.6562 9.5H2.34375Z" />
                </svg>

                <div className="flex items-center justify-center p-1 border-grey-300 border rounded">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    className="flex-none"
                    fill="gray"
                  >
                    <use href="/icons/icons_definitions.svg#Plus"></use>
                  </svg>
                </div>
              </div>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}
export default HomeSideBar;