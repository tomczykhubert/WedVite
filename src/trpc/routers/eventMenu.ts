import { translateSchemaConfig } from "@/lib/forms/schemaTranslator";
import {
  assertOwnerOfEvent,
  assertOwnerOfMenu,
} from "@/lib/prisma/eventUtils";
import { Menu } from "@prisma/client";
import z from "zod";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "../init";
import { TRPCResponse } from "./_app";
import { baseEventMenuConfig, MAX_MENU, SYSTEM_MENUS } from "@/schemas/menuFormConfig";

export const eventMenuRouter = createTRPCRouter({
  add: protectedProcedure
    .input(
      z.object({
        ...translateSchemaConfig(baseEventMenuConfig),
        eventId: z.string(),
      })
    )
    .mutation(
      async ({
        ctx: { user, db },
        input,
      }): Promise<TRPCResponse<Menu>> => {
        await assertOwnerOfEvent(user.id, input.eventId, db);

        const count = await db.menu.count({
          where: {
            eventId: input.eventId,
          },
        });

        if (count >= MAX_MENU)
          return {
            success: false,
            error: {
              key: "trpcError.maxMenuReached",
              values: { max: MAX_MENU },
            },
          };

        const menu = await db.menu.create({
          data: {
            name: input.name,
            color: input.color,
            eventId: input.eventId,
          },
        });
        return { success: true, data: menu };
      }
    ),
  markDefault: protectedProcedure
    .input(
      z.object({ id: z.string(), eventId: z.string() })
    )
    .mutation(async ({ ctx: { user, db }, input }) => {
      await assertOwnerOfEvent(user.id, input.eventId, db);
      await assertOwnerOfMenu(user.id, input.id, db);

      await db.menu.updateMany({
        where: {
          eventId: input.eventId,
          default: true,
        },
        data: {
          default: false,
        },
      });

      const menu = await db.menu.update({
        where: {
          id: input.id,
        },
        data: {
          default: true,
        },
      });
      return menu;
    }),
  addSystem: protectedProcedure
    .input(
      z.object({ eventId: z.string() })
    )
    .mutation(async ({ ctx: { user, db }, input }): Promise<TRPCResponse<string[]>> => {
      await assertOwnerOfEvent(user.id, input.eventId, db);

      const menus = await db.menu.findMany({
        where: {
          eventId: input.eventId,
        }
      });

      const toAdd = SYSTEM_MENUS.filter(systemMenu => !menus.some((menu) => menu.system && menu.name === systemMenu.name))

      if (menus.length + toAdd.length > MAX_MENU)
        return {
          success: false,
          error: {
            key: "trpcError.maxMenuReached",
            values: { max: MAX_MENU },
          },
        };

      if (toAdd.length > 0) {
        await db.menu.createMany({
          data: toAdd.map((menu) => ({
            eventId: input.eventId,
            name: menu.name,
            color: menu.color,
            system: true,
          })),
        });
      }
      return { success: true, data: toAdd.map(m => m.name) };
    }),
  update: protectedProcedure
    .input(
      z.object({ ...translateSchemaConfig(baseEventMenuConfig), id: z.string() })
    )
    .mutation(async ({ ctx: { user, db }, input }) => {
      await assertOwnerOfMenu(user.id, input.id, db);

      const menu = await db.menu.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          color: input.color,
        },
      });
      return menu;
    }),
  get: baseProcedure
    .input(z.object({ eventId: z.string() }))
    .query(async ({ ctx: { user, db }, input }) => {
      //TODO: Zmienic spowrotem na base procedure a w routerze rsvp dodac nowa procedure ktora wrpardza czy event jest publiczny
      // await assertOwnerOfEvent(user.id, input.eventId, db);

      return await db.menu.findMany({
        where: {
          eventId: input.eventId,
        }
      });
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx: { user, db }, input }) => {
      await assertOwnerOfMenu(user.id, input.id, db);

      return db.menu.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
