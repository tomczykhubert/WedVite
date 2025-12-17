import { BreadcrumbsItemType } from "@/components/dashboard/sidebar/breadcrumbs";
import { routes } from "@/lib/routes/routes";
import { getTranslations } from "next-intl/server";
import { FaHouse } from "react-icons/fa6";

export const buildBaseBreadcrumbs = async (): Promise<
  BreadcrumbsItemType[]
> => {
  const t = await getTranslations("dashboard");
  return [
    {
      icon: <FaHouse />,
      link: routes.dashboard.index,
    },
    {
      link: routes.dashboard.index,
      name: t("events"),
    },
  ];
};
