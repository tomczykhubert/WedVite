import { BreadcrumbsItemType } from "@/components/dashboard/sidebar/breadcrumbs";
import { SidebarGroupType } from "@/components/dashboard/sidebar/navigation";
import { Event } from "@prisma/client";
import { CalendarDays, Images, Settings, Table, Users } from "lucide-react";
import { getTranslations } from "next-intl/server";
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
          icon: CalendarDays,
        },
        {
          link: routes.dashboard.event.guests(event.id),
          name: t("guests.guestsList"),
          icon: Users,
        },
        {
          link: routes.dashboard.event.tables(event.id),
          name: t("tables.tables"),
          icon: Table,
        },
        {
          link: routes.dashboard.event.gallery(event.id),
          name: t("gallery.gallery"),
          icon: Images,
        },
        {
          link: routes.dashboard.event.settings(event.id),
          name: t("settings"),
          icon: Settings,
        },
      ],
    },
  ];
};
