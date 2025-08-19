import React from "react";
import { User } from "@prisma/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { DropdownMenuContentProps } from "@radix-ui/react-dropdown-menu";
import { LuChevronsUpDown } from "react-icons/lu";
import UserMenuItems from "./user-menu-items";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import UserAvatar from "./user-avatar";

export default function UserMenu({
  user,
  side = "bottom",
  sidebar = false,
}: {
  user: User;
  side?: DropdownMenuContentProps["side"];
  sidebar?: boolean;
}) {
  const buttonContent = (
    <>
      <UserAvatar user={user} />
      <UserName user={user} />
      <LuChevronsUpDown className="ml-auto size-4" />
    </>
  );
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {sidebar ? (
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            {buttonContent}
          </SidebarMenuButton>
        ) : (
          <button className="flex items-center gap-2 w-full p-2 rounded-lg hover:bg-accent cursor-pointer data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
            {buttonContent}
          </button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent side={side} align="end" sideOffset={4}>
        <DropdownMenuLabel>
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <UserAvatar user={user} />
            <UserName user={user} />
          </div>
        </DropdownMenuLabel>
        <UserMenuItems />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function UserName({ user }: { user: User }) {
  return (
    <div className="grid flex-1 text-left text-sm leading-tight">
      <span className="truncate font-medium">{user.name}</span>
      <span className="truncate text-xs">{user.email}</span>
    </div>
  );
}
