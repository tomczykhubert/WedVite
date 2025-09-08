import { Locale, routing } from "@/i18n/routing";
import { Button, Hr, Section, Text } from "@react-email/components";
import { getTranslations } from "next-intl/server";
import EmailLayout from "./email-layout";

const EmailVerification = async (
  verificationUrl: string,
  userEmail: string,
  locale: Locale = routing.defaultLocale
) => {
  const t = await getTranslations({
    locale: locale,
    namespace: "emails.verification",
  });
  return (
    <EmailLayout locale={locale} title={t("title")}>
      <Section>
        <Text className="text-[16px] text-gray-700 mb-[24px] mt-0 leading-[24px]">
          {t("thanksForSigningUp")}
        </Text>

        <Text className="text-[14px] text-gray-600 mb-[32px] mt-0">
          Email: <strong>{userEmail}</strong>
        </Text>

        <Section className="text-center mb-[32px]">
          <Button
            href={verificationUrl}
            className="bg-blue-600 text-white px-[32px] py-[16px] rounded-[8px] text-[16px] font-semibold no-underline box-border inline-block"
          >
            {t("buttonText")}
          </Button>
        </Section>

        <Text className="text-[14px] text-gray-600 mb-[24px] mt-0 leading-[20px]">
          {t("buttonDoesntWork")}
        </Text>

        <Text className="text-[14px] text-blue-600 mb-[32px] mt-0 break-all">
          {verificationUrl}
        </Text>

        <Hr className="border-gray-200 my-[32px]" />

        <Text className="text-[12px] text-gray-500 mb-[8px] mt-0">
          {t("urlWillExpire")}
        </Text>

        <Text className="text-[12px] text-gray-500 mb-[24px] mt-0">
          {t("ignoreEmail")}
        </Text>
      </Section>
    </EmailLayout>
  );
};

export default EmailVerification;
