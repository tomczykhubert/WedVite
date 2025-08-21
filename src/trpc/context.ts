import prisma from "@/lib/prisma/prisma";
import { getUser } from "@/lib/auth/getUser";

export const createContext = async () => {
  const user = await getUser();

  return {
    db: prisma,
    user,
  };
};
export type Context = Awaited<ReturnType<typeof createContext>>;
