"use client"
;import {useState} from "react";
import NavBar from "../_components/HomeScreen/HomeNavBar";
import HomeSideBar from "../_components/HomeScreen/HomeSideBar";
import HomeContent from "../_components/HomeScreen/HomeContent";

export default function MainPage() {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);

  return (
    <div className="bg-grey flex flex-col w-full max-w-10xl h-screen">
      <NavBar isSideBarOpen={isSideBarOpen} setIsSideBarOpen={setIsSideBarOpen}/>
      <div className="h-screen max-w-10xl flex flex-grow">
        <HomeSideBar isSideBarOpen={isSideBarOpen}/>
        <HomeContent/>
      </div>
    </div>

  );
}