import { createTRPCRouter } from '../init';
import { eventRouter } from './event';
import { contactRouter } from './contact';
import { userRouter } from './user';

export const appRouter = createTRPCRouter({
  event: eventRouter,
  contact: contactRouter,
  user: userRouter
});

export type AppRouter = typeof appRouter;