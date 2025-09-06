// "use client"
import Layout from "@/components/dashboard/layout";
import { BreadcrumbsItemType } from "@/components/dashboard/sidebar/breadcrumbs";
import { SidebarGroupType } from "@/components/dashboard/sidebar/navigation";
import { routes } from "@/lib/routes/routes";
import { caller } from "@/trpc/server";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Event } from "@prisma/client";
import { buildEventBreadcrumbs, buildEventSidebarItems } from "../(index)/layout";

export default async function EventSettingsLayout({
  params,
  children
}: {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}) {
  const { id } = await params;
  const event = await caller.event.getById({ id });

  if (!event) {
    return notFound();
  }

  const breadcrumbs = await buildEventSettingsBreadcrumbs(event, false)

  const sidebarItems = await buildEventSettingsSidebarItems(event)

  return (
    <Layout sidebarItems={sidebarItems} breadcrumbs={breadcrumbs}>{children}</Layout>
  );
}

export const buildEventSettingsBreadcrumbs = async (event: Event, addLink: boolean): Promise<BreadcrumbsItemType[]> => {
  const t = await getTranslations("dashboard.event")
  return [
    ...(await buildEventBreadcrumbs(event, true)),
    {
      name: t("settings"),
      link: addLink ? routes.dashboard.event.settings(event.id) : undefined
    },
  ]
}

export const buildEventSettingsSidebarItems = async (event: Event): Promise<SidebarGroupType[]> => {
  return [...(await buildEventSidebarItems(event))]
}