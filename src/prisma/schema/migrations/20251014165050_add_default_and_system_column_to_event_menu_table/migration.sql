-- AlterTable
ALTER TABLE "public"."Menu" ADD COLUMN     "default" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "system" BOOLEAN NOT NULL DEFAULT false;
