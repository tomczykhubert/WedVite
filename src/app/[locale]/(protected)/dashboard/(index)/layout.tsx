import Layout from "@/components/dashboard/layout";
import { buildBaseBreadcrumbs } from "@/lib/breadcrumbs/base";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const breadcrumbs = await buildBaseBreadcrumbs();

  return (
    <Layout sidebarItems={[]} breadcrumbs={breadcrumbs}>
      {children}
    </Layout>
  );
}
