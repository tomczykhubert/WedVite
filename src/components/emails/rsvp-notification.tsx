import { Locale, routing } from "@/i18n/routing";
import { AttendanceStatus, GuestType } from "@prisma/client";
import { Button, Hr, Section, Text } from "@react-email/components";
import { getTranslations } from "next-intl/server";
import EmailLayout from "./email-layout";

interface GuestResponse {
  name: string;
  status: AttendanceStatus;
}

const RSVPNotification = async (
  eventName: string,
  invitationName: string,
  guests: GuestResponse[],
  url: string,
  locale: Locale = routing.defaultLocale
) => {
  const guestT = await getTranslations({
    locale: locale,
    namespace: "dashboard.event.guests",
  });
  const t = await getTranslations({
    locale: locale,
    namespace: "emails.rsvp",
  });

  return (
    <EmailLayout locale={locale} title={t("title")}>
      <Section>
        <Text className="text-[16px] text-foreground mb-[24px] mt-0 leading-[24px]">
          {t("greeting")}
        </Text>

        <Text className="text-[14px] text-secondary-foreground mb-[16px] mt-0">
          {t("message", { invitationName, eventName })}
        </Text>

        <Text className="text-[12px] text-secondary-foreground mb-[16px] mt-0">
          <strong>{t("guestDetails")}</strong>
        </Text>
        {guests.map((guest, index) => (
          <Text
            key={index}
            className="text-[12px] text-secondary-foreground mb-[4px] mt-0 ml-[16px]"
          >
            • {guest.name || guestT(`guestTypes.${GuestType.COMPANION}`)}:{" "}
            {guestT(`status.${guest.status}`)}
          </Text>
        ))}

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

export default RSVPNotification;
