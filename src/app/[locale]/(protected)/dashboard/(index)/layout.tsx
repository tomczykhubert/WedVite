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

  const breadcrumbs = await buildBaseBreadcrumbs()

  return (
    <Layout sidebarItems={[]} breadcrumbs={breadcrumbs}>{children}</Layout>
  );
}

export const buildBaseBreadcrumbs = async (): Promise<BreadcrumbsItem[]> => {
  const t = await getTranslations('user')
  return [
    {
      icon: FaHome,
      link: routes.dashboard.index
    },
    {
      link: routes.dashboard.index,
      name: t('dashboard'),
    },
  ]
}