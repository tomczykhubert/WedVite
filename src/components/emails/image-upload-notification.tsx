import { Locale, routing } from "@/i18n/routing";
import { Button, Hr, Section, Text } from "@react-email/components";
import { getTranslations } from "next-intl/server";
import EmailLayout from "./email-layout";

const ImageUploadNotification = async (
  eventName: string,
  uploaderName: string,
  imageCount: number,
  url: string,
  locale: Locale = routing.defaultLocale
) => {
  const t = await getTranslations({
    locale: locale,
    namespace: "emails.imageUpload",
  });
  return (
    <EmailLayout locale={locale} title={t("title")}>
      <Section>
        <Text className="text-[16px] text-foreground mb-[24px] mt-0 leading-[24px]">
          {t("greeting")}
        </Text>

        <Text className="text-[14px] text-secondary-foreground mb-[16px] mt-0">
          {t("message", { uploaderName, eventName, count: imageCount })}
        </Text>

        <Section className="text-center mb-[32px] mt-[32px]">
          <Button
            href={url}
            className="bg-primary text-primary-foreground px-[32px] py-[16px] rounded-[8px] text-[16px] font-semibold no-underline box-border inline-block"
          >
            {t("buttonText")}
          </Button>
        </Section>

        <Hr className="border-border my-[32px]" />

        <Text className="text-[12px] text-muted-foreground mb-[8px] mt-0">
          {t("footer")}
        </Text>
      </Section>
    </EmailLayout>
  );
};

export default ImageUploadNotification;
