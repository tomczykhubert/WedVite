import { TableShape } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../init";

export const tableRouter = createTRPCRouter({
  getTables: protectedProcedure
    .input(z.object({ eventId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.table.findMany({
        where: { eventId: input.eventId },
        include: {
          seats: {
            include: {
              guest: true,
            },
            orderBy: { position: "asc" },
          },
        },
      });
    }),

  createTable: protectedProcedure
    .input(
      z.object({
        eventId: z.string(),
        name: z.string(),
        shape: z.nativeEnum(TableShape),
        capacity: z.number().min(1).max(50),
        rows: z.number().min(1).max(10).optional(),
        columns: z.number().min(1).max(10).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
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
      return ctx.db.table.delete({
        where: { id: input.tableId },
      });
    }),
});
