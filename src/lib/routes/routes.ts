import ID from "@/types/id";

export const routes = {
  home: "/",
  auth: {
    signIn: "/signIn",
    signUp: "/signUp",
  },
  dashboard: {
    index: "/dashboard",
    event: {
      byId: (eventId: ID) => `/dashboard/${eventId}`,
      settings: (eventId: ID) => `/dashboard/${eventId}/settings`,
    },
  },
  account: {
    index: "/account",
    billing: "/account/billing",
    notifications: "/account/notifications",
  },
};
