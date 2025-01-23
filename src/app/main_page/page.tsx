"use client"
;import {useState} from "react";
import NavBar from "../_components/HomeNavBar";
import HomeSideBar from "../_components/HomeSideBar";


export default function MainPage() {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);

  return (
    <div className="bg-grey flex flex-col w-full max-w-10xl h-screen">
      <NavBar isSideBarOpen={isSideBarOpen} setIsSideBarOpen={setIsSideBarOpen}/>
      <HomeSideBar isSideBarOpen={isSideBarOpen}/>
 
    </div>

  );
}