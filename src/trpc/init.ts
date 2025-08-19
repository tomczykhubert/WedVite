import { getUser } from "@/lib/auth/getUser";
import { initTRPC, TRPCError } from "@trpc/server";
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";

export const createTRPCContext = async () => {
  return {
    user: await getUser(),
  };
};

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;
const t = initTRPC.context<Context>().create();

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure.use((opts) => {
  opts.ctx;
  return opts.next();
});

export const protectedProcedure = t.procedure.use(({ctx, next}) => {
   if (!ctx.user || !ctx.user.id) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      user: ctx.user
    }
  })
});