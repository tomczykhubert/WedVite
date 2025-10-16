import { translateSchemaConfig } from "@/lib/forms/schemaTranslator";
import {
  assertOwnerOfGuest,
  assertOwnerOfInvitation,
  assertOwnerOfMenu,
} from "@/lib/prisma/eventUtils";
import {
  addGuestConfig,
  updateGuestConfig,
} from "@/schemas/invitationFormConfig";
import { AttendanceStatus } from "@prisma/client";
import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../init";

export const guestRouter = createTRPCRouter({
  add: protectedProcedure
    .input(
      z.object({
        ...translateSchemaConfig(addGuestConfig),
        invitationId: z.string(),
      })
    )
    .mutation(async ({ ctx: { user, db }, input }) => {
      await assertOwnerOfInvitation(user.id, input.invitationId, db);
      if (input.menuId)
        await assertOwnerOfMenu(user.id, input.menuId, db);

      const invitation = await db.guest.create({
        data: {
          name: input.name,
          gender: input.gender,
          type: input.guestType,
          status: AttendanceStatus.PENDING,
          invitationId: input.invitationId,
          menuId: input.menuId ?? null,
        },
      });

      return invitation;
    }),
  update: protectedProcedure
    .input(
      z.object({
        ...translateSchemaConfig(updateGuestConfig),
        id: z.string(),
      })
    )
    .mutation(async ({ ctx: { user, db }, input }) => {
      await assertOwnerOfGuest(user.id, input.id, db);
      if (input.menuId)
        await assertOwnerOfMenu(user.id, input.menuId, db);

      return db.guest.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          gender: input.gender,
          type: input.guestType,
          status: input.attendanceStatus,
          menuId: input.menuId ?? null,
        },
      });
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx: { user, db }, input }) => {
      await assertOwnerOfGuest(user.id, input.id, db);

      return db.guest.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
