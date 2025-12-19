import { translateSchemaConfig } from "@/lib/forms/schemaTranslator";
import {
  assertOwnerOfEvent,
  assertOwnerOfSeat,
  assertOwnerOfTable,
} from "@/lib/prisma/eventUtils";
import { addTableConfig } from "@/schemas/tableFormConfig";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../init";

export const tableRouter = createTRPCRouter({
  getTables: protectedProcedure
    .input(z.object({ eventId: z.string() }))
    .query(async ({ ctx, input }) => {
      await assertOwnerOfEvent(ctx.user.id, input.eventId, ctx.db);

      return ctx.db.table.findMany({
        where: { eventId: input.eventId },
        include: {
          seats: {
            include: {
              guest: {
                include: {
                  invitation: true,
                },
              },
            },
            orderBy: { position: "asc" },
          },
        },
      });
    }),

  createTable: protectedProcedure
    .input(
      z.object({
        ...translateSchemaConfig(addTableConfig),
        eventId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await assertOwnerOfEvent(ctx.user.id, input.eventId, ctx.db);

      const { capacity, ...tableData } = input;

      const table = await ctx.db.table.create({
        data: {
          ...tableData,
          capacity,
          seats: {
            create: Array.from({ length: capacity }, (_, i) => ({
              position: i,
            })),
          },
        },
        include: { seats: true },
      });

      return table;
    }),

  updateTablePosition: protectedProcedure
    .input(
      z.object({
        tableId: z.string(),
        positionX: z.number(),
        positionY: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await assertOwnerOfTable(ctx.user.id, input.tableId, ctx.db);

      return ctx.db.table.update({
        where: { id: input.tableId },
        data: {
          positionX: input.positionX,
          positionY: input.positionY,
        },
      });
    }),

  assignGuestToSeat: protectedProcedure
    .input(
      z.object({
        seatId: z.string(),
        guestId: z.string().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await assertOwnerOfSeat(ctx.user.id, input.seatId, ctx.db);

      if (input.guestId) {
        await ctx.db.seat.updateMany({
          where: { guestId: input.guestId },
          data: { guestId: null },
        });
      }

      return ctx.db.seat.update({
        where: { id: input.seatId },
        data: { guestId: input.guestId },
      });
    }),

  deleteTable: protectedProcedure
    .input(z.object({ tableId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await assertOwnerOfTable(ctx.user.id, input.tableId, ctx.db);

      return ctx.db.table.delete({
        where: { id: input.tableId },
      });
    }),

  moveGuest: protectedProcedure
    .input(
      z.object({
        fromSeatId: z.string(),
        toSeatId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const fromSeat = await assertOwnerOfSeat(
        ctx.user.id,
        input.fromSeatId,
        ctx.db
      );
      const toSeat = await assertOwnerOfSeat(
        ctx.user.id,
        input.toSeatId,
        ctx.db
      );

      await ctx.db.$transaction(async (tx) => {
        await tx.seat.update({
          where: { id: fromSeat.id },
          data: { guestId: null },
        });

        if (toSeat.guestId) {
          await tx.seat.update({
            where: { id: toSeat.id },
            data: { guestId: null },
          });
        }

        if (fromSeat.guestId) {
          await tx.seat.update({
            where: { id: toSeat.id },
            data: { guestId: fromSeat.guestId },
          });
        }

        if (toSeat.guestId) {
          await tx.seat.update({
            where: { id: fromSeat.id },
            data: { guestId: toSeat.guestId },
          });
        }
      });

      return { success: true };
    }),
});
