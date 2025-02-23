/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { faker } from '@faker-js/faker';

export const tableRouter = createTRPCRouter({
  // create a table
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
  
  // get all tables
  getAll: protectedProcedure
    .input(z.object({ baseId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      return ctx.db.table.findMany({
        where: { baseId: input.baseId },
      });
    }),

  // get all records (with optional sorting, filtering)
  getRecords: protectedProcedure
    .input(
      z.object({ 
        tableId: z.string().min(1),
        sortColumnId: z.string().optional(),
        sortOrder: z.string().optional(),
        filterColumnId: z.string().optional(),
        filterCond: z.string().optional(),
        filterValue: z.string().optional(),
        cursor: z.string().optional(),
        page: z.number().optional(),
        limit: z.number().int(),
      })
    )
    .query(async ({ ctx, input }) => {
      let whereCondition: any = { tableId: input.tableId };
  
      // fitlering condition
      if (input.filterColumnId && input.filterColumnId !== "") {
        let cellFilter = {};
        switch (input.filterCond) {
          case "contains":
            cellFilter = { data: { contains: input.filterValue, mode: "insensitive" } };
            break;
          case "does not contain":
            cellFilter = { NOT: { data: { contains: input.filterValue, mode: "insensitive" } } };
            break;
          case "is":
            cellFilter = { data: input.filterValue };
            break;
          case "is not":
            cellFilter = { NOT: { data: input.filterValue } };
            break;
          case "is empty":
            cellFilter = { data: "" };
            break;
          case "is not empty":
            cellFilter = { NOT: { data: "" } };
            break;
          default:
            break;
        }
  
        whereCondition = {
          ...whereCondition,
          cells: {
            some: {
              columnId: input.filterColumnId,
              ...cellFilter,
            },
          },
        };
      }
  
      // offset pagination for sorting
      if (input.sortColumnId && input.sortOrder) {
        // get all records that match the filter with sorting column's cells
        const allRecords = await ctx.db.record.findMany({
          where: whereCondition,
          include: {
            cells: {
              where: { columnId: input.sortColumnId }
            }
          },
        });
  
        // sort records based on cell data
        allRecords.sort((a, b) => {
          const cellA = a.cells[0]?.data ?? "";
          const cellB = b.cells[0]?.data ?? "";
          
          if (input.sortOrder === "A - Z") {
            return cellA.localeCompare(cellB);
          } else if (input.sortOrder === "Z - A") {
            return cellB.localeCompare(cellA);
          }
          return 0;
        });
  
        // calculate offset based on cursor
        const page = input.cursor ? parseInt(input.cursor) : 0;
        const offset = page * input.limit;
        
        // get the subset of sorted record IDs for this page
        const pageRecordIds = allRecords
          .slice(offset, offset + input.limit)
          .map(r => r.id);
  
        // fetch full record data for the page
        const records = await ctx.db.record.findMany({
          where: {
            id: { in: pageRecordIds }
          },
          include: { cells: true },
        });
  
        const orderedRecords = pageRecordIds
          .map(id => records.find(r => r.id === id))
          .filter((r): r is NonNullable<typeof r> => r !== undefined);
  
        const hasNextPage = offset + input.limit < allRecords.length;
  
        return { 
          records: orderedRecords,
          nextCursor: hasNextPage ? String(page + 1) : undefined,
        };
      }
  
      // cursor pagination if no sorting applies
      const records = await ctx.db.record.findMany({
        where: whereCondition,
        include: { cells: true },
        orderBy: { rowIndex: "asc" },
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        skip: input.cursor ? 1 : undefined,
      });
      
      let nextCursor = undefined;
      if (records.length > input.limit) {
        const nextRecord = records.pop();
        nextCursor = nextRecord?.id;
      }
  
      return { records, nextCursor };
    }),

  // get a table by id
  getById: protectedProcedure
    .input(z.object({ 
      tableId: z.string().min(1),
      sortColumnId: z.string().optional(),
      sortOrder: z.string().optional(),
      filterColumnId: z.string().optional(),
      filterCond: z.string().optional(),
      filterValue: z.string().optional(),
    }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.table.findUnique({
        where: {
          id: input.tableId,
        },
        include: {
          views: {
            orderBy: {
              createdAt: "asc",
            },
          },
          columns: true,
          records: true,
        },
      });
    }),

  // create a column
  createColumn: protectedProcedure
    .input(
      z.object({ 
        tableId: z.string().min(1), 
        name: z.string().min(1),
        type: z.string().min(1),
        id: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
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

      return newColumn;
    }),

  // create a record
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
  
      return record;
    }),

  // update a cell
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

  // create a default table
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
              { name: "Column 1", type: "TEXT" },
              { name: "Column 2", type: "TEXT" },
              { name: "Column 3", type: "NUMBER" },
              { name: "Column 4", type: "NUMBER" },
            ],
          },
          views: {
            create: {
              name: "Grid View",
              sortColumnId: "",
              sortOrder: "",
              filterColumnId: "",
              filterCond: "",
              filterValue: "",
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

  // get all columns
  getColumns: protectedProcedure
    .input(z.object({ tableId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      return ctx.db.column.findMany({
        where: { tableId: input.tableId },
      });
    }),

  // create fake records
  createFakeRecords: protectedProcedure
    .input(z.object({
      tableId: z.string().min(1), 
      columnIds: z.array(z.string().min(1)),
      seed: z.string().optional(),
      count: z.number().int().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { tableId, columnIds, count = 500 } = input;
  
      // Get the column types for the relevant columns
      const columns = await ctx.db.column.findMany({
        where: { tableId, id: { in: columnIds } },
      });
      const columnTypeMap = new Map(columns.map(col => [col.id, col.type]));
  
      const currentCount = await ctx.db.record.count({
        where: { tableId },
      });
  
      const records = Array.from({ length: count }, (_, i) => ({
        id: `${tableId}-${i + currentCount}`,
        tableId: tableId,
        rowIndex: i + currentCount,
      }));
  
      const recordsData = records.flatMap((record) =>
        columnIds.map((columnId) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const colType = columnTypeMap.get(columnId);
          return {
            id: `${record.id}-${columnId}`,
            data: colType === "NUMBER"
              ? String(faker.number.int({ min: 1, max: 1000 })) 
              : faker.person.fullName(),
            recordId: record.id,
            columnId: columnId,
          };
        })
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
  
  // create a view
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
          filterColumnId: "",
          filterCond: "",
          filterValue: "",
        }
      })
    }),


  // get a view by view id
  getTableView: protectedProcedure
    .input(z.object({ viewId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      return ctx.db.view.findUnique({
        where: { id: input.viewId },
      });
    }),

  // update a view
  updateTableView: protectedProcedure
    .input(
      z.object({ 
        viewId: z.string().min(1), 
        sortColumnId: z.string(),
        sortOrder: z.string(),
        filterColumnId: z.string(),
        filterCond: z.string(),
        filterValue: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.view.update({
        where: { id: input.viewId },
        data: {
          sortColumnId: input.sortColumnId,
          sortOrder: input.sortOrder,
          filterColumnId: input.filterColumnId,
          filterCond: input.filterCond,
          filterValue: input.filterValue,
        }
      });
    }),

});