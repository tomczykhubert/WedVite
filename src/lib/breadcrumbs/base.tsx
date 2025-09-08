import { BreadcrumbsItemType } from "@/components/dashboard/sidebar/breadcrumbs";
import { routes } from "@/lib/routes/routes";
import { getTranslations } from "next-intl/server";
import { FaHome } from "react-icons/fa";

export const buildBaseBreadcrumbs = async (): Promise<
  BreadcrumbsItemType[]
> => {
  const t = await getTranslations("dashboard");
  return [
    {
      icon: <FaHome />,
      link: routes.dashboard.index,
    },
    {
      link: routes.dashboard.index,
      name: t("events"),
    },
  ];
};
