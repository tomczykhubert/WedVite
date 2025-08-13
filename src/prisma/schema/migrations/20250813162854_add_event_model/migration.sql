-- CreateEnum
CREATE TYPE "public"."EventContactType" AS ENUM ('BRIDE', 'GROOM', 'MAID_OF_HONOR', 'BEST_MAN');

-- AlterTable
ALTER TABLE "public"."user" ADD COLUMN     "activeEventId" TEXT;

-- CreateTable
CREATE TABLE "public"."event" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "respondDeadline" TIMESTAMP(3) NOT NULL,
    "startAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."event_plan_item" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3),
    "details" TEXT,
    "addressLine1" TEXT NOT NULL,
    "addressLine2" TEXT,
    "city" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "region" TEXT,
    "country" TEXT,
    "order" INTEGER NOT NULL,
    "eventId" TEXT NOT NULL,

    CONSTRAINT "event_plan_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."event_contact" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "type" "public"."EventContactType",
    "eventId" TEXT NOT NULL,

    CONSTRAINT "event_contact_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."event" ADD CONSTRAINT "event_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."event_plan_item" ADD CONSTRAINT "event_plan_item_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."event_contact" ADD CONSTRAINT "event_contact_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
