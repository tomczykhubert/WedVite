import { isOwnerOfEvent, isOwnerOfContact } from "@/lib/prisma/eventUtils";
import { createTRPCRouter, protectedProcedure } from "../init";
import { translateSchemaConfig } from "@/lib/forms/schemaTranslator";
import { baseContactConfig } from "@/schemas/contact/contactFormConfig";
import { TRPCError } from "@trpc/server";
import z from "zod";

export const contactRouter = createTRPCRouter({
  add: protectedProcedure
    .input(z.object({ ...translateSchemaConfig(baseContactConfig), eventId: z.string()}))
    .mutation(async ({ ctx: { user, db }, input }) => {

      if (!(await isOwnerOfEvent(user.id, input.eventId, db))) throw new TRPCError({ code: "UNAUTHORIZED" });

      const maxContact = await db.eventContact.findFirst({
        where: {  eventId: input.eventId },
        orderBy: { order: 'desc' },
      })

      const contact = await db.eventContact.create({
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email,
          phoneNumber: input.phoneNumber,
          type: input.contactType,
          eventId: input.eventId,
          order: maxContact ? maxContact.order + 1 : 0,
        }
      });
      return contact;
    }),
  update: protectedProcedure
    .input(z.object({ ...translateSchemaConfig(baseContactConfig), id: z.string() }))
    .mutation(async ({ ctx: { user, db }, input }) => {

      if (!(await isOwnerOfContact(user.id, input.id, db))) throw new TRPCError({ code: "UNAUTHORIZED" });

      const contact = await db.eventContact.update({
        where: {
          id: input.id
        },
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email,
          phoneNumber: input.phoneNumber,
          type: input.contactType,
        }
      });
      return contact;
    }),
  get: protectedProcedure
    .input(
      z.object({ eventId: z.string() })
    )
    .query(async ({ ctx: { user, db }, input }) => {

      if (!isOwnerOfEvent(user.id, input.eventId, db)) throw new TRPCError({ code: "UNAUTHORIZED" });

      return await db.eventContact.findMany({
        where: {
          eventId: input.eventId,
        },
        orderBy: {
          order: 'asc'
        }
      });
    }),
});