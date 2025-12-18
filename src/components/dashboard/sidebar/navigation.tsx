import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { routes } from "@/lib/routes/routes";
import { Calendar, Home, LucideIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

export async function Navigation({
  sidebarItems,
}: {
  sidebarItems: SidebarGroupType[];
}) {
  const t = await getTranslations("dashboard");
  let items: SidebarGroupType[] = [
    {
      name: t("app"),
      items: [
        {
          link: routes.home,
          name: t("home"),
          icon: Home,
        },
        {
          link: routes.dashboard.index,
          name: t("events"),
          icon: Calendar,
        },
      ],
    },
  ];

  items = [...items, ...sidebarItems];

  return (
    <>
      {items.map((group) => (
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
      ))}
    </>
  );
}

export type SidebarItemType = {
  icon: LucideIcon;
  name: string;
  link: string;
};

export type SidebarGroupType = {
  name: string;
  items: SidebarItemType[];
};
