"use client";

import React, { useState } from "react";

interface AddColumnProps {
  onAddColumn: (colName: string, colType: "TEXT" | "NUMBER") => void;
}

export default function AddColumn({ onAddColumn }: AddColumnProps) {
  const [open, setOpen] = useState(false);
  const [colName, setColName] = useState("");
  const [colType, setColType] = useState<"TEXT" | "NUMBER">("TEXT");

  const handleSubmit = () => {
    if (colName.trim().length > 0) {
      onAddColumn(colName, colType);
      setColName("");
      setOpen(false);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="px-3 py-1 bg-slate-100 rounded-md"
      >
        + Add Column
      </button>
    );
  }

  return (
    <div className="flex gap-2 items-center">
      <input
        type="text"
        placeholder="Column name"
        value={colName}
        onChange={(e) => setColName(e.target.value)}
        className="border rounded px-1"
      />
      <select
        value={colType}
        onChange={(e) => setColType(e.target.value as "TEXT" | "NUMBER")}
        className="border rounded px-1"
      >
        <option value="TEXT">Text</option>
        <option value="NUMBER">Number</option>
      </select>
      <button onClick={handleSubmit} className="px-2 py-1 bg-green-100 rounded">
        Save
      </button>
      <button onClick={() => setOpen(false)} className="px-2 py-1 bg-red-100 rounded">
        Cancel
      </button>
    </div>
  );
}
