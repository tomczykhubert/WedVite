import RSVPNotification from "@/components/emails/rsvp-notification";
import { Locale } from "@/i18n/routing";
import { routes } from "@/lib/routes/routes";
import { getFullUrl } from "@/lib/routes/utils";
import ID from "@/types/id";
import { AttendanceStatus } from "@prisma/client";
import { BaseActionProps, sendEmail } from "../sendEmail";

type RSVPNotificationData = {
  eventId: ID;
  eventName: string;
  invitationName: string;
  guests: Array<{ name: string; status: AttendanceStatus }>;
} & BaseActionProps;

export async function sendRSVPNotification({
  eventId,
  eventName,
  invitationName,
  guests,
  locale,
  ...baseEmailProps
}: RSVPNotificationData) {
  const url = getFullUrl(routes.dashboard.event.guests(eventId));

  await sendEmail({
    ...baseEmailProps,
    subject: {
      key: "subject",
      replacements: { eventName },
      namespace: "emails.rsvp",
    },
    react: await RSVPNotification(
      eventName,
      invitationName,
      guests,
      url,
      locale as Locale
    ),
  });
}
