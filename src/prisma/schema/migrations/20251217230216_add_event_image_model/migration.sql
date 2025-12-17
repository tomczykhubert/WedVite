-- CreateTable
CREATE TABLE "public"."event_image" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "extension" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "uploaderName" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_image_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."event_image" ADD CONSTRAINT "event_image_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
