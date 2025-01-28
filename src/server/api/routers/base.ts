import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const baseRouter = createTRPCRouter({
  // Create a base
  create: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      try {
        const newBase = await ctx.db.base.create({
          data: {
            name: input.name,
            createdBy: { connect: { id: ctx.session.user.id } },
          },
        });
        return newBase;
      } catch (error) {
        console.error("Error in baseRouter.create:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Failed to create base",
        });
      }
    }),

  // Get ALL bases belonging to the current user
  getAll: protectedProcedure.query(async ({ ctx }) => {
    try {
      const allBases = await ctx.db.base.findMany({
        where: {
          createdById: ctx.session.user.id
        },
      });
      return allBases;
    } catch (error) {
      console.error("Error in baseRouter.getAll:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: error instanceof Error ? error.message : "Failed to get all bases",
      });
    }
  }),

  // Get single base by ID
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const base = await ctx.db.base.findFirst({
          where: {
            id: input.id,
          },
        });
        return base;
      } catch (error) {
        console.error("Error in baseRouter.getById:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Failed to get base",
        });
      }
    }),

  getTables: protectedProcedure
    .input(z.object({ baseId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const tables = await ctx.db.table.findMany({
        where: { baseId: input.baseId },
        include: { columns: true },
      });
      return tables;
    }),
  
});


