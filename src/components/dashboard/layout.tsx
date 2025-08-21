import { AppHeader } from "@/components/dashboard/sidebar/app-header";
import { AppSidebar } from "@/components/dashboard/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { cookies } from "next/headers";
import { BreadcrumbsItem } from "./sidebar/breadcrumbs";
import { SidebarGroupType } from "./sidebar/navigation";

export default async function Layout({
  sidebarItems,
  breadcrumbs,
  children
}: {
  children: React.ReactNode;
  sidebarItems: SidebarGroupType[]
  breadcrumbs: BreadcrumbsItem[]
}) {
  const cookieStore = await cookies()
  const sidebarCookie = cookieStore.get("sidebar_state")
  const defaultOpen = sidebarCookie === undefined ? true : sidebarCookie.value === "true";

  return (
    <>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar sidebarItems={sidebarItems}/>
        <SidebarInset>
          <AppHeader breadcrumbs={breadcrumbs}/>
          <div className="flex flex-1 flex-col p-4 relative">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
