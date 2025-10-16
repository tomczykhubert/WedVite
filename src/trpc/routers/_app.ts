import { createTRPCRouter } from "../init";
import { contactRouter } from "./contact";
import { eventRouter } from "./event";
import { eventMenuRouter } from "./eventMenu";
import { guestRouter } from "./guest";
import { invitationRouter } from "./invitation";
import { planItemRouter } from "./planItem";
import { rsvpRouter } from "./rsvp";
import { userRouter } from "./user";

export const appRouter = createTRPCRouter({
  event: eventRouter,
  eventMenu: eventMenuRouter,
  contact: contactRouter,
  planItem: planItemRouter,
  invitation: invitationRouter,
  guest: guestRouter,
  user: userRouter,
  rsvp: rsvpRouter,
});

export type AppRouter = typeof appRouter;

export type TRPCResponse<T> =
  | { success: true; data: T }
  | { success: false; error: TRPCErrorResponseConfig };

export type TRPCErrorResponseConfig = {
  key: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  values?: Record<string, any>;
};
