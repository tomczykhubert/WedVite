import ID from "@/types/id";

export const apiRoutes = {
  auth: {
    signIn: {
      email: "/api/auth/sign-in/email",
    },
    signUp: {
      email: "/api/auth/sign-up/email",
    },
    getSession: "/api/auth/get-session",
    updateUser: {
      update: (userId: ID) => `/api/auth/update-user/${userId}`,
    },
  },
  users: {
    getUser: (userId: ID) => `/api/users/${userId}`,
  },
};
