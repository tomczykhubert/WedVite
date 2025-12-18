import { Prisma } from "@prisma/client";

export type TableWithRelations = Prisma.TableGetPayload<{
  include: { seats: { include: { guest: true } } };
}>;

export type SeatWithRelations = Prisma.SeatGetPayload<{
  include: { guest: true };
}>;
