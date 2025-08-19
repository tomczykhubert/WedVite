import UserMenu from "@/components/user/user-menu/user-menu";
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { getUser } from "@/lib/auth/getUser";

export async function SidebarUser() {
  const user = await getUser();
  if (!user) return;
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <UserMenu user={user} side="right" sidebar={true} />
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
