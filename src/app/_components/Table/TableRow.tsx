"use client";
import React from "react";

type TableRowProps = {
  children: React.ReactNode;
  style?: React.CSSProperties;
};

export default function TableRow({ children, style }: TableRowProps) {
  return (
    <div 
      className="flex border-b border-gray-300 m-0 p-0"
      style={style}
      >
      {children}
    </div>
  );
}
