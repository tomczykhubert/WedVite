import { z } from "zod";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "../init";
import { translateSchemaConfig } from "@/lib/forms/schemaTranslator";
import { addEventSchema } from "@/schemas/event/addEventSchema";

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
        }
      })
      return event
    }),
  get: protectedProcedure.query(async ({ ctx: { user, db } }) => {
    const userId = user.id;
    if (!userId) return null;

    return await db.event.findMany({
      where: {
        userId: userId,
      },
    });
  }),
});
