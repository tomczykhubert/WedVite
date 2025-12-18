import ActionButton from "@/components/base/button-link";
import { routes } from "@/lib/routes/routes";
import { getTranslations } from "next-intl/server";
import DashboardLayout from "./(index)/layout";

export default async function NotFound() {
  const t = await getTranslations("dashboard");
  return (
    <DashboardLayout>
      <div className="h-full flex items-center justify-center flex-col text-center">
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
        <div></div>
        <h1>{t("notFound")}</h1>
        <ActionButton href={routes.dashboard.index}>
          {t("goToDashboard")}
        </ActionButton>
      </div>
    </DashboardLayout>
  );
}
