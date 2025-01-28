import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const tableRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ baseId: z.string().min(1), name: z.string().min(1), type: z.enum(['TEXT', 'NUMBER']) }))
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

      return ctx.db.column.create({
        data: {
          name: input.name,
          type: input.type,
          tableId: input.baseId,
        },
      });
    }),
  
  getAll: protectedProcedure
    .input(z.object({ baseId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      return ctx.db.column.findMany({
        where: { tableId: input.baseId },
        orderBy: { id: 'asc' },
      });
    }),

  // Additional procedures
  updateCell: protectedProcedure
    .input(z.object({
      recordId: z.string(),
      columnId: z.string(),
      value: z.union([z.string(), z.number()]),
    }))
    .mutation(async ({ ctx, input }) => {
      const cell = await ctx.db.cell.findUnique({
        where: {
          recordId_columnId: {
            recordId: input.recordId,
            columnId: input.columnId,
          },
        },
      });

      if (!cell) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Cell not found",
        });
      }

      return ctx.db.cell.update({
        where: {
          recordId_columnId: {
            recordId: input.recordId,
            columnId: input.columnId,
          },
        },
        data: {
          textValue: typeof input.value === 'string' ? input.value : null,
          numberValue: typeof input.value === 'number' ? input.value : null,
        },
      });
    }),

  addRecord: protectedProcedure
    .input(z.object({ tableId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const columns = await ctx.db.column.findMany({
        where: { tableId: input.tableId },
      });

      const cellData = columns.map((column) => ({
        columnId: column.id,
        textValue: column.type === 'TEXT' ? "John Doe" : null,
        numberValue: column.type === 'NUMBER' ? 15 : null,
      }));

      const newRecord = await ctx.db.record.create({
        data: {
          tableId: input.tableId,
          cells: {
            create: cellData,
          },
        },
        include: {
          cells: true,
        },
      });

      return newRecord;
    }),
});
