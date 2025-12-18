import Layout from "@/components/dashboard/layout";
import {
  buildTablesBreadcrumbs,
  buildTablesSidebarItems,
} from "@/lib/breadcrumbs/tables";
import { caller } from "@/trpc/server";
import ID from "@/types/id";
import { notFound } from "next/navigation";

export default async function TablesLayout({
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

  const breadcrumbs = await buildTablesBreadcrumbs(event, false);

  const sidebarItems = await buildTablesSidebarItems(event);

  return (
    <Layout sidebarItems={sidebarItems} breadcrumbs={breadcrumbs}>
      {children}
    </Layout>
  );
}
