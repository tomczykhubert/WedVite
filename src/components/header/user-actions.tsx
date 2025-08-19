import { headers } from "next/headers";
import { getSession } from "@/lib/auth/authClient";
import SignInSignUp from "./sign-in-sign-up";
import { User } from "@prisma/client";
import UserMenu from "../user/user-menu/user-menu";
import { getUser } from "@/lib/auth/getUser";

export async function UserActions() {
  const user = await getUser();

  return (
    <div className="flex gap-2">
      {user ? <UserMenu user={user} /> : <SignInSignUp />}
    </div>
  );
}
