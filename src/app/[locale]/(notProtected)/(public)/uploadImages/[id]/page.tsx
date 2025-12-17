import { ImageUpload } from "@/components/imagesUpload/image-upload";
import RSVPCard from "@/components/rsvp/rsvp-card";
import { caller } from "@/trpc/server";
import { getFormatter, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

export default async function UploadImagesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const t = await getTranslations("imagesUpload");
  const format = await getFormatter();

  const event = await caller.image.getEvent({ id });

  const now = new Date();
  if (!event) return notFound();

  if (event.respondStart && now < event.respondStart) {
    return (
      <RSVPCard
        message={t("notStarted", {
          date: format.dateTime(event.respondStart, {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
        })}
      />
    );
  }
  return <ImageUpload event={event} />;
}
