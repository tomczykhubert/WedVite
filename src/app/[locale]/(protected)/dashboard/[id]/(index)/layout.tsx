import Layout from "@/components/dashboard/layout";
import {
  buildEventBreadcrumbs,
  buildEventSidebarItems,
} from "@/lib/breadcrumbs/event";
import { caller } from "@/trpc/server";
import ID from "@/types/id";
import { notFound } from "next/navigation";

export default async function EventLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: ID }>;
}) {
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
