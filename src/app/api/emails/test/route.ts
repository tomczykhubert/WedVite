import EmailVerification from "@/components/emails/email-verification";
import { Locale, routing } from "@/i18n/routing";
import resend from "@/lib/resend/resend";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";

export async function POST() {
	const t = await getTranslations("emails")
	const cookieStore = await cookies();
	let locale = cookieStore.get('NEXT_LOCALE')?.value || routing.defaultLocale
	if (!hasLocale(routing.locales, locale)) {
		locale = routing.defaultLocale
	}

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM as string,
      to: "tomczyk.hubert22@gmail.com",
      subject: t("verification.subject"),
      react: EmailVerification("localhost:3000", "tomczyk.hubert22@gmail.com", locale as Locale),
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
