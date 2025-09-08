import Layout from "@/components/dashboard/layout";
import {
  buildGuestsBreadcrumbs,
  buildGuestsSidebarItems,
} from "@/lib/breadcrumbs/guest";
import { caller } from "@/trpc/server";
import ID from "@/types/id";
import { notFound } from "next/navigation";

export default async function GuestsLayout({
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

  const breadcrumbs = await buildGuestsBreadcrumbs(event, false);

  const sidebarItems = await buildGuestsSidebarItems(event);

  return (
    <Layout sidebarItems={sidebarItems} breadcrumbs={breadcrumbs}>
      {children}
    </Layout>
  );
}
