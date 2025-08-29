import UserMenu from "@/components/user/user-menu/user-menu";
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";

import { caller } from "@/trpc/server";
export async function SidebarUser() {
  const user = await caller.user.get();
  if (!user) return;
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <UserMenu user={user} side="right" sidebar={true} />
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
