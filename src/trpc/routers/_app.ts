import { createTRPCRouter } from '../init';
import { eventRouter } from './event';
import { contactRouter } from './contact';

export const appRouter = createTRPCRouter({
  event: eventRouter,
  contact: contactRouter,
});

export type AppRouter = typeof appRouter;