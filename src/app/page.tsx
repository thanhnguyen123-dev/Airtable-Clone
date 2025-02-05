"use client";
import { useSession, signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { OAuthButton } from "./_components/AuthButton";
import NavBar from "./_components/Home/HomeNavBar";
import HomeSideBar from "./_components/Home/HomeSideBar";
import HomeContent from "./_components/Home/HomeContent";
import Loader from "./_components/Loader";
import Image from "next/image";
import { api } from "~/trpc/react";

export default function Home() {
  const { data: session, status } = useSession();
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);

  const router = useRouter();
  const createBaseMutation = api.base.create.useMutation();
  const createTableMutation = api.table.createDefaultTable.useMutation();

  const handleCreate = async () => {
    try {
      const base = await createBaseMutation.mutateAsync({ name: "Untitled Base", });
      await createTableMutation.mutateAsync({
        baseId: base.id,
        name: `Table ${1}`
      })
      router.push(`/${base.id}`);
    } catch (error) {
      console.error("Failed to create base:", error);
    }
  };

  const handleGoogleAuth = async () => {
    await signIn("google", { callbackUrl: "/" });
  };

  if (status === "loading") {
    return <Loader/>;
  }

  if (!session) {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-4">
        <div className="flex flex-col  gap-4 w-full max-w-md">
          <Image
            src="/airtable-logo.svg"
            alt="Airtable Logo"
            width={100}
            height={100}
            className="mx-auto"
          />
          <span className="my-3 mx-auto text-3xl font-bold">You&apos;re almost there...</span>
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
      <div className="h-screen max-w-10xl flex flex-grow overflow-y-auto overflow-x-auto">
        <HomeSideBar
          isSideBarOpen={isSideBarOpen}
          handleCreateBase={handleCreate}
          />
        <HomeContent handleCreateBase={handleCreate}/>
      </div>
    </div>

  );
}