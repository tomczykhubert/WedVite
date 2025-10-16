-- AlterTable
ALTER TABLE "public"."guest" ADD COLUMN     "menuId" TEXT;

-- CreateTable
CREATE TABLE "public"."Menu" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,

    CONSTRAINT "Menu_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."guest" ADD CONSTRAINT "guest_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "public"."Menu"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Menu" ADD CONSTRAINT "Menu_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
