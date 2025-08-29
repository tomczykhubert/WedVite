import SignInSignUp from "./sign-in-sign-up";
import UserMenu from "../user/user-menu/user-menu";
import { caller } from "@/trpc/server";

export async function UserActions() {
  const user = await caller.user.get();

  return (
    <div className="flex gap-2">
      {user ? <UserMenu user={user} /> : <SignInSignUp />}
    </div>
  );
}
