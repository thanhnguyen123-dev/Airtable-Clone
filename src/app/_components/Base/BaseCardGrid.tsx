import React from "react";
import { api } from "~/trpc/react";
import BaseCard from "./BaseCard";
import BaseCardSkeleton from "./BaseCardSkeleton";

const BaseCardGrid = () => {
  const {data: bases, isLoading: isLoading, error: basesError} = api.base.getAll.useQuery();

  if (isLoading) {
    return (
      <>
        {Array.from({ length: 8 }).map((_, index) => (
          <BaseCardSkeleton key={index} />
        ))}
      </>
    );
  }

  if (basesError || !bases) {
    return <></>
  }
  
  return (
    <>
      {
        bases.map((base, index) => {
          return <BaseCard key={index} name={base.name} baseId={base.id}/>
        })
      }
    </>
  )
}


export default BaseCardGrid;
