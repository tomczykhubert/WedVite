import { Locale, routing } from "@/i18n/routing";
import { Button, Hr, Section, Text } from "@react-email/components";
import { getTranslations } from "next-intl/server";
import EmailLayout from "./email-layout";

const ChangePassword = async (
  resetUrl: string,
  userEmail: string,
  locale: Locale = routing.defaultLocale
) => {
  const t = await getTranslations({
    locale: locale,
    namespace: "emails.changePassword",
  });
  return (
    <EmailLayout locale={locale} title={t("title")}>
      <Section>
        <Text className="text-[16px] text-foreground mb-[24px] mt-0 leading-[24px]">
          {t("message")}
        </Text>

        <Text className="text-[14px] text-secondary-foreground mb-[32px] mt-0">
          Email: <strong>{userEmail}</strong>
        </Text>

        <Section className="text-center mb-[32px]">
          <Button
            href={resetUrl}
            className="bg-primary text-primary-foreground px-[32px] py-[16px] rounded-[8px] text-[16px] font-semibold no-underline box-border inline-block"
          >
            {t("buttonText")}
          </Button>
        </Section>

        <Text className="text-[14px] text-secondary-foreground mb-[24px] mt-0 leading-[20px]">
          {t("buttonDoesntWork")}
        </Text>

        <Text className="text-[14px] text-primary mb-[32px] mt-0 break-all">
          {resetUrl}
        </Text>

        <Hr className="border-border my-[32px]" />

        <Text className="text-[12px] text-muted-foreground mb-[8px] mt-0">
          {t("urlWillExpire")}
        </Text>

        <Text className="text-[12px] text-muted-foreground mb-[24px] mt-0">
          {t("ignoreEmail")}
        </Text>
      </Section>
    </EmailLayout>
  );
};

export default ChangePassword;
