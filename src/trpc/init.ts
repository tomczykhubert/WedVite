import { initTRPC, TRPCError } from "@trpc/server";
import SuperJSON from "superjson";
import { Context } from "./context";

const t = initTRPC.context<Context>().create({
  transformer: SuperJSON,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        code: error.code,
        httpStatus: shape.data.httpStatus,
        path: shape.data.path,
      },
    };
  },
});

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure.use((opts) => {
  opts.ctx;
  return opts.next();
});

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});
