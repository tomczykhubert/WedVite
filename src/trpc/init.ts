
import prisma from "@/lib/prisma/prisma";
import { initTRPC, TRPCError } from "@trpc/server";
import SuperJSON from "superjson";
import { getSession } from "@/lib/auth/authClient";
import { User } from "@prisma/client";

// export type Context = {
//   user: User,
//   db: typeof prisma,
// };
export const createTRPCContext = async (opts: {headers: Headers }) => {
  const user = (await getSession({
        fetchOptions: {
          headers: opts.headers
        },
      }))?.data?.user as User | null

  return {
    user: user,
    db: prisma
  };
};
export type Context = Awaited<ReturnType<typeof createTRPCContext>>;
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


export const protectedProcedure = t.procedure.use(({ctx, next}) => {
   if (!ctx.user || !ctx.user.id) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user
    }
  })
});