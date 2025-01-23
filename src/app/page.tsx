"use client";
import { signIn } from "next-auth/react";
import React from "react";
import { FcGoogle } from "react-icons/fc";
import { IoLogoGithub } from "react-icons/io";
import { OAuthButton } from "./_components/AuthButton";
import { auth } from "~/server/auth";


export default function Home() {
  // const hello = await api.post.hello({ text: "from tRPC" });
  // const session = await auth();

  // if (session?.user) {
  //   void api.post.getLatest.prefetch();
  // }
  const handleGoogleAuth = async () => {
    await signIn("google");
  };
  

  return (
    <div className="flex flex-col justify-center items-center h-screen gap-4">
      <div className="flex flex-col gap-4 w-full max-w-md">
          <OAuthButton handleClick={handleGoogleAuth} action="Continue with" providerName="Google" icon={<FcGoogle className="absolute left-6"/>} />
      </div>
    </div>
  
  );
}
