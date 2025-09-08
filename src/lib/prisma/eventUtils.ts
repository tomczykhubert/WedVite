import ID from "@/types/id";
import { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";

export const assertOwnerOfEvent = async (
  userId: ID,
  eventId: ID,
  db: PrismaClient
) => {
  const count = await db.event.count({
    where: {
      id: eventId,
      userId: userId,
    },
  });

  assertOwnership(count);
};

export const assertOwnerOfContact = async (
  userId: ID,
  contactId: ID,
  db: PrismaClient
) => {
  const count = await db.eventContact.count({
    where: {
      id: contactId,
      event: {
        userId: userId,
      },
    },
  });

  assertOwnership(count);
};

export const assertOwnerOfPlanItem = async (
  userId: ID,
  planItemId: ID,
  db: PrismaClient
) => {
  const count = await db.eventPlanItem.count({
    where: {
      id: planItemId,
      event: {
        userId: userId,
      },
    },
  });

  assertOwnership(count);
};

export const assertOwnerOfInvitation = async (
  userId: ID,
  invitationId: ID,
  db: PrismaClient
) => {
  const count = await db.invitation.count({
    where: {
      id: invitationId,
      event: {
        userId: userId,
      },
    },
  });

  assertOwnership(count);
};

export const assertOwnerOfGuest = async (
  userId: ID,
  guestId: ID,
  db: PrismaClient
) => {
  const count = await db.guest.count({
    where: {
      id: guestId,
      invitation: {
        event: {
          userId: userId,
        },
      },
    },
  });

  assertOwnership(count);
};

const assertOwnership = (count: number) => {
  if (count == 0) throw new TRPCError({ code: "UNAUTHORIZED" });
};
