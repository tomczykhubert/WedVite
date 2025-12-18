import { useTRPC } from "@/trpc/client";
import { Menu } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

import { useTranslations } from "next-intl";
import { MenuIcon } from "./menu-icon";

export function useEventMenuOptions(eventId: string) {
  const t = useTranslations("dashboard.forms.menu");

  const trpc = useTRPC();
  const { data: menus, isPending } = useQuery(
    trpc.eventMenu.get.queryOptions({ eventId })
  );

  const options =
    menus?.map((menu: Menu) => ({
      value: menu.id,
      label: (
        <div className="flex items-center gap-2">
          <MenuIcon color={menu.color} />
          <span className="whitespace-normal [overflow-wrap:anywhere] mb-0">
            {menu.system ? t(`system.types.${menu.name}`) : menu.name}
          </span>
        </div>
      ),
    })) ?? [];

  return { options, isPending };
}
