import { routes } from "@/lib/routes/routes";
import React, { ReactNode } from "react";
import {
  LuBell,
  LuCircleUser,
  LuCreditCard,
  LuLayoutDashboard,
} from "react-icons/lu";
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../../ui/dropdown-menu";
import Link from "next/link";
import { IconType } from "react-icons/lib";
import { DropdownMenuGroup } from "@radix-ui/react-dropdown-menu";
import UserSignOut from "./user-sign-out";
import { getTranslations } from "next-intl/server";

export default async function UserMenuItems({
  userMenuItemsConfig = [
    {
      href: routes.dashboard.index,
      title: "dashboard",
      icon: LuLayoutDashboard,
    },
    [
      {
        href: routes.account.index,
        title: "account",
        icon: LuCircleUser,
      },
      {
        href: routes.account.billing,
        title: "billing",
        icon: LuCreditCard,
      },
      {
        href: routes.account.notifications,
        title: "notifications",
        icon: LuBell,
      },
    ],
  ],
}: {
  userMenuItemsConfig?: UserMenuItemsConfig;
}) {
  const t = await getTranslations("user");

  const renderItems = (items: UserMenuItemsConfig): ReactNode => {
    return items.map((item, index) => {
      if (Array.isArray(item)) {
        return (
            <DropdownMenuGroup key={item[0].title}>
              {renderItems(item)}
            </DropdownMenuGroup>
        );
      } else {
        return getMenuItem(item);
      }
    });
  };

  const getMenuItem = (item: UserMenuItem) => {
    return (
      <DropdownMenuItem key={item.title} asChild>
        <Link href={item.href} className="flex items-center gap-2">
          <item.icon className="h-4 w-4" />
          <span>{t(item.title)}</span>
        </Link>
      </DropdownMenuItem>
    );
  };

  return (
    <>
      <UserMenuSeparator />
      {renderItems(userMenuItemsConfig)}
      <UserMenuSeparator />
      <UserSignOut />
    </>
  );
}

function UserMenuSeparator() {
  return <DropdownMenuSeparator className="mx-1" />;
}

type UserMenuItem = {
  href: string;
  title: string;
  icon: IconType;
};

type UserMenuItems = UserMenuItem[];
type UserMenuItemsConfig = (UserMenuItem | UserMenuItems)[];
