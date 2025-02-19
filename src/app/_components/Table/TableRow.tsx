"use client";
import React, {forwardRef} from "react";

type TableRowProps = {
  children: React.ReactNode;
  style?: React.CSSProperties;
};

const TableRow = forwardRef<HTMLDivElement, TableRowProps>(
  ({ children }, ref) => {
    return (
      <div 
        className="flex border-b border-gray-300 m-0 p-0"
        ref={ref}
      >
        {children}
      </div>
    );
  }
);

TableRow.displayName = "TableRow";
export default TableRow;


