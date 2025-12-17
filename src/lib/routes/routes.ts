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
      gallery: (eventId: ID) => `/dashboard/${eventId}/gallery`,
    },
  },
  rsvp: {
    byId: (invitationId: ID) => `/rsvp/${invitationId}`,
  },
  uploadImages: {
    byId: (eventId: ID) => `/uploadImages/${eventId}`,
  },
  account: {
    index: "/account",
    billing: "/account/billing",
    notifications: "/account/notifications",
  },
};
