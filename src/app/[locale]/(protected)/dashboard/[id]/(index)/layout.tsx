import Layout from "@/components/dashboard/layout";
import { BreadcrumbsItemType } from "@/components/dashboard/sidebar/breadcrumbs";
import { SidebarGroupType } from "@/components/dashboard/sidebar/navigation";
import { routes } from "@/lib/routes/routes";
import { caller } from "@/trpc/server";
import { Event } from "@prisma/client";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { FaUsers } from "react-icons/fa";
import { LuSettings } from "react-icons/lu";
import { MdEvent } from "react-icons/md";
import { buildBaseBreadcrumbs } from "../../(index)/layout";

export default async function EventLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const t = await getTranslations("user");

  const { id } = await params;
  const event = await caller.event.getById({ id });

  if (!event) {
    return notFound();
  }

  const breadcrumbs = await buildEventBreadcrumbs(event, false);

  const sidebarItems = await buildEventSidebarItems(event);

  return (
    <Layout sidebarItems={sidebarItems} breadcrumbs={breadcrumbs}>
      {children}
    </Layout>
  );
}

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
          icon: MdEvent,
        },
        {
          link: routes.dashboard.event.settings(event.id),
          name: t("settings"),
          icon: LuSettings,
        },
        {
          link: routes.dashboard.event.guests(event.id),
          name: t("guests.guestsList"),
          icon: FaUsers,
        },
      ],
    },
  ];
};
