import { BreadcrumbsItemType } from "@/components/dashboard/sidebar/breadcrumbs";
import { routes } from "@/lib/routes/routes";
import { Home } from "lucide-react";
import { getTranslations } from "next-intl/server";

export const buildBaseBreadcrumbs = async (): Promise<
  BreadcrumbsItemType[]
> => {
  const t = await getTranslations("dashboard");
  return [
    {
      icon: <Home />,
      link: routes.dashboard.index,
    },
    {
      link: routes.dashboard.index,
      name: t("events"),
    },
  ];
};
