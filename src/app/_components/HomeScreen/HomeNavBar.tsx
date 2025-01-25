"use client";
import Image from "next/image";
import { FiHelpCircle } from "react-icons/fi";
import { FaBell } from "react-icons/fa";
import { RxHamburgerMenu } from "react-icons/rx";
import HomeSearchBar from "./HomeSearchBar";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { signOut } from "next-auth/react";
type Props = {
  isSideBarOpen: boolean;
  setIsSideBarOpen: (val: boolean) => void;
};

const NavBar = ({ isSideBarOpen, setIsSideBarOpen }: Props) => {
  const handleClick = () => {
    setIsSideBarOpen(!isSideBarOpen);
  };

  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const toggleDropDown = () => setIsDropDownOpen(!isDropDownOpen);

  const { data: session } = useSession();

  return (
    <nav className="flex items-center justify-between w-full px-4 py-2 bg-white border-2 border-gray-200 sticky top-0">
      <div className="flex items-center gap-6">
        <button onClick={handleClick} className="text-gray-600">
          <RxHamburgerMenu />
        </button>
        <Image
          src="/airtable-logo.svg"
          alt="Airtable Logo"
          width={100}
          height={100}
        />        
      </div>

      {/* Middle Section: Search Bar */}
      <div className="flex justify-center w-1/4">
        <HomeSearchBar />
      </div>

      {/* Right Section: Help, Notifications, Profile */}
      <div className="flex items-center gap-4">
        <div role="button" className="flex items-center justify-center gap-2 hover:bg-gray-200 px-2 py-1 rounded-3xl">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
          >
            <path fill-rule="nonzero" d="M8.07349 4.50134C7.75062 4.49155 7.43049 4.55078 7.13904 4.67151C6.36183 4.99344 5.75017 5.76895 5.75 6.74988C5.74997 6.88249 5.80262 7.00968 5.89636 7.10347C5.99011 7.19726 6.11727 7.24997 6.24988 7.25C6.31554 7.25002 6.38056 7.2371 6.44123 7.21199C6.5019 7.18687 6.55703 7.15006 6.60347 7.10364C6.64991 7.05722 6.68675 7.00211 6.71189 6.94145C6.73704 6.8808 6.74998 6.81578 6.75 6.75012C6.75013 6.17215 7.08092 5.77793 7.52173 5.59534C7.96254 5.41275 8.47515 5.45759 8.88391 5.86621C9.24251 6.22468 9.34907 6.75995 9.15503 7.22839C8.96099 7.69684 8.50716 8.00009 8.00012 8C7.93445 7.99999 7.86942 8.01292 7.80875 8.03804C7.74808 8.06316 7.69295 8.09999 7.6465 8.14642C7.60006 8.19285 7.56322 8.24797 7.53809 8.30864C7.51295 8.36931 7.50001 8.43433 7.5 8.5V9C7.5 9.13261 7.55268 9.25979 7.64645 9.35355C7.74021 9.44732 7.86739 9.5 8 9.5C8.13261 9.5 8.25979 9.44732 8.35355 9.35355C8.44732 9.25979 8.5 9.13261 8.5 9V8.93738C9.1999 8.77686 9.79665 8.2924 10.0789 7.61108C10.4266 6.77156 10.2336 5.80137 9.59094 5.15894C9.15735 4.7255 8.61159 4.51766 8.07349 4.50134Z M8 12C8.41419 12 8.75 11.6642 8.75 11.25C8.75 10.8358 8.41419 10.5 8 10.5C7.58581 10.5 7.25 10.8358 7.25 11.25C7.25 11.6642 7.58581 12 8 12Z M8 1.5C4.41604 1.5 1.5 4.41604 1.5 8C1.5 11.5839 4.41603 14.5 8 14.5C11.5839 14.5 14.5 11.5839 14.5 8C14.5 4.41603 11.5839 1.5 8 1.5ZM8 2.5C11.0435 2.5 13.5 4.95647 13.5 8C13.5 11.0435 11.0435 13.5 8 13.5C4.95647 13.5 2.5 11.0435 2.5 8C2.5 4.95647 4.95647 2.5 8 2.5Z" />
          </svg>
          <span className="text-gray-500 text-sm">Help</span>
        </div>
        <div role="button" className="border-2 border-gray-200 rounded-full p-1 hover:bg-gray-200">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            className="flex-none"
          >
            <path fill-rule="nonzero" d="M6 11.5C5.86739 11.5 5.74021 11.5527 5.64645 11.6464C5.55268 11.7402 5.5 11.8674 5.5 12V12.5C5.49987 13.8749 6.62514 15.0001 8 15C8.66281 15 9.29903 14.7365 9.7677 14.2678C10.2364 13.7991 10.5 13.1628 10.5 12.5V12C10.5 11.8674 10.4473 11.7402 10.3536 11.6464C10.2598 11.5527 10.1326 11.5 10 11.5C9.86739 11.5 9.74021 11.5527 9.64645 11.6464C9.55268 11.7402 9.5 11.8674 9.5 12V12.5C9.50001 12.898 9.34212 13.2793 9.06067 13.5607C8.77926 13.8421 8.398 14 8 14C7.16564 14.0001 6.49992 13.3344 6.5 12.5V12C6.5 11.8674 6.44732 11.7402 6.35355 11.6464C6.25978 11.5527 6.13261 11.5 6 11.5Z M8.03394 1.50012C5.26871 1.48474 3.00893 3.73483 3.01245 6.5V7.00014C3.01245 9.16781 2.56115 10.3731 2.19849 10.9995V10.9995C2.11088 11.1513 2.06437 11.324 2.06421 11.4992C2.06387 12.0445 2.51528 12.498 3.06055 12.5L3.06238 12.5002H12.9374L12.9392 12.5C13.1144 12.4994 13.2863 12.4529 13.4377 12.3649C13.9096 12.0911 14.0746 11.4723 13.8016 10.9999V10.9999C13.4389 10.3735 12.9874 9.16781 12.9874 7.00015V6.5563C12.9874 3.80889 10.7849 1.52098 8.03503 1.50015L8.03394 1.50012ZM8.02734 2.5V2.5C10.2272 2.51694 11.9874 4.34136 11.9874 6.55628V7.00012C11.9874 9.30695 12.4736 10.7013 12.9358 11.5C12.9358 11.5 12.9383 11.4986 12.9358 11.5L3.06434 11.5001V11.5001C3.52659 10.7015 4.01246 9.30699 4.01246 7.00013V6.50013V6.50013C4.00929 4.27789 5.80529 2.48824 8.02734 2.5Z" />
          </svg>
        </div>
        <Image 
          src={session?.user?.image ?? "/favicon.ico"}
          alt="profile-image"
          width={25}
          height={25}
          className="rounded-full cursor-pointer" 
          onClick={toggleDropDown}
        />
        
        {isDropDownOpen && (
          <div className="absolute right-4 top-11 w-48 bg-white border-2 rounded-lg shadow-md z-10">
            <div className="px-4 py-2">
              <p className="text-sm font-bold">{session?.user?.name}</p>
              <p className="text-[0.75rem] text-gray-500">{session?.user?.email}</p>
            </div>
            <hr />
              <button 
                className="px-4 py-2 w-full text-sm hover:bg-gray-100 cursor-pointer text-red-500"
                onClick={() => signOut()}
              >
                Sign Out
              </button>
          </div>
          )
        }
      </div>
    </nav>
  );
};

export default NavBar;
