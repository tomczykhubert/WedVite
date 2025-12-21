import ImageUploadNotification from "@/components/emails/image-upload-notification";
import { Locale } from "@/i18n/routing";
import { routes } from "@/lib/routes/routes";
import { getFullUrl } from "@/lib/routes/utils";
import { BaseActionProps, sendEmail } from "../sendEmail";

type ImageUploadNotificationData = {
  eventId: string;
  eventName: string;
  uploaderName: string;
  imageCount: number;
} & BaseActionProps;

export async function sendImageUploadNotification({
  eventId,
  eventName,
  uploaderName,
  imageCount,
  locale,
  ...baseEmailProps
}: ImageUploadNotificationData) {
  const url = getFullUrl(routes.dashboard.event.gallery(eventId));
  await sendEmail({
    ...baseEmailProps,
    subject: {
      key: "subject",
      replacements: { eventName },
      namespace: "emails.imageUpload",
    },
    react: await ImageUploadNotification(
      eventName,
      uploaderName,
      imageCount,
      url,
      locale as Locale
    ),
  });
}
