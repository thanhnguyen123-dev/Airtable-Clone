import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { ColumnType } from "@prisma/client";

export const tableRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ baseId: z.string().min(1), name: z.string().min(1)}))
    .mutation(async ({ ctx, input }) => {
      const existingColumn = await ctx.db.column.findFirst({
        where: { tableId: input.baseId, name: input.name },
      });

      if (existingColumn) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Column with this name already exists",
        });
      }

      return ctx.db.table.create({
        data: {
          name: input.name,
          baseId: input.baseId,
          columns: {
            create: [
              { name: "Name", type: ColumnType.TEXT },
              { name: "Notes", type: ColumnType.TEXT },
              { name: "Assignee", type: ColumnType.TEXT },
              { name: "Status", type: ColumnType.TEXT },
            ],
          },
        },
        include: {
          records: true,
          columns: true,
        },
      });
    }),
  
  getAll: protectedProcedure
    .input(z.object({ baseId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      return ctx.db.table.findMany({
        where: { baseId: input.baseId },
      });
    }),
  
  getById: protectedProcedure
    .input(z.object({ tableId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      return ctx.db.table.findUnique({
        where: { id: input.tableId },
        include: { 
          columns: true ,
          records: {
            include: { cells: true },
          },
        },
      });
    }),

  createColumn: protectedProcedure
    .input(z.object({id: z.string().min(1), tableId: z.string().min(1), name: z.string().min(1), type: z.nativeEnum(ColumnType) }))
    .mutation(async ({ ctx, input }) => {
      const existingColumn = await ctx.db.column.findFirst({
        where: { tableId: input.tableId, name: input.name },
      });

      if (existingColumn) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Column with this name already exists",
        });
      }

      const newColumn = await ctx.db.column.create({
        data: {
          id: input.id,
          name: input.name,
          type: input.type,
          tableId: input.tableId,
        },
      });

      const records = await ctx.db.record.findMany({
        where: { tableId: input.tableId },
      });

      if (records.length > 0) {
        await ctx.db.cell.createMany({
          data: records.map((record) => ({
            id: `${record.id}-${newColumn.id}`,
            recordId: record.id,
            columnId: newColumn.id,
            data: "",
          })),
        });
      }

      return {success: true};
    }),

  createRecord: protectedProcedure
    .input(z.object({ tableId: z.string().min(1), rowIndex: z.number().int() }))
    .mutation(async ({ ctx, input }) => {
      // create record
      const newRecord = await ctx.db.record.create({
        data: {
          rowIndex: input.rowIndex,
          tableId: input.tableId,
        },
      });
    
      // find all columns and create cell for each column
      const columns = await ctx.db.column.findMany({
        where: { tableId: input.tableId },
      });

      if (columns.length > 0) {
        await ctx.db.cell.createMany({
          data: columns.map((column) => ({
            recordId: newRecord.id,
            columnId: column.id,
          })),
        });
      }
      return newRecord;
    }),
  
  // update cell
  updateCell: protectedProcedure
  .input(
    z.object({
      recordId: z.string().min(1),
      columnId: z.string().min(1),
      columnType: z.nativeEnum(ColumnType),
      value: z.union([z.string(), z.number().optional()]),
    })
  )
  .mutation(async ({ ctx, input }) => {
    if (input.columnType === ColumnType.TEXT) {
      return ctx.db.cell.update({
        where: { 
          recordId_columnId: {
            recordId: input.recordId,
            columnId: input.columnId,
          }
        },
        data: {
          textValue: input.value as string,
        },
      });
    } 
    else {
      let parsedValue: number | null = null;
      parsedValue = input.value ? Number(input.value) : null;
      return ctx.db.cell.update({
        where: { 
          recordId_columnId: {
            recordId: input.recordId,
            columnId: input.columnId,
          }
        },
        data: {
          numberValue: parsedValue,
        }
      });
      }
    }),
});
