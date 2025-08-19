import { headers } from "next/headers"
import { getSession } from "./authClient"
import { User } from "@prisma/client"

export const getUser = async (): Promise<User | null> => {
    return (await getSession({
      fetchOptions: {
        headers: await headers(),
      },
    }))?.data?.user as User | null
  }