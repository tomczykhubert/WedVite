import { Prisma } from "@prisma/client";

export type TableWithRelations = Prisma.TableGetPayload<{
  include: { seats: { include: { guest: { include: { invitation: true } } } } };
}>;

export type SeatWithRelations = Prisma.SeatGetPayload<{
  include: { guest: { include: { invitation: true } } };
}>;
