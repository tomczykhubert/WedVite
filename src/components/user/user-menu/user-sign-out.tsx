"use client";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useRouter } from "@/i18n/navigation";
import { signOut } from "@/lib/auth/authClient";
import { routes } from "@/lib/routes/routes";
import { LogOut } from "lucide-react";
import { useTranslations } from "next-intl";

export default function UserSignOut() {
  const router = useRouter();
  const t = useTranslations("user");
  return (
    <DropdownMenuItem
      className="flex items-center gap-2"
      onClick={async () => {
        await signOut({
          fetchOptions: {
            onSuccess: () => {
              router.push(routes.auth.signIn);
              router.refresh();
            },
          },
        });
      }}
    >
      <LogOut />
      <span>{t("signOut")}</span>
    </DropdownMenuItem>
  );
}
