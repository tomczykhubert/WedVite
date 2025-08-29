import ID from "@/types/id";

export const apiRoutes = {
  auth: {
    signIn: {
      email: "/api/auth/sign-in/email",
      social: "/api/auth/sign-in/social",
    },
    signUp: {
      email: "/api/auth/sign-up/email",
      social: "/api/auth/sign-up/social",
    },
    verifyEmail: "/api/auth/verify-email",
    callback: {
      google: "/api/auth/callback/google",
    },
    getSession: "/api/auth/get-session",
    updateUser: {
      update: (userId: ID) => `/api/auth/update-user/${userId}`,
    },
  },
  emails: {
    test: "/api/emails/test"
  }
};
