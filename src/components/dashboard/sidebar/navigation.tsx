import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { routes } from "@/lib/routes/routes";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { FaHome } from "react-icons/fa";
import { LuLayoutDashboard, LuNotebook } from "react-icons/lu";

export async function Navigation() {
  const t  = await getTranslations("dashboard");
  const items = [
    {
      href: routes.home,
      title: t("home"),
      icon: FaHome,
    },
    {
      href: routes.dashboard.index,
      title: t("events"),
      icon: LuLayoutDashboard,
    },
  ];
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{t("events")}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
