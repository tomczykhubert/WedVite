"use client"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useRouter } from "@/i18n/navigation";
import { signOut } from "@/lib/auth/authClient";
import { routes } from "@/lib/routes/routes";
import { useTranslations } from "next-intl";
import { LuLogOut } from "react-icons/lu";

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
      <LuLogOut />
      <span>{t("signOut")}</span>
    </DropdownMenuItem>
  );
}