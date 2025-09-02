import {
  assertOwnerOfEvent,
  assertOwnerOfContact,
} from "@/lib/prisma/eventUtils";
import { createTRPCRouter, protectedProcedure } from "../init";
import { translateSchemaConfig } from "@/lib/forms/schemaTranslator";
import { baseContactConfig } from "@/schemas/contactFormConfig";
import z from "zod";
import { TRPCResponse } from "./_app";
import { EventContact } from "@prisma/client";
const MAX_CONTACTS = 5;

export const contactRouter = createTRPCRouter({
  add: protectedProcedure
    .input(
      z.object({
        ...translateSchemaConfig(baseContactConfig),
        eventId: z.string(),
      })
    )
    .mutation(async ({ ctx: { user, db }, input }): Promise<TRPCResponse<EventContact>> => {
      await assertOwnerOfEvent(user.id, input.eventId, db);

      const count = await db.eventContact.count({
        where: {
          eventId: input.eventId,
        },
      });

      if (count >= MAX_CONTACTS) return {
        success: false, error: {
          key: "trpcError.maxContactsReached",
          values: { max: MAX_CONTACTS }
        }
      };

      const maxContact = await db.eventContact.findFirst({
        where: { eventId: input.eventId },
        orderBy: { order: "desc" },
      });

      const contact = await db.eventContact.create({
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email,
          phoneNumber: input.phoneNumber,
          type: input.contactType,
          eventId: input.eventId,
          order: maxContact ? maxContact.order + 1 : 0,
        },
      });
      return { success: true, data: contact };
    }),
  update: protectedProcedure
    .input(
      z.object({ ...translateSchemaConfig(baseContactConfig), id: z.string() })
    )
    .mutation(async ({ ctx: { user, db }, input }) => {
      await assertOwnerOfContact(user.id, input.id, db);

      const contact = await db.eventContact.update({
        where: {
          id: input.id,
        },
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email,
          phoneNumber: input.phoneNumber,
          type: input.contactType,
        },
      });
      return contact;
    }),
  get: protectedProcedure
    .input(z.object({ eventId: z.string() }))
    .query(async ({ ctx: { user, db }, input }) => {
      await assertOwnerOfEvent(user.id, input.eventId, db);

      return await db.eventContact.findMany({
        where: {
          eventId: input.eventId,
        },
        orderBy: {
          order: "asc",
        },
      });
    }),
  updateOrder: protectedProcedure
    .input(
      z.object({
        contacts: z.array(
          z.object({
            id: z.string(),
            order: z.number(),
          })
        ),
      })
    )
    .mutation(async ({ ctx: { user, db }, input }) => {
      await Promise.all(
        input.contacts.map(async (contact) => {
          await assertOwnerOfContact(user.id, contact.id, db);
        })
      );

      return await Promise.all(
        input.contacts.map(async (contact) =>
          db.eventContact.update({
            where: { id: contact.id },
            data: { order: contact.order },
          })
        )
      );
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx: { user, db }, input }) => {
      await assertOwnerOfContact(user.id, input.id, db);

      return db.eventContact.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
