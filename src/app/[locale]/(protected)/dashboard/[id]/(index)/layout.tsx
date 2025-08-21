import Layout from "@/components/dashboard/layout";
import { BreadcrumbsItem } from "@/components/dashboard/sidebar/breadcrumbs";
import { SidebarGroupType } from "@/components/dashboard/sidebar/navigation";
import { routes } from "@/lib/routes/routes";
import { caller } from "@/trpc/server";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { FaAddressBook, FaHome, FaUsers } from "react-icons/fa";
import { LuSettings } from "react-icons/lu";

export default async function EventLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>
}) {

  const t = await getTranslations('user')
  const tEvent = await getTranslations('dashboard.event')
  const { id } = await params;
  const event = await caller.event.getById({ id });

  if (!event) {
    return notFound();
  }

  const breadcrumbs: BreadcrumbsItem[] = [
    {
      icon: FaHome,
      link: routes.dashboard.index
    },
    {
      link: routes.dashboard.index,
      name: t('dashboard'),
    },
    {
      name: event.name,
    },
  ]

  const sidebarItems:SidebarGroupType[] = [{
    name: event.name,
    items: [
        {
        link: routes.dashboard.event.byId(event.id),
        name: tEvent("settings"),
        icon: LuSettings ,
      },
        {
        link: routes.dashboard.event.byId(event.id),
        name: tEvent("guestsList"),
        icon: FaUsers ,
      },
    ]
  }]

  return (
    <Layout sidebarItems={sidebarItems} breadcrumbs={breadcrumbs}>{children}</Layout>
  );
}