"use client";

import React, { useState, useEffect, useRef } from "react";
import { api } from "~/trpc/react";

type AddColumnProps = {
  tableId: string;
  onCreated?: (columnName: string) => void; 
};

const AddColumn = ({ tableId, onCreated }: AddColumnProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [columnName, setColumnName] = useState("");
  const [columnType, setColumnType] = useState("TEXT");

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Our createColumn mutation from the router
  const createColumnMutation = api.table.createColumn.useMutation({
    onSuccess: () => {
      setColumnName("");
      setIsAdding(false);
    }
  });

  const handleCreate = async () => {
    if (!columnName.trim()) {
      return;
    }
    try {
      const result = await createColumnMutation.mutateAsync({
        tableId: tableId,
        name: columnName
      });
      if (result.success) {
        // Optionally tell the parent
        onCreated?.(columnName.trim());
      }
    } catch (err) {
      console.error("Failed to create column:", err);
      alert("Error creating column");
    }
  }
    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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
      <div className="relative flex items-start">
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center justify-center bg-[#e7edf6] px-8 py-1"
        >
          <svg
            width={16}
            height={16}
            viewBox="0 0 16 16"
            fill="black"
            className="flex-none"
          >
            <use href="icons/icons_definitions.svg#Plus"></use>
          </svg>
        </button>
        {isAdding && (
          <div
            ref={dropdownRef}
            className="absolute top-10 left-0 flex flex-col gap-2 border rounded-md p-3 z-50 bg-white w-64 shadow-md"
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
              onChange={(e) => setColumnType(e.target.value as "TEXT" | "NUMBER")}
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
  
export default AddColumn;