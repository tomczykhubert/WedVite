"use client";

import { signOut, useSession } from "@/lib/auth/authClient";
import { routes } from "@/lib/routes/routes";
import { useRouter } from "next/navigation";

export default function Protected() {
  const session = useSession();
  const router = useRouter();

  const signoutt = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push(routes.auth.signIn);
        },
      },
    });
  };
  return (
    <>
      <h1>Id: {session?.data?.user.id}</h1>
      <h1>Email: {session?.data?.user.email}</h1>
      <button onClick={signoutt}>Click</button>
    </>
  );
}
