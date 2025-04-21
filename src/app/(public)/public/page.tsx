"use client";

import { useSession } from "@/lib/auth/authClient";

export default function Public() {
  const session = useSession();
  return (
    <>
      <h1>Id: {session?.data?.user.id}</h1>
      <h1>Email: {session?.data?.user.email}</h1>
      <div>test super super super</div>
    </>
  );
}
