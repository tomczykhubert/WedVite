import { PrismaClient } from "@prisma/client";

export const isOwnerOfEvent = async (userId: string, eventId: string, db: PrismaClient) => {
  const count = await db.event.count({
    where: {
      id: eventId,
      userId: userId
    },
  })

  return count > 0;
}

export const isOwnerOfContact = async (userId: string, contactId: string, db: PrismaClient) => {
  const count = await db.eventContact.count({
    where: {
      id: contactId,
      event: {
        userId: userId
      }
    },
  })

  return count > 0;
}