/*
  Warnings:

  - You are about to drop the column `activeEventId` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."user" DROP COLUMN "activeEventId",
ADD COLUMN     "preferredLocale" TEXT NOT NULL DEFAULT 'pl';
