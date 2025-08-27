import { createTRPCRouter, protectedProcedure } from "../init";
import { translateSchemaConfig } from "@/lib/forms/schemaTranslator";
import { baseContactConfig } from "@/schemas/contact/contactFormConfig";
import { EventContactType } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import z from "zod";

const contactSchema = z.object({...translateSchemaConfig(baseContactConfig), eventId: z.string(), id: z.string().nullish()})

export const contactRouter = createTRPCRouter({
  upsert: protectedProcedure
    .input(contactSchema)
    .mutation(async ({ ctx: { user, db }, input }) => {
      
      const count = await db.event.count({
        where: {
          id: input.eventId,
          userId: user.id
        },
      })

      if(count == 0) throw new TRPCError({ code: "UNAUTHORIZED" });

      const contact = await db.eventContact.upsert({
        where: {
          id: input.id || "",
          eventId: input.eventId,
        },
        update: {
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email,
          phoneNumber: input.phoneNumber,
          type: input.contactType,
        },
        create: {
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email,
          phoneNumber: input.phoneNumber,
          type: input.contactType,
          eventId: input.eventId,
        }
      });
      return contact;
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

      const events = await db.eventContact.findMany({
        where: {
          event: {
            userId: user.id,
          }
        },
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
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
