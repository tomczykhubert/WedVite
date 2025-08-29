import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "../prisma/prisma";
import { nextCookies } from "better-auth/next-js";
import EmailVerification from "@/components/emails/email-verification";
import { hasLocale } from "next-intl";
import resend from "../resend/resend";
import { cookies } from "next/headers";
import { Locale, routing } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";

export const auth = betterAuth({
  appName: "WedVite",
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    minPasswordLength: 6,
    maxPasswordLength: 30,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      const cookieStore = await cookies();
      let locale =
        cookieStore.get("NEXT_LOCALE")?.value || routing.defaultLocale;
      if (!hasLocale(routing.locales, locale)) {
        locale = routing.defaultLocale;
      }
      const t = await getTranslations({ locale: locale, namespace: "emails" });
      await resend.emails.send({
        from: process.env.RESEND_FROM as string,
        to: user.email,
        subject: t("verification.subject"),
        react: EmailVerification(url, user.email, locale as Locale),
      });
    },
  },
  user: {
    additionalFields: {
      registerType: {
        type: "string",
        required: true,
        defaultValue: "credentials",
      },
      preferredLocale: {
        type: "string",
        required: true,
        defaultValue: routing.defaultLocale,
      },
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      mapProfileToUser: (profile) => {
        return {
          firstName: profile.given_name,
          lastName: profile.family_name,
          registerType: "google",
        };
      },
    },
  },
  plugins: [nextCookies()],
  session: {
    expiresIn: 24 * 60 * 60, // 24 hours
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60
    }
  },
});
