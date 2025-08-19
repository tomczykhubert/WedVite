import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@prisma/client";
import { useTranslations } from "next-intl";
import React from "react";

export default function UserAvatar({ user }: { user: User }) {
  const t = useTranslations("user");
  return (
    <Avatar className="h-8 w-8">
      <AvatarImage src={user.image || ""} alt={user.name || t("avatar")} />
      <AvatarFallback>{user.name.charAt(0) || "U"}</AvatarFallback>
    </Avatar>
  );
}
