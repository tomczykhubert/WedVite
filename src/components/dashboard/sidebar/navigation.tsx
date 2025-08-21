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
import { IconType } from "react-icons";
import { FaHome } from "react-icons/fa";
import { LuLayoutDashboard } from "react-icons/lu";

export async function Navigation({ sidebarItems }: { sidebarItems: SidebarGroupType[] }) {
  const t = await getTranslations("dashboard");
  let items: SidebarGroupType[] = [{
    name: t("app"),
    items: [
      {
        link: routes.home,
        name: t("home"),
        icon: FaHome,
      },
      {
        link: routes.dashboard.index,
        name: t("events"),
        icon: LuLayoutDashboard,
      },
    ]
  }];

  items = [...items, ...sidebarItems]

  return (
    <>
      {
        items.map(group =>
          <SidebarGroup key={group.name}>
            <SidebarGroupLabel>{group.name}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton asChild>
                      <Link href={item.link}>
                        <item.icon />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )
      }
    </>
  );
}

export type SidebarItemType = {
  icon: IconType,
  name: string,
  link: string
}

export type SidebarGroupType = {
  name: string,
  items: SidebarItemType[]
}