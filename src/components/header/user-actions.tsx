import { headers } from "next/headers";
import { getSession } from "@/lib/auth/authClient";
import SignInSignUp from "./sign-in-sign-up";
import { User } from "@prisma/client";
import UserMenu from "../user/user-menu/user-menu";

export async function UserActions() {
  const { data } = await getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  const user = data?.user as User | undefined;

  return (
    <div className="flex gap-2">
      {user ? <UserMenu user={user} /> : <SignInSignUp />}
    </div>
  );
}
