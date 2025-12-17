import Layout from "@/components/dashboard/layout";
import {
  buildGalleryBreadcrumbs,
  buildGallerySidebarItems,
} from "@/lib/breadcrumbs/gallery";
import { caller } from "@/trpc/server";
import ID from "@/types/id";
import { notFound } from "next/navigation";

export default async function GalleryLayout({
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

  const breadcrumbs = await buildGalleryBreadcrumbs(event, false);

  const sidebarItems = await buildGallerySidebarItems(event);

  return (
    <Layout sidebarItems={sidebarItems} breadcrumbs={breadcrumbs}>
      {children}
    </Layout>
  );
}
