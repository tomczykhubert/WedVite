import { z } from 'zod';
import { createTRPCRouter } from '../init';
import { eventRouter } from './event';

export const appRouter = createTRPCRouter({
  event: eventRouter
});

export type AppRouter = typeof appRouter;