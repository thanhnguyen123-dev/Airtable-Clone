"use client";

import React from "react";
import { api } from "~/trpc/react";

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
    return <div className="p-4">Loading base...</div>;
  }

  if (!base) {
    return (
      <div className="p-4">
        <p>Base not found or you do not have permission.</p>
      </div>
    );
  }

  // Once loaded, you can render the base’s “dummy content” or table or anything else
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">{base.name}</h2>
      <p className="text-gray-500 text-sm">Base ID: {base.id}</p>

      {/* Put your placeholder or real table UI here */}
      <p className="mt-4">TODO: Build out the real table UI for {base.name}!</p>
    </div>
  );
}