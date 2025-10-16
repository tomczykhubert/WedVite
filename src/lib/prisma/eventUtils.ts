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

export const assertOwnerOfMenu = async (
  userId: ID,
  menuId: ID,
  db: PrismaClient
) => {
  const count = await db.menu.count({
    where: {
      id: menuId,
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

export const assertEventIsAcceptingResponses = async (
  invitationId: ID,
  db: PrismaClient
) => {
  const { event } =
    (await db.invitation.findFirst({
      where: {
        id: invitationId,
      },
      include: {
        event: {
          select: {
            respondStart: true,
            respondEnd: true,
          },
        },
      },
    })) ?? {};

  if (!event) {
    throw new TRPCError({ code: "NOT_FOUND" });
  }

  const now = new Date();

  const beforeStart = event.respondStart && now < event.respondStart;
  const afterEnd = event.respondEnd && now > event.respondEnd;

  if (beforeStart || afterEnd) {
    throw new TRPCError({
      code: "FORBIDDEN",
    });
  }
};
