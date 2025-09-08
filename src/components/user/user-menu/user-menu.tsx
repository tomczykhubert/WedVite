import { SidebarMenuButton } from "@/components/ui/sidebar";
import { User } from "@prisma/client";
import { DropdownMenuContentProps } from "@radix-ui/react-dropdown-menu";
import { LuChevronsUpDown } from "react-icons/lu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import UserAvatar from "./user-avatar";
import UserMenuItems from "./user-menu-items";

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
