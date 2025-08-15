import { Locale, routing } from "@/i18n/routing";
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Tailwind,
  Hr,
} from "@react-email/components";

export default function EmailLayout({
  children,
  locale = routing.defaultLocale,
  title,
}: {
  children: React.ReactNode;
  locale: Locale;
  title: string;
}) {
  return (
    <Html lang={locale} dir="ltr">
      <Tailwind>
        <Head />
        <Body className="bg-gray-100 font-sans py-[40px]">
          <Container className="bg-white rounded-[8px] shadow-sm max-w-[600px] mx-auto p-[40px]">
            <Section>
              <Text className="text-[24px] font-bold text-gray-900 mb-[24px] mt-0">
                {title}
              </Text>
            </Section>
						{children}
            <Hr className="border-gray-200 my-[32px]" />

            <Section>
              <Text className="text-[12px] text-gray-400 m-0 text-center">
                © 2025 WedVite. All rights reserved.
              </Text>
              <Text className="text-[12px] text-gray-400 m-0 text-center">
                123 Business Street, Warsaw, Poland
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
