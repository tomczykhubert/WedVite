import { BreadcrumbsItemType } from "@/components/dashboard/sidebar/breadcrumbs";
import { SidebarGroupType } from "@/components/dashboard/sidebar/navigation";
import { Event } from "@prisma/client";
import { getTranslations } from "next-intl/server";
import { routes } from "../routes/routes";
import { buildEventBreadcrumbs, buildEventSidebarItems } from "./event";

export const buildGalleryBreadcrumbs = async (
  event: Event,
  addLink: boolean
): Promise<BreadcrumbsItemType[]> => {
  const t = await getTranslations("dashboard.event");
  return [
    ...(await buildEventBreadcrumbs(event, true)),
    {
      name: t("gallery.gallery"),
      link: addLink ? routes.dashboard.event.gallery(event.id) : undefined,
    },
  ];
};

export const buildGallerySidebarItems = async (
  event: Event
): Promise<SidebarGroupType[]> => {
  return [...(await buildEventSidebarItems(event))];
};
