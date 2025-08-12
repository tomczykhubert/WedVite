"use client";

import { useSession } from "@/lib/auth/authClient";
import Image from "next/image";

export default function Public() {
  const session = useSession();
  return (
    <>
      <Image
                className="dark:invert"
                src="/api/uploads/images/next.svg"
                alt="Next.js logo"
                width={180}
                height={38}
                priority
        />
      <h1>Id: {session?.data?.user.id}</h1>
      <h1>Email: {session?.data?.user.email}</h1>
      <div>test super super super</div>
    </>
  );
}
