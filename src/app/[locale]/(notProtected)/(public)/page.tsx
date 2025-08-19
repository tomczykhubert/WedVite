"use client";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { routes } from "@/lib/routes/routes";
import { Button } from "@/components/ui/button";
import { LuLogOut } from "react-icons/lu";
import { signOut } from "@/lib/auth/authClient";

export default function HomePage() {
  const router = useRouter();
  const t = useTranslations();
  return (
    <div>
      <div>
        <Link href={routes.auth.signIn}>{t("user.signIn")}</Link>
        <Button
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
          <span>kutas</span>
        </Button>
      </div>
    </div>
  );
}
