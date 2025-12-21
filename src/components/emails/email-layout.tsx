import { Locale, routing } from "@/i18n/routing";
import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

const emailTheme = {
  theme: {
    extend: {
      colors: {
        background: "#ffffff",
        foreground: "#262626",
        primary: "#f59e0b",
        "primary-foreground": "#fafafa",
        secondary: "#f5f5f4",
        "secondary-foreground": "#44403c",
        muted: "#f5f5f4",
        "muted-foreground": "#78716c",
        accent: "#fef9f3",
        "accent-foreground": "#44403c",
        destructive: "#ef4444",
        border: "#e7e5e4",
        ring: "#f59e0b",
      },
    },
  },
};

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
      <Tailwind config={emailTheme}>
        <Head />
        <Body className="bg-muted font-sans py-[40px]">
          <Container className="bg-background rounded-[8px] shadow-sm max-w-[600px] mx-auto p-[40px]">
            <Section>
              <Text className="text-[24px] font-bold text-foreground mb-[24px] mt-0">
                {title}
              </Text>
            </Section>
            {children}
            <Hr className="border-border my-[32px]" />

            <Section>
              <Text className="text-[12px] text-muted-foreground m-0 text-center">
                © 2025 WedVite. All rights reserved.
              </Text>
              <Text className="text-[12px] text-muted-foreground m-0 text-center">
                123 Business Street, Warsaw, Poland
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
