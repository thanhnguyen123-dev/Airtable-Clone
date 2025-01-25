"use client";

import React from "react";
import { api } from "~/trpc/react";
import BaseNavBar from "../_components/Base/BaseNavBar";
import BaseToolBar from "../_components/Base/BaseToolBar";
import Loader from "../_components/Loader";
import TableToolBar from "../_components/Table/TableToolBar";
import TableSideBar from "../_components/Table/TableSideBar";

interface BasePageProps {
  params: {
    baseId: string;
  };
}

export default function BasePage({ params }: BasePageProps) {
  // Call getById to load the base
  const { data: base, isLoading } = api.base.getById.useQuery({
    baseId: params.baseId,
  });

  if (isLoading) {
    return <Loader />;
  }

  if (!base) {
    return (
      <div className="p-4">
        <p>Base not found or you do not have permission.</p>
      </div>
    );
  }

  return (
    <div className="bg-grey flex flex-col w-full max-w-10xl h-screen">
      <BaseNavBar />
      <BaseToolBar />
      <TableToolBar />
      <div className="h-screen max-w-10xl flex flex-grow overflow-y-auto">
        <TableSideBar />
      </div>
    </div>
  );
}