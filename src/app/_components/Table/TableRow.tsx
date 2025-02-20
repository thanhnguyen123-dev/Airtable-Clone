"use client";
import React, { forwardRef } from "react";

type TableRowProps = {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
};

const TableRow = forwardRef<HTMLDivElement, TableRowProps>(
  ({ children, style, className }, ref) => {
    return (
      <div ref={ref} style={style} className={className}>
        {children}
      </div>
    );
  }
);

TableRow.displayName = "TableRow";
export default TableRow;
