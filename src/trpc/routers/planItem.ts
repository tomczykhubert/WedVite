import { translateSchemaConfig } from "@/lib/forms/schemaTranslator";
import {
  assertOwnerOfEvent,
  assertOwnerOfPlanItem,
} from "@/lib/prisma/eventUtils";
import { basePlanItemConfig } from "@/schemas/planItemFormConfig";
import { EventPlanItem } from "@prisma/client";
import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../init";
import { TRPCResponse } from "./_app";

const MAX_PLAN_ITEMS = 8;

export const planItemRouter = createTRPCRouter({
  add: protectedProcedure
    .input(
      z.object({
        ...translateSchemaConfig(basePlanItemConfig),
        eventId: z.string(),
      })
    )
    .mutation(
      async ({
        ctx: { user, db },
        input,
      }): Promise<TRPCResponse<EventPlanItem>> => {
        await assertOwnerOfEvent(user.id, input.eventId, db);

        const count = await db.eventPlanItem.count({
          where: {
            eventId: input.eventId,
          },
        });

        if (count >= MAX_PLAN_ITEMS)
          return {
            success: false,
            error: {
              key: "trpcError.maxPlanItemsReached",
              values: { max: MAX_PLAN_ITEMS },
            },
          };

        const planItem = await db.eventPlanItem.create({
          data: {
            name: input.name,
            description: input.description,
            details: input.details,
            startAt: input.startAt.toISOString(),
            endAt: input.endAt ? input.endAt.toISOString() : null,
            addressLine1: input.addressLine1,
            addressLine2: input.addressLine2,
            city: input.city,
            postalCode: input.postalCode,
            region: input.region,
            country: input.country,
            eventId: input.eventId,
          },
        });
        return { success: true, data: planItem };
      }
    ),
  update: protectedProcedure
    .input(
      z.object({ ...translateSchemaConfig(basePlanItemConfig), id: z.string() })
    )
    .mutation(async ({ ctx: { user, db }, input }) => {
      await assertOwnerOfPlanItem(user.id, input.id, db);

      const planItem = await db.eventPlanItem.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          description: input.description,
          details: input.details,
          startAt: input.startAt.toISOString(),
          endAt: input.endAt && input.endAt.toISOString(),
          addressLine1: input.addressLine1,
          addressLine2: input.addressLine2,
          city: input.city,
          postalCode: input.postalCode,
          region: input.region,
          country: input.country,
        },
      });
      return planItem;
    }),
  get: protectedProcedure
    .input(z.object({ eventId: z.string() }))
    .query(async ({ ctx: { user, db }, input }) => {
      await assertOwnerOfEvent(user.id, input.eventId, db);

      return await db.eventPlanItem.findMany({
        where: {
          eventId: input.eventId,
        },
        orderBy: {
          startAt: "asc",
        },
      });
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx: { user, db }, input }) => {
      await assertOwnerOfPlanItem(user.id, input.id, db);

      return db.eventPlanItem.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
