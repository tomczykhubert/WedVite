import { createTRPCRouter } from "../init";
import { contactRouter } from "./contact";
import { eventRouter } from "./event";
import { guestRouter } from "./guest";
import { invitationRouter } from "./invitation";
import { planItemRouter } from "./planItem";
import { userRouter } from "./user";

export const appRouter = createTRPCRouter({
  event: eventRouter,
  contact: contactRouter,
  planItem: planItemRouter,
  invitation: invitationRouter,
  guest: guestRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;

export type TRPCResponse<T> =
  | { success: true; data: T }
  | { success: false; error: TRPCErrorResponseConfig };

export type TRPCErrorResponseConfig = {
  key: string;
  values?: Record<string, any>;
};
