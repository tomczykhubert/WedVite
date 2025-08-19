import { z } from "zod";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "../init";
import prisma from "@/lib/prisma/prisma";
import { translateSchemaConfig } from "@/lib/forms/schemaTranslator";
import { addEventSchema } from "@/schemas/event/addEventSchema";

export const eventRouter = createTRPCRouter({
  add: protectedProcedure
    .input(z.object(translateSchemaConfig(addEventSchema)))
    .mutation(async (opts) => {
      const { input } = opts;
      const userId = opts.ctx.user.id;
      console.log(input)
      console.log('siemaneczko')
      await prisma.event.create({
        data: {
          name: input.name,
          userId: userId,
          startAt: new Date(Date.now()).toISOString(),
          respondDeadline: new Date(Date.now()).toISOString(),
        }
      })
    }),
  get: protectedProcedure.query(async (opts) => {
    const userId = opts.ctx.user.id;
    if (!userId) return null;

    return await prisma.event.findMany({
      where: {
        userId: userId,
      },
    });
  }),
});
