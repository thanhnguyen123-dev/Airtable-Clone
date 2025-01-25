"use client";
import { useSession, signIn } from "next-auth/react";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { OAuthButton } from "./_components/AuthButton";
import NavBar from "./_components/Home/HomeNavBar";
import HomeSideBar from "./_components/Home/HomeSideBar";
import HomeContent from "./_components/Home/HomeContent";
import Loader from "./_components/Loader";

export default function Home() {
  const { data: session, status } = useSession();
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);

  const handleGoogleAuth = async () => {
    await signIn("google");
  };

  if (status === "loading") {
    return <Loader/>;
  }

  if (!session) {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-4">
        <div className="flex flex-col gap-4 w-full max-w-md">
          <OAuthButton 
            handleClick={handleGoogleAuth} 
            action="Continue with" 
            providerName="Google" 
            icon={<FcGoogle className="absolute left-6"/>} 
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-grey flex flex-col w-full max-w-10xl h-screen">
      <NavBar isSideBarOpen={isSideBarOpen} setIsSideBarOpen={setIsSideBarOpen}/>
      <div className="h-screen max-w-10xl flex flex-grow overflow-y-auto">
        <HomeSideBar isSideBarOpen={isSideBarOpen}/>
        <HomeContent/>
      </div>
    </div>
  );
}