import { createTRPCRouter } from '../init';
import { eventRouter } from './event';
import { contactRouter } from './contact';
import { userRouter } from './user';
import { planItemRouter } from './planItem';

export const appRouter = createTRPCRouter({
  event: eventRouter,
  contact: contactRouter,
  planItem: planItemRouter,
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