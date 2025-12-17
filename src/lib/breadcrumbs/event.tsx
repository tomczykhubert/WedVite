import { BreadcrumbsItemType } from "@/components/dashboard/sidebar/breadcrumbs";
import { SidebarGroupType } from "@/components/dashboard/sidebar/navigation";
import { Event } from "@prisma/client";
import { getTranslations } from "next-intl/server";
import { FaCalendarDay, FaGear, FaImages, FaUsers } from "react-icons/fa6";
import { routes } from "../routes/routes";
import { buildBaseBreadcrumbs } from "./base";

export const buildEventBreadcrumbs = async (
  event: Event,
  addLink: boolean
): Promise<BreadcrumbsItemType[]> => {
  return [
    ...(await buildBaseBreadcrumbs()),
    {
      name: event.name,
      link: addLink ? routes.dashboard.event.byId(event.id) : undefined,
    },
  ];
};

export const buildEventSidebarItems = async (
  event: Event
): Promise<SidebarGroupType[]> => {
  const t = await getTranslations("dashboard.event");
  return [
    {
      name: event.name,
      items: [
        {
          link: routes.dashboard.event.byId(event.id),
          name: t("overview"),
          icon: FaCalendarDay,
        },
        {
          link: routes.dashboard.event.settings(event.id),
          name: t("settings"),
          icon: FaGear,
        },
        {
          link: routes.dashboard.event.guests(event.id),
          name: t("guests.guestsList"),
          icon: FaUsers,
        },
        {
          link: routes.dashboard.event.gallery(event.id),
          name: t("gallery.gallery"),
          icon: FaImages,
        },
      ],
    },
  ];
};
