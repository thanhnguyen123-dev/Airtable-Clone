"use client";

import { api } from "~/trpc/react";
import { redirect, useRouter } from "next/navigation";
import React from "react";


const HomeCreateButton = () => {
  const router = useRouter();
  const createBaseMutation = api.base.create.useMutation();
  const handleCreate = async () => {
    const base = await createBaseMutation.mutateAsync(
      {name: "Untitled Base"}
    );
    router.push(`/${base.id}`);

  }

  return (
    <button 
      className="bg-blue-600 w-full flex justify-center items-center p-[0.4rem] rounded-md gap-2 mt-2"
      onClick={handleCreate}>
      <svg
        width="14"
        height="14"
        viewBox="0 0 16 16"
        className="flex-none"
        fill="white"
      >
        <use href="/icons/icons_definitions.svg#Plus"></use>
      </svg>
      <span className="text-white text-[0.75rem]">Create</span>
    </button>
  )
}

export default HomeCreateButton;