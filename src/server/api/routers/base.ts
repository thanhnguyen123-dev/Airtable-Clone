
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

/**
 * Minimal CRUD for "Base"
 * Make sure you are only allowing
 * authenticated users to create & read bases
 */
export const baseRouter = createTRPCRouter({
  // Get ALL bases belonging to the current user
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.base.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),

  // Get single base by ID
  getById: protectedProcedure
    .input(z.object({ baseId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.base.findFirst({
        where: {
          id: input.baseId,
          userId: ctx.session.user.id,
        },
      });
    }),

  // Create a base
  create: protectedProcedure
    .input(z.object({ name: z.string().default("Untitled Base") }))
    .mutation(async ({ ctx, input }) => {
      const newBase =  ctx.db.base.create({
        data: {
          name: input.name,
          userId: ctx.session.user.id,
        },
      });
      console.log("new base: ", newBase);
      return newBase;
    }),
});
