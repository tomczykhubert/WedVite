-- CreateEnum
CREATE TYPE "public"."TableShape" AS ENUM ('ROUND', 'RECTANGULAR');

-- CreateTable
CREATE TABLE "public"."table" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "shape" "public"."TableShape" NOT NULL,
    "capacity" INTEGER NOT NULL,
    "rows" INTEGER,
    "columns" INTEGER,
    "positionX" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "positionY" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "table_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."seat" (
    "id" TEXT NOT NULL,
    "tableId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "guestId" TEXT,

    CONSTRAINT "seat_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "table_eventId_idx" ON "public"."table"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "seat_guestId_key" ON "public"."seat"("guestId");

-- CreateIndex
CREATE INDEX "seat_tableId_idx" ON "public"."seat"("tableId");

-- CreateIndex
CREATE INDEX "seat_guestId_idx" ON "public"."seat"("guestId");

-- AddForeignKey
ALTER TABLE "public"."table" ADD CONSTRAINT "table_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."seat" ADD CONSTRAINT "seat_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "public"."table"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."seat" ADD CONSTRAINT "seat_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "public"."guest"("id") ON DELETE SET NULL ON UPDATE CASCADE;
