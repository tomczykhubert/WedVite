"use client";
import { Link } from "@/i18n/navigation";
import { routes } from "@/lib/routes/routes";
import { useTranslations } from "next-intl";

export default function HomePage() {
  const t = useTranslations();
  return (
    <div>
      <Link href={routes.auth.signIn}>{t("user.signIn")}</Link>
    </div>
  );
}
