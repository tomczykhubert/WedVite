-- CreateEnum
CREATE TYPE "public"."Gender" AS ENUM ('MALE', 'FEMALE', 'UNSPECIFIED');

-- CreateEnum
CREATE TYPE "public"."GuestType" AS ENUM ('ADULT', 'CHILD', 'COMPANION');

-- CreateEnum
CREATE TYPE "public"."InvitationStatus" AS ENUM ('CREATED', 'DELIVERED', 'ANSWERED');

-- CreateEnum
CREATE TYPE "public"."AttendanceStatus" AS ENUM ('PENDING', 'DECLINED', 'CONFIRMED');

-- CreateTable
CREATE TABLE "public"."invitation" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "public"."InvitationStatus" NOT NULL,
    "responseDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "eventId" TEXT NOT NULL,

    CONSTRAINT "invitation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."guest" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "public"."AttendanceStatus" NOT NULL,
    "gender" "public"."Gender" NOT NULL,
    "type" "public"."GuestType" NOT NULL,
    "respondedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "invitationId" TEXT NOT NULL,

    CONSTRAINT "guest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."invitation" ADD CONSTRAINT "invitation_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."guest" ADD CONSTRAINT "guest_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "public"."invitation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
