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
      guests: (eventId: ID) => `/dashboard/${eventId}/guests`,
    },
  },
  rsvp: {
    byId: (invitationId: ID) => `/rsvp/${invitationId}`,
  },
  account: {
    index: "/account",
    billing: "/account/billing",
    notifications: "/account/notifications",
  },
};
