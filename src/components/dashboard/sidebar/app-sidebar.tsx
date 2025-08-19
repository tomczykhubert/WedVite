import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Navigation } from "./navigation";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { routes } from "@/lib/routes/routes";
import { SidebarUser } from "./sidebar-user";

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarHeader className="flex-row items-center gap-2 justify-between p-0">
            <Link href={routes.dashboard.index} className="flex items-center gap-2">
                <Image
                  src="/images/logo.png"
                  alt="WedVite"
                  width={32}
                  height={32}
                  className="shrink-0"
                />
              <span className="text-lg font-semibold tracking-tighter">
                WedVite
              </span>
            </Link>
          </SidebarHeader>
        </SidebarGroup>
        <Navigation />
      </SidebarContent>
      <SidebarFooter>
        <SidebarUser />
      </SidebarFooter>
    </Sidebar>
  );
}
