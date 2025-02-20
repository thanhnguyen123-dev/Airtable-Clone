"use client";

import React, { useState, useEffect, useRef } from "react";

type AddColumnProps = {
  onCreated?: (columnName: string) => void;
};

const AddColumnButton = ({ onCreated }: AddColumnProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [columnName, setColumnName] = useState("");
  const [columnType, setColumnType] = useState("TEXT");

  // We'll position the dropdown absolutely relative to this container
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleCreate = () => {
    if (!columnName.trim()) return;
    onCreated?.(columnName.trim());
    setColumnName("");
    setIsAdding(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !containerRef.current?.contains(event.target as Node)
      ) {
        setIsAdding(false);
      }
    };
    if (isAdding) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isAdding]);

  return (
    <div ref={containerRef} className="relative">
      {/* A small button with an icon */}
      <button
        onClick={() => setIsAdding((prev) => !prev)}
        className="flex items-center justify-center px-2 py-1"
      >
        <svg width={16} height={16} viewBox="0 0 16 16" fill="black">
          <use href="icons/icons_definitions.svg#Plus"></use>
        </svg>
      </button>

      {isAdding && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 mt-1 flex flex-col gap-2 border rounded-md p-3 z-50 bg-white w-64 shadow-md"
        >
          <input
            type="text"
            value={columnName}
            onChange={(e) => setColumnName(e.target.value)}
            placeholder="Field name"
            className="border p-2 rounded-md text-sm w-full"
          />
          <select
            value={columnType}
            onChange={(e) => setColumnType(e.target.value)}
            className="border p-2 rounded-md text-sm w-full"
          >
            <option value="TEXT">Single line text</option>
            <option value="NUMBER">Number</option>
          </select>
          <div className="flex justify-end gap-2 mt-1 text-xs">
            <button
              onClick={() => setIsAdding(false)}
              className="hover:bg-gray-100 text-gray-600 p-2 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              className="bg-blue-600 text-white p-2 rounded-md font-medium"
            >
              Create field
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddColumnButton;
