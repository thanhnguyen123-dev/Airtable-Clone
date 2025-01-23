"use client";
import Image from "next/image";
import { FiHelpCircle } from "react-icons/fi";
import { FaBell } from "react-icons/fa";
import { RxHamburgerMenu } from "react-icons/rx";
import HomeSearchBar from "./HomeSearchBar";

type Props = {
  isSideBarOpen: boolean;
  setIsSideBarOpen: (val: boolean) => void;
};

const NavBar = ({ isSideBarOpen, setIsSideBarOpen }: Props) => {
  const handleClick = () => {
    setIsSideBarOpen(!isSideBarOpen);
  };

  return (
    <nav className="flex items-center justify-between w-full px-4 py-2 bg-white border-b border-gray-200 sticky top-0">
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
      <HomeSearchBar />

      {/* Right Section: Help, Notifications, Profile */}
      <div className="flex items-center space-x-4">
        <FiHelpCircle className="text-gray-500 text-lg cursor-pointer" />
        <FaBell className="text-gray-500 text-lg cursor-pointer" />
        <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center font-bold cursor-pointer">
          T
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
