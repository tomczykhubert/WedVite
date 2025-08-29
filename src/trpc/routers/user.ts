import { baseProcedure, createTRPCRouter } from "../init";

export const userRouter = createTRPCRouter({
  get: baseProcedure.query(({ ctx }) => {
    return ctx.user;
  }),
});