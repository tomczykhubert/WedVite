import { Locale } from "@/i18n/routing";
import { translateSchemaConfig } from "@/lib/forms/schemaTranslator";
import { assertEventIsAcceptingResponsesByInvitationId } from "@/lib/prisma/eventUtils";
import { sendRSVPNotification } from "@/lib/resend/actions/rsvpNotification";
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
            include: {
              menu: true,
            },
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
      const invitation = await assertEventIsAcceptingResponsesByInvitationId(
        input.invitationId,
        db
      );

      await db.invitation.update({
        where: { id: invitation.id },
        data: {
          status: InvitationStatus.ANSWERED,
          responseDate: new Date(),
        },
      });

      const updatedGuests = await Promise.all(
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

      if (invitation.event.notificationSettings?.onAttendanceRespond) {
        await sendRSVPNotification({
          eventId: invitation.event.id,
          eventName: invitation.event.name,
          invitationName: invitation.name,
          guests: updatedGuests,
          //TODO: add preferred locale to user
          locale: "en" as Locale,
          recipientEmail: invitation.event.user.email,
        });
      }

      return updatedGuests;
    }),
});
