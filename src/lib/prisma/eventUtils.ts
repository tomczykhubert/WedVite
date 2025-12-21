import ID from "@/types/id";
import { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { STORAGE_CONFIG } from "../storage/config";
import { isValidFileSize, isValidImageType } from "../storage/utils";

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

export const assertOwnerOfTable = async (
  userId: ID,
  tableId: ID,
  db: PrismaClient
) => {
  const count = await db.table.count({
    where: {
      id: tableId,
      event: {
        userId: userId,
      },
    },
  });

  assertOwnership(count);
};

export const assertOwnerOfSeat = async (
  userId: ID,
  seatId: ID,
  db: PrismaClient
) => {
  const seat = await db.seat.findUnique({
    where: {
      id: seatId,
      table: {
        event: {
          userId: userId,
        },
      },
    },
  });

  if (!seat) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return seat;
};

const assertOwnership = (count: number) => {
  if (count == 0) throw new TRPCError({ code: "UNAUTHORIZED" });
};

const assertEventIsAcceptingResponses = (
  respondStart: Date | null,
  respondEnd: Date | null
) => {
  const now = new Date();

  const beforeStart = respondStart && now < respondStart;
  const afterEnd = respondEnd && now > respondEnd;

  if (beforeStart || afterEnd) {
    throw new TRPCError({
      code: "FORBIDDEN",
    });
  }
};

export const assertEventIsAcceptingResponsesByInvitationId = async (
  invitationId: ID,
  db: PrismaClient
) => {
  const invitation = await db.invitation.findFirst({
    where: {
      id: invitationId,
    },
    select: {
      id: true,
      name: true,
      event: {
        select: {
          id: true,
          name: true,
          respondStart: true,
          respondEnd: true,
          user: true,
          notificationSettings: true,
        },
      },
    },
  });

  if (!invitation) {
    throw new TRPCError({ code: "NOT_FOUND" });
  }

  assertEventIsAcceptingResponses(
    invitation.event.respondStart,
    invitation.event.respondEnd
  );
  return invitation;
};

export const assertEventIsAcceptingResponsesByEventId = async (
  eventId: ID,
  db: PrismaClient
) => {
  const event = await db.event.findUnique({
    where: {
      id: eventId,
    },
    select: {
      respondStart: true,
      respondEnd: true,
      notificationSettings: true,
      name: true,
      user: true,
      id: true,
    },
  });

  if (!event) {
    throw new TRPCError({ code: "NOT_FOUND" });
  }

  assertEventIsAcceptingResponses(event.respondStart, event.respondEnd);

  return event;
};

export const assertImageIsValid = (contentType: string, size: number) => {
  if (!isValidImageType(contentType)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Invalid file type. Only ${STORAGE_CONFIG.ALLOWED_IMAGE_TYPES.join(", ")} are allowed.`,
    });
  }

  if (!isValidFileSize(size)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `File size exceeds ${STORAGE_CONFIG.MAX_FILE_SIZE_MB}MB limit.`,
    });
  }
};

export const assertOwnerOfImage = async (
  userId: ID,
  imageId: ID,
  db: PrismaClient
) => {
  const image = await db.eventImage.findUnique({
    where: {
      id: imageId,
      event: {
        userId: userId,
      },
    },
  });

  if (!image) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return image;
};
