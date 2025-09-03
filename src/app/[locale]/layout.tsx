import { ThemeProvider } from "@/components/base/theme-provider";
import { routing } from "@/i18n/routing";
import { TRPCReactProvider } from "@/trpc/client";
import { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { Toaster } from "sonner";
import "../globals.css";

export const metadata: Metadata = {
  title: "WedVite",
  description: "WedVite - Your Wedding Planning Companion",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          disableTransitionOnChange
        >
          <NextIntlClientProvider>
            <TRPCReactProvider>
              <Toaster duration={5000} />
              {children}
            </TRPCReactProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
