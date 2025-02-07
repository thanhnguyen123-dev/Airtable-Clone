import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { faker } from '@faker-js/faker';

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
          views: true
        },
      });
    }),

  createColumn: protectedProcedure
    .input(
      z.object({ 
        tableId: z.string().min(1), 
        name: z.string().min(1),
        id: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const newColumn = await ctx.db.column.create({
        data: {
          id: input.id,
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

      return newColumn;
    }),

    createRecord: protectedProcedure
    .input(z.object({ tableId: z.string().min(1), rowIndex: z.number().int(), id: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const record = await ctx.db.record.create({
        data: {
          id: input.id,
          rowIndex: input.rowIndex,
          tableId: input.tableId,
        },
      });
    
      const columns = await ctx.db.column.findMany({
        where: { tableId: input.tableId },
      });
  
      await ctx.db.cell.createMany({
        data: columns.map(column => ({
          id: `${record.id}-${column.id}`,
          recordId: record.id,
          columnId: column.id,
          data: "",
        }))
      });
  
      // Return the complete record with its cells
      // return ctx.db.record.findUnique({
      //   where: { id: record.id },
      //   include: {
      //     cells: true
      //   }
      // });

      // return {
      //   ...record,
      //   cells: cells
      // }

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

  createDefaultTable: protectedProcedure
    .input(z.object({ baseId: z.string().min(1), name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const table = await ctx.db.table.create({
        data: {
          baseId: input.baseId,
          name: input.name,
          records: {
            create: [{rowIndex: 0}, {rowIndex: 1}, {rowIndex: 2}],
          },
          columns: {
            create: [
              { name: "Name" },
              { name: "Notes" },
              { name: "Assignee" },
              { name: "Status" },
            ],
          },
          views: {
            create: {
              name: "Grid View",
              sortColumnId: "",
              sortOrder: "",
            }
          }
        },
        include: {
          records: true,
          columns: true,
        }
      });
      const cells = [];
      for (const record of table.records as { id: string }[]) {
        for (const column of table.columns as { id: string }[]) {
          cells.push(
            ctx.db.cell.create({
              data: {
                recordId: record.id,
                columnId: column.id,
                data: "",
              }
            })
          );
        }
      }
      await Promise.all(cells);


      return {
        success: true,
        table,
      }

    }),

  getTableHeaders: protectedProcedure
    .input(z.object({ tableId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      return ctx.db.column.findMany({
        where: { tableId: input.tableId },
      });
    }),

  createFakeRecords: protectedProcedure
    .input(z.object({
      tableId: z.string().min(1), 
      columnIds: z.array(z.string().min(1)),
      seed: z.string().optional(),
      count: z.number().int().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const {tableId, columnIds, seed, count = 500} = input;

      if (seed) {
        faker.seed(Number(seed));
      }

      const currentCount = await ctx.db.record.count({
        where: { tableId },
      });

      const records = Array.from({ length: count }, (_, i) => ({
        id: `${tableId}-${i + currentCount}`,
        tableId: tableId,
        rowIndex: i + currentCount,
      }))

      const recordsData = records.flatMap((record) => 
        columnIds.map((columnId) => ({
          id: `${record.id}-${columnId}`,
          data: faker.person.fullName(),
          recordId: record.id,
          columnId: columnId,
        })),
      );

      const result = await ctx.db.$transaction(
        async (prisma) => {
          await prisma.record.createMany({
            data: records,
          });
          return await prisma.cell.createMany({
            data: recordsData,
          });
        },
        { timeout: 60000 },
      );
      return result;
    }),
  
  getSearchRecord: protectedProcedure
    .input(z.object({ searchInput: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      return ctx.db.record.findFirst({
        where: {
          cells: {
            some: {
              data: {
                contains: input.searchInput,
              },
            },
          }
        },
        orderBy: {
          rowIndex: "asc",
        }
      });
    }),
  
  createView: protectedProcedure
    .input(
      z.object({ 
        tableId: z.string().min(1), name: z.string().min(1) 
      }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.view.create({
        data: {
          name: input.name,
          tableId: input.tableId,
          sortColumnId: "",
          sortOrder: "",
        }
      })
    }),

  getRecords: protectedProcedure
  .input(
    z.object({
      tableId: z.string().min(1),
      offset: z.number().int(),
      limit: z.number().int(),
    })
  )
  .query(async ({ ctx, input }) => {
    return ctx.db.record.findMany({
      where: { tableId: input.tableId },
      skip: input.offset,
      take: input.limit,
      include: { cells: true },
      orderBy: { rowIndex: "asc" },
    });
  }),

  getSortedRecords: protectedProcedure
  .input(
    z.object({
      tableId: z.string().min(1),
      sortColumnId: z.string().min(0),
      sortOrder: z.string()
    })
  )
  .query(async ({ ctx, input }) => {
    const records = await ctx.db.record.findMany({
      where: { tableId: input.tableId },
      include: { 
        cells: true
      },
      orderBy: { rowIndex: "asc" },
    });
    if (!input.sortColumnId || input.sortColumnId === "") {
      return records;
    }

    switch (input.sortOrder) {
      case "A - Z":
        records.sort((a, b) => {
          const valA = a.cells.find(cell => cell.columnId === input.sortColumnId)?.data ?? "";
          const valB = b.cells.find(cell => cell.columnId === input.sortColumnId)?.data ?? "";
          return valA.localeCompare(valB);
        });
        break;
      case "Z - A":
        records.sort((a, b) => {
          const valA = a.cells.find(cell => cell.columnId === input.sortColumnId)?.data ?? "";
          const valB = b.cells.find(cell => cell.columnId === input.sortColumnId)?.data ?? "";
          return valA.localeCompare(valB);
        });
        break;
      default:
        break;
    }
    return records;
  }),

  getTableView: protectedProcedure
    .input(z.object({ viewId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      return ctx.db.view.findUnique({
        where: { id: input.viewId },
      });
    }),

  updateTableView: protectedProcedure
    .input(
      z.object({ 
        viewId: z.string().min(1), 
        sortColumnId: z.string().min(0),
        sortOrder: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.view.update({
        where: { id: input.viewId },
        data: {
          sortColumnId: input.sortColumnId,
          sortOrder: input.sortOrder,
        }
      });
    }),


});