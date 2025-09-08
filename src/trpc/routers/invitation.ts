import { stc } from "@/i18n/utils";
import { translateSchemaConfig } from "@/lib/forms/schemaTranslator";
import {
  assertOwnerOfEvent,
  assertOwnerOfInvitation,
} from "@/lib/prisma/eventUtils";
import {
  addInvitationConfig,
  updateInvitationConfig,
} from "@/schemas/invitationFormConfig";
import {
  AttendanceStatus,
  Guest,
  Invitation,
  InvitationStatus,
  Prisma,
} from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../init";
import { TRPCResponse } from "./_app";

const INVITATIONS_PER_PAGE = 15;

export const invitationRouter = createTRPCRouter({
  add: protectedProcedure
    .input(
      z.object({
        ...translateSchemaConfig(addInvitationConfig),
        eventId: z.string(),
      })
    )
    .mutation(
      async ({
        ctx: { user, db },
        input,
      }): Promise<TRPCResponse<Invitation & { guests: Guest[] }>> => {
        await assertOwnerOfEvent(user.id, input.eventId, db);
        const guests = input.guests.map(
          (
            guest: Pick<Guest, "name" | "gender" | "type">
          ): Pick<Guest, "name" | "gender" | "type" | "status"> => {
            return {
              ...guest,
              status: AttendanceStatus.PENDING,
            };
          }
        );
        const invitation = await db.invitation.create({
          data: {
            name: input.name,
            eventId: input.eventId,
            status: InvitationStatus.CREATED,
            guests: {
              create: guests,
            },
          },
          include: {
            guests: true,
          },
        });

        return { success: true, data: invitation };
      }
    ),
  // getById: protectedProcedure
  //   .input(
  //     z.object({
  //       id: z.string(),
  //       withGuests: z.boolean().nullish(),
  //     })
  //   )
  //   .query(async ({ ctx: { user, db }, input }) => {
  //     await assertOwnerOfEvent(user.id, input.id, db);

  //     const invitation = await db.invitation.findUnique({
  //       where: {
  //         id: input.id,
  //       },
  //       include: {
  //         guests: input.withGuests ?? false,
  //       },
  //     });
  //     return invitation;
  //   }),
  update: protectedProcedure
    .input(
      z.object({
        ...translateSchemaConfig(updateInvitationConfig),
        id: z.string(),
      })
    )
    .mutation(async ({ ctx: { user, db }, input }) => {
      await assertOwnerOfInvitation(user.id, input.id, db);

      return db.invitation.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          status: input.status,
        },
      });
    }),
  get: protectedProcedure
    .input(
      z.object({
        cursor: z.string().nullish(),
        eventId: z.string(),
        name: z.string().nullish(),
        attendanceStatus: z
          .nativeEnum(AttendanceStatus, {
            message: stc("invalidAttendanceStatus"),
          })
          .nullish(),
        invitationStatus: z
          .nativeEnum(InvitationStatus, {
            message: stc("invalidInvitationStatus"),
          })
          .nullish(),
      })
    )
    .query(async ({ ctx: { user, db }, input }) => {
      await assertOwnerOfEvent(user.id, input.eventId, db);
      const cursor = input?.cursor;

      const where: Prisma.InvitationWhereInput = {
        eventId: input.eventId,
        ...(input.invitationStatus && {
          status: input.invitationStatus,
        }),
      };

      if (input.name) {
        where.OR = [
          {
            name: {
              contains: input.name,
              mode: "insensitive",
            },
          },
          {
            guests: {
              some: {
                name: {
                  contains: input.name,
                  mode: "insensitive",
                },
                ...(input.attendanceStatus && {
                  status: input.attendanceStatus,
                }),
              },
            },
          },
        ];
      } else if (input.attendanceStatus) {
        where.guests = {
          some: {
            status: input.attendanceStatus,
          },
        };
      }
      const invitations = await db.invitation.findMany({
        where: where,
        include: {
          guests: true,
        },
        take: INVITATIONS_PER_PAGE + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          updatedAt: "desc",
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (invitations.length > INVITATIONS_PER_PAGE) {
        const nextItem = invitations.pop();
        nextCursor = nextItem!.id;
      }

      return {
        items: invitations,
        nextCursor,
      };
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx: { user, db }, input }) => {
      await assertOwnerOfInvitation(user.id, input.id, db);

      return db.invitation.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
