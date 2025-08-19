import { headers } from "next/headers";
import { getSession } from "@/lib/auth/authClient";
import UserMenu from "@/components/user/user-menu/user-menu";
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { User } from "@prisma/client";

export async function SidebarUser() {
  const { data } = await getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  const user = data?.user as User;
  if (!user) return;
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <UserMenu user={user} side="right" sidebar={true} />
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
