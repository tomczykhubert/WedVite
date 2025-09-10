import NotFound from "@/app/[locale]/(protected)/dashboard/not-found";
import RSVPCard from "@/components/rsvp/rsvp-card";
import RSVPForm from "@/components/rsvp/rsvp-form";
import { caller } from "@/trpc/server";
import { getFormatter, getTranslations } from "next-intl/server";

export default async function RSVPPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const t = await getTranslations("rsvp");
  const format = await getFormatter();

  const invitation = await caller.rsvp.getInvitation({ id });

  const now = new Date();
  if (!invitation) return NotFound();
  if (invitation.event.respondEnd && now > invitation.event.respondEnd) {
    return <RSVPCard message={t("expired")} />;
  }

  if (invitation.event.respondStart && now < invitation.event.respondStart) {
    return (
      <RSVPCard
        message={t("notStarted", {
          date: format.dateTime(invitation.event.respondStart, {
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
  return <RSVPForm invitation={invitation} />;
}
