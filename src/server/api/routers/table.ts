import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { type Cell } from "@prisma/client";

export const tableRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ baseId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const tableCount = await ctx.db.table.count({
        where: { baseId: input.baseId },
      });

      return ctx.db.table.create({
        data: {
          name: `Table ${tableCount + 1}`,
          baseId: input.baseId,
        }
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
    .input(z.object({ tableId: z.string().min(1), name: z.string().min(1)}))
    .mutation(async ({ ctx, input }) => {
      // const existingColumn = await ctx.db.column.findFirst({
      //   where: { tableId: input.tableId, name: input.name },
      // });

      // if (existingColumn) {
      //   throw new TRPCError({
      //     code: "CONFLICT",
      //     message: "Column with this name already exists",
      //   });
      // }

      const newColumn = await ctx.db.column.create({
        data: {
          // id: input.id,
          name: input.name,
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
      const record = await ctx.db.record.create({
        data: {
          rowIndex: input.rowIndex,
          tableId: input.tableId,
        },
      });
    
      // find all columns and create cell for each column
      const columns = await ctx.db.column.findMany({
        where: { tableId: input.tableId },
      });

      const cells : Cell[] = [];

      for (const column of columns) { 
        cells.push({
          id: `${record.id}-${column.id}`,
          recordId: record.id,
          columnId: column.id,
          data: "",
        });
      }
      await Promise.all(cells);
      return record;
    }),
  
  // update cell
  updateCell: protectedProcedure
  .input(
    z.object({
      recordId: z.string().min(1),
      columnId: z.string().min(1),
      data: z.string().min(0),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const updatedCellValue = await ctx.db.cell.update({
      where: {
        recordId_columnId: {
          recordId: input.recordId,
          columnId: input.columnId,
        },
      },
      data: {
        data: input.data,
      },
    });
    return updatedCellValue;
  }),
  
});
