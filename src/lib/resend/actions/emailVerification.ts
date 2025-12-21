import EmailVerification from "@/components/emails/email-verification";
import { Locale } from "@/i18n/routing";
import { BaseActionProps, sendEmail } from "../sendEmail";

type EmailVerificationData = {
  verificationUrl: string;
  userEmail: string;
} & BaseActionProps;

export async function sendEmailVerification({
  verificationUrl,
  userEmail,
  locale,
  ...baseEmailProps
}: EmailVerificationData) {
  await sendEmail({
    ...baseEmailProps,
    subject: {
      namespace: "emails.verification",
      key: "subject",
    },
    react: await EmailVerification(
      verificationUrl,
      userEmail,
      locale as Locale
    ),
  });
}
