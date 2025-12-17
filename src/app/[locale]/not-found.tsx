import ActionButton from "@/components/base/button-link";
import { routes } from "@/lib/routes/routes";
import { getTranslations } from "next-intl/server";
import { Fa0, Fa4 } from "react-icons/fa6";

export default async function NotFound() {
  const t = await getTranslations("dashboard");
  return (
    <div className="min-h-screen flex items-center justify-center flex-col text-center gap-4">
      <div>
        <Fa4 className="text-red-500 inline-block" size={"200px"} />
        <Fa0 className="text-red-500 inline-block" size={"200px"} />
        <Fa4 className="text-red-500 inline-block" size={"200px"} />
      </div>
      <h1>{t("notFound")}</h1>
      <ActionButton href={routes.home}>{t("goToHomepage")}</ActionButton>
    </div>
  );
}
