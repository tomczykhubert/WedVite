/*
  Warnings:

  - You are about to drop the column `respondDeadline` on the `event` table. All the data in the column will be lost.
  - You are about to drop the column `startAt` on the `event` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."event" DROP COLUMN "respondDeadline",
DROP COLUMN "startAt",
ADD COLUMN     "respondEnd" TIMESTAMP(3),
ADD COLUMN     "respondStart" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "public"."notification_settings" (
    "id" TEXT NOT NULL,
    "onImageUpload" BOOLEAN NOT NULL,
    "onAttendanceRespond" BOOLEAN NOT NULL,
    "eventId" TEXT NOT NULL,

    CONSTRAINT "notification_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "notification_settings_eventId_key" ON "public"."notification_settings"("eventId");

-- AddForeignKey
ALTER TABLE "public"."notification_settings" ADD CONSTRAINT "notification_settings_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
