import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../init";
import { translateSchemaConfig } from "@/lib/forms/schemaTranslator";
import { addEventSchema } from "@/schemas/event/addEventSchema";
import { TRPCError } from "@trpc/server";

export const eventRouter = createTRPCRouter({
  add: protectedProcedure
    .input(z.object(translateSchemaConfig(addEventSchema)))
    .mutation(async ({ ctx: { user, db }, input }) => {
      const userId = user.id;

      const event = await db.event.create({
        data: {
          name: input.name,
          userId: userId,
          startAt: new Date(Date.now()).toISOString(),
          respondDeadline: new Date(Date.now()).toISOString(),
        },
      });
      return event;
    }),
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx: { db }, input }) => {
      const event = await db.event.findUnique({
        where: {
          id: input.id,
        },
      });
      // if (!event) throw new TRPCError({ code: "NOT_FOUND" });
      return event;
    }),
  get: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ ctx: { user, db }, input }) => {
      const limit = input?.limit ?? 15;
      const cursor = input?.cursor;

      const events = await db.event.findMany({
        where: {
          userId: user.id,
        },
        take: limit + 1, // take an extra item to determine if there are more items
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          updatedAt: "desc",
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (events.length > limit) {
        const nextItem = events.pop();
        nextCursor = nextItem!.id;
      }

      return {
        items: events,
        nextCursor,
      };
    }),
});
