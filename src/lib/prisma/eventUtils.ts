import { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";

export const assertOwnerOfEvent = async (userId: string, eventId: string, db: PrismaClient) => {
  const count = await db.event.count({
    where: {
      id: eventId,
      userId: userId
    },
  })

  assertOwnership(count);
}

export const assertOwnerOfContact = async (userId: string, contactId: string, db: PrismaClient) => {
  const count = await db.eventContact.count({
    where: {
      id: contactId,
      event: {
        userId: userId
      }
    },
  })

  assertOwnership(count);
}

export const assertOwnerOfPlanItem = async (userId: string, planItemId: string, db: PrismaClient) => {
  const count = await db.eventPlanItem.count({
    where: {
      id: planItemId,
      event: {
        userId: userId
      }
    },
  })

  assertOwnership(count);
}

const assertOwnership = (count: number) => {
  if (count == 0) throw new TRPCError({ code: "UNAUTHORIZED" });
};