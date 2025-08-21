import Layout from "@/components/dashboard/layout";
import { BreadcrumbsItem } from "@/components/dashboard/sidebar/breadcrumbs";
import { routes } from "@/lib/routes/routes";
import { getTranslations } from "next-intl/server";
import { FaAddressBook, FaHome } from "react-icons/fa";

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const t = await getTranslations('user')

  const breadcrumbs: BreadcrumbsItem[] = [
    {
      icon: FaHome,
      link: routes.dashboard.index
    },
    {
      name: t('dashboard'),
    },
  ]

  return (
      <Layout sidebarItems={[]} breadcrumbs={breadcrumbs}>{children}</Layout>
  );
}