import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../init";
import { translateSchemaConfig } from "@/lib/forms/schemaTranslator";
import {
  addEventConfig,
  updateEventConfig,
} from "@/schemas/event/eventFormConfig";
import { TRPCError } from "@trpc/server";

export const eventRouter = createTRPCRouter({
  add: protectedProcedure
    .input(z.object(translateSchemaConfig(addEventConfig)))
    .mutation(async ({ ctx: { user, db }, input }) => {
      const userId = user.id;

      const event = await db.event.create({
        data: {
          name: input.name,
          userId: userId,
        },
      });
      return event;
    }),
  getById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        withNotificationSettings: z.boolean().nullish(),
        withContacts: z.boolean().nullish(),
        withPlanItems: z.boolean().nullish(),
      })
    )
    .query(async ({ ctx: { user, db }, input }) => {
      const event = await db.event.findUnique({
        where: {
          id: input.id,
          userId: user.id,
        },
        include: {
          notificationSettings: input.withNotificationSettings ?? false,
          eventContacts: input.withContacts ?? false,
          eventPlanItems: input.withPlanItems ?? false,
        },
      });
      return event;
    }),
  update: protectedProcedure
    .input(
      z.object({ ...translateSchemaConfig(updateEventConfig), id: z.string() })
    )
    .mutation(async ({ ctx: { user, db }, input }) => {
      const count = await db.event.count({
        where: {
          id: input.id,
          userId: user.id,
        },
      });

      if (count == 0) throw new TRPCError({ code: "UNAUTHORIZED" });

      const event = await db.event.update({
        where: {
          id: input.id,
          userId: user.id,
        },
        include: {
          notificationSettings: true,
        },
        data: {
          name: input.name,
          respondStart: input.respondStart.toISOString(),
          respondEnd: input.respondEnd.toISOString(),
          notificationSettings: {
            upsert: {
              create: {
                onImageUpload: input.onImageUpload,
                onAttendanceRespond: input.onAttendanceRespond,
              },
              update: {
                onImageUpload: input.onImageUpload,
                onAttendanceRespond: input.onAttendanceRespond,
              },
            },
          },
        },
      });
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
