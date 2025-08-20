import { AppHeader } from "@/components/dashboard/sidebar/app-header";
import { AppSidebar } from "@/components/dashboard/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { HydrateClient } from "@/trpc/server";
import { cookies } from "next/headers";

export default async function PublicLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies()
  const sidebarCookie = cookieStore.get("sidebar_state")
  const defaultOpen = sidebarCookie === undefined ? true : sidebarCookie.value === "true";

  return (
    <>
      <SidebarProvider defaultOpen={defaultOpen}>
          <AppSidebar />
          <SidebarInset>
            <AppHeader />
            <div className="flex flex-1 flex-col p-4 relative">
              {children}
            </div>
          </SidebarInset>
      </SidebarProvider>
    </>
  );
}
