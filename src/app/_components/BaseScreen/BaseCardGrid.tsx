import React from "react";
import { api } from "~/trpc/react";
import BaseCard from "./BaseCard";

const BaseCardGrid = () => {
  const {data: bases, isLoading: isLoading, error: baseError} = api.base.getAll.useQuery();
  if (isLoading) {
    return <div>Loading...</div>
  }
  if (baseError) {
    return <div>Error: {baseError.message}</div>
  }
  
  return (
    <>
      {
        bases?.map((base, index) => {
          return <BaseCard key={index} name={base.name} baseId={base.id}/>
        }) || []
      }
    </>
  )
}


export default BaseCardGrid;
