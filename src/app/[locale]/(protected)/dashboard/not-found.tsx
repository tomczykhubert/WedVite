import ActionButton from "@/components/base/button-link";
import { routes } from "@/lib/routes/routes";
import { getTranslations } from "next-intl/server";
import { TbError404 } from "react-icons/tb";
import DashboardLayout from "./(index)/layout";

export default async function NotFound() {
  const t = await getTranslations("dashboard");
  return (
    <DashboardLayout>
      <div className="h-full flex items-center justify-center flex-col text-center">
        <TbError404 className="" size={"200px"} />
        <h1>{t("notFound")}</h1>
        <ActionButton href={routes.dashboard.index}>
          {t("goToDashboard")}
        </ActionButton>
      </div>
    </DashboardLayout>
  );
}
