import { routes } from "@/lib/routes/routes";
import { DropdownMenuGroup } from "@radix-ui/react-dropdown-menu";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { ReactNode } from "react";
import { FaBell, FaCalendarDays, FaCreditCard, FaUser } from "react-icons/fa6";
import { IconType } from "react-icons/lib";
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../../ui/dropdown-menu";
import UserSignOut from "./user-sign-out";

//TODO: Update items content
export default async function UserMenuItems({
  userMenuItemsConfig = [
    {
      href: routes.dashboard.index,
      title: "dashboard",
      icon: FaCalendarDays,
    },
    [
      {
        href: routes.account.index,
        title: "account",
        icon: FaUser,
      },
      {
        href: routes.account.billing,
        title: "billing",
        icon: FaCreditCard,
      },
      {
        href: routes.account.notifications,
        title: "notifications",
        icon: FaBell,
      },
    ],
  ],
}: {
  userMenuItemsConfig?: UserMenuItemsConfig;
}) {
  const t = await getTranslations("user");

  const renderItems = (items: UserMenuItemsConfig): ReactNode => {
    return items.map((item) => {
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
