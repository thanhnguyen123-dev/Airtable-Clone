"use client";
import React from "react";

type TableRowProps = {
  children: React.ReactNode;
};

export default function TableRow({ children }: TableRowProps) {
  return (
    <div className="flex border-b border-gray-300 m-0 p-0">
      {children}
    </div>
  );
}
