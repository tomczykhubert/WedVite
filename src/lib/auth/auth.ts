import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "../prisma/prismaSingleton";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  appName: "WedVite",
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    minPasswordLength: 8,
    maxPasswordLength: 20,
  },
  user: {
    additionalFields: {
      registerType: {
        type: "string",
        required: true,
        defaultValue: "credentials",
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
  },
});
