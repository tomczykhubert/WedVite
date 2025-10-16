import { translateSchemaConfig } from "@/lib/forms/schemaTranslator";
import { assertEventIsAcceptingResponses } from "@/lib/prisma/eventUtils";
import { respondRSVPConfig } from "@/schemas/invitationFormConfig";
import { InvitationStatus } from "@prisma/client";
import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "../init";

export const rsvpRouter = createTRPCRouter({
  getInvitation: baseProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx: { db }, input }) => {
      const invitation = await db.invitation.findUnique({
        where: { id: input.id },
        include: {
          guests: {
            orderBy: { id: "asc" },
          },
          event: {
            select: {
              name: true,
              respondEnd: true,
              respondStart: true,
            },
          },
        },
      });

      if (!invitation) {
        throw new Error("Invitation not found");
      }

      return invitation;
    }),
  submitResponse: baseProcedure
    .input(
      z.object({
        ...translateSchemaConfig(respondRSVPConfig),
        invitationId: z.string(),
      })
    )
    .mutation(async ({ ctx: { db }, input }) => {
      await assertEventIsAcceptingResponses(input.invitationId, db);
      await db.invitation.update({
        where: { id: input.invitationId },
        data: {
          status: InvitationStatus.ANSWERED,
          responseDate: new Date(),
        },
      });

      return await Promise.all(
        input.guests.map(async (guest) =>
          db.guest.update({
            where: { id: guest.id },
            data: {
              name: guest.name,
              gender: guest.gender,
              status: guest.attendanceStatus,
              menuId: guest.menuId ?? null,
              respondedAt: new Date(),
            },
          })
        )
      );
    }),
});
