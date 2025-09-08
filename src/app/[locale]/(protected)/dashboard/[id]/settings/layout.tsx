// "use client"
import Layout from "@/components/dashboard/layout";
import {
  buildEventSettingsBreadcrumbs,
  buildEventSettingsSidebarItems,
} from "@/lib/breadcrumbs/settings";
import { caller } from "@/trpc/server";
import ID from "@/types/id";
import { notFound } from "next/navigation";

export default async function EventSettingsLayout({
  params,
  children,
}: {
  params: Promise<{ id: ID }>;
  children: React.ReactNode;
}) {
  const { id } = await params;
  const event = await caller.event.getById({ id });

  if (!event) {
    return notFound();
  }

  const breadcrumbs = await buildEventSettingsBreadcrumbs(event, false);

  const sidebarItems = await buildEventSettingsSidebarItems(event);

  return (
    <Layout sidebarItems={sidebarItems} breadcrumbs={breadcrumbs}>
      {children}
    </Layout>
  );
}
