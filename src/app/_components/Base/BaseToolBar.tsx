"use client";
import React, { type Dispatch, type SetStateAction } from 'react';
import { api } from '~/trpc/react';
import NavTableButton from './NavTableButton';
import { type Table } from '@prisma/client';

type BaseToolBarProps = {
  baseId: string
  tables: Table[],
  currentTableId: string,
  handleTableSwitch: Dispatch<SetStateAction<string | undefined>>
}

const BaseToolBar = ({baseId, tables, currentTableId, handleTableSwitch} : BaseToolBarProps) => {
  const utils = api.useUtils()
  const createTableMutation = api.table.create.useMutation();

  const handleCreateTable = async () => {
    const newTable: Table = await createTableMutation.mutateAsync({baseId});
    const newTables = [...tables, newTable];
    utils.table.getAll.setData({baseId}, newTables);

    handleTableSwitch(newTable.id);
  };

  return (
    <div 
      className="flex items-center justify-between w-full h-[2rem] sticky top-0 z-20 bg-pale-teal-green"
    >
      <div 
        className="flex items-center w-[88%] h-[2rem] px-4 sticky top-0 rounded-tr-md bg-dark-teal-green"
      >
        {/* Render table tabs */}
        {tables.map((table, index) => (
          <NavTableButton
            key={index}
            tableName={table.name}
            isActive={table.id === currentTableId}
            handleClick={() => handleTableSwitch(table.id)}
          />
        ))}

        <div className='flex items-center gap-2'>
          <svg
            role='button'
            width={16}
            height={16}
            viewBox="0 0 16 16"
            className="flex-none ml-2"
            fill="white"
          >
            <use href="icons/icons_definitions.svg#ChevronDown"></use>
          </svg>
          <div className="separator"></div>
          <div
            role='button'
            className="flex items-center justify-center gap-2"
            onClick={handleCreateTable}
            >
            <svg
              width={16}
              height={16}
              viewBox="0 0 16 16"
              className="flex-none"
              fill="white"
            >
              <use href="icons/icons_definitions.svg#Plus"></use>
            </svg>
            <span className="text-xs text-slate-100 hover:text-white">Add or import</span>
          </div>
        </div>
      </div>

      <div 
        className="flex text-white text-xs justify-between items-center w-[11.5%] h-[2rem] px-4 sticky top-0 rounded-tl-md bg-dark-teal-green"
      >
        <div role='button'>
          <span>Extensions</span>
        </div>

        <div role='button' className='flex items-center gap-2'>
          <span>Tools</span>
          <svg
            role='button'
            width={16}
            height={16}
            viewBox="0 0 16 16"
            className="flex-none"
            fill="white"
          >
            <use href="icons/icons_definitions.svg#ChevronDown"></use>
          </svg>
        </div>
      </div>
    </div>
  )
}

export default BaseToolBar