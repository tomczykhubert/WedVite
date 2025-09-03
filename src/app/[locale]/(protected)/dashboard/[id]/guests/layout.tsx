// "use client"
import Layout from "@/components/dashboard/layout";
import { BreadcrumbsItemType } from "@/components/dashboard/sidebar/breadcrumbs";
import { SidebarGroupType } from "@/components/dashboard/sidebar/navigation";
import { routes } from "@/lib/routes/routes";
import { caller } from "@/trpc/server";
import { Event } from "@prisma/client";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import {
  buildEventBreadcrumbs,
  buildEventSidebarItems,
} from "../(index)/layout";

export default async function GuestsLayout({
  params,
  children,
}: {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}) {
  const { id } = await params;
  const event = await caller.event.getById({ id });

  if (!event) {
    return notFound();
  }

  const breadcrumbs = await buildGuestsBreadcrumbs(event, false);

  const sidebarItems = await buildGuestsSidebarItems(event);

  return (
    <Layout sidebarItems={sidebarItems} breadcrumbs={breadcrumbs}>
      {children}
    </Layout>
  );
}

export const buildGuestsBreadcrumbs = async (
  event: Event,
  addLink: boolean
): Promise<BreadcrumbsItemType[]> => {
  const t = await getTranslations("dashboard.event");
  return [
    ...(await buildEventBreadcrumbs(event, true)),
    {
      name: t("guestsList"),
      link: addLink ? routes.dashboard.event.guests(event.id) : undefined,
    },
  ];
};

export const buildGuestsSidebarItems = async (
  event: Event
): Promise<SidebarGroupType[]> => {
  return [...(await buildEventSidebarItems(event))];
};
