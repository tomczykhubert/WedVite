import { Locale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { ReactElement } from "react";
import resend from "./resend";

const RESEND_FROM = process.env.RESEND_FROM;

function getResendFrom() {
  if (!RESEND_FROM) {
    throw new Error("RESEND_FROM environment variable is required");
  }
  return RESEND_FROM;
}

export type BaseEmailProps = {
  recipientEmail: string;
};

export type BaseActionProps = BaseEmailProps & {
  locale: Locale;
};

type EmailSubject = {
  key: string;
  namespace?: string;
  replacements?: Record<string, string>;
};

type SendEmailProps = BaseEmailProps & {
  subject: EmailSubject;
  react: ReactElement;
};

export async function sendEmail({
  recipientEmail,
  react,
  subject,
}: SendEmailProps) {
  const t = await getTranslations(subject.namespace);
  try {
    await resend.emails.send({
      from: getResendFrom(),
      to: recipientEmail,
      subject: t(subject.key, { ...subject.replacements }),
      react,
    });
  } catch (error) {
    console.error("Failed to send email:", error);
  }
}
