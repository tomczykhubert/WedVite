import ActionButton from "@/components/base/button-link";
import { routes } from "@/lib/routes/routes";
import { getTranslations } from "next-intl/server";

export default async function NotFound() {
  const t = await getTranslations("dashboard");
  return (
    <div className="min-h-screen flex items-center justify-center flex-col text-center gap-4">
      <div>
        <span className="text-red-500 inline-block text-[200px] font-bold">
          4
        </span>
        <span className="text-red-500 inline-block text-[200px] font-bold">
          0
        </span>
        <span className="text-red-500 inline-block text-[200px] font-bold">
          4
        </span>
      </div>
      <h1>{t("notFound")}</h1>
      <ActionButton href={routes.home}>{t("goToHomepage")}</ActionButton>
    </div>
  );
}
