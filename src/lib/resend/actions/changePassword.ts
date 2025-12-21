import ChangePassword from "@/components/emails/change-password";
import { Locale } from "@/i18n/routing";
import { routes } from "@/lib/routes/routes";
import { getFullUrl } from "@/lib/routes/utils";
import { getLocale } from "next-intl/server";
import { BaseActionProps, sendEmail } from "../sendEmail";

type ChangePasswordData = {
  token: string;
} & BaseActionProps;

export async function sendChangePasswordEmail({
  token,
  ...baseEmailProps
}: ChangePasswordData) {
  const locale = await getLocale();
  const resetUrl = getFullUrl(
    routes.auth.resetPassword(token),
    locale as Locale
  );

  await sendEmail({
    ...baseEmailProps,
    subject: {
      namespace: "emails.changePassword",
      key: "subject",
    },
    react: await ChangePassword(
      resetUrl,
      baseEmailProps.recipientEmail,
      locale as Locale
    ),
  });
}
