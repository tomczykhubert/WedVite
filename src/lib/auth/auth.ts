import { Locale, routing } from "@/i18n/routing";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { hasLocale } from "next-intl";
import { cookies } from "next/headers";
import prisma from "../prisma/prisma";
import { sendEmailVerification } from "../resend/actions/emailVerification";

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
      // skip sending email during seeding
      if (process.env.npm_lifecycle_event === "seed") {
        return;
      }
      const cookieStore = await cookies();
      let locale =
        cookieStore.get("NEXT_LOCALE")?.value || routing.defaultLocale;
      if (!hasLocale(routing.locales, locale)) {
        locale = routing.defaultLocale;
      }

      await sendEmailVerification({
        verificationUrl: url,
        userEmail: user.email,
        locale: locale as Locale,
        recipientEmail: user.email,
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
      maxAge: 5 * 60,
    },
  },
});
