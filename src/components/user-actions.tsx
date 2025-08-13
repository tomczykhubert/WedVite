"use client";

import { signOut, useSession } from "@/lib/auth/authClient";
import { Button, buttonVariants } from "./ui/button";
import { routes } from "@/lib/routes/routes";
import { useTranslations } from "next-intl";
import { VariantProps } from "class-variance-authority";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Link, useRouter } from "@/i18n/navigation";
import { LuCircleUser, LuLogOut } from "react-icons/lu";
import { Skeleton } from "./ui/skeleton";

export function UserActions({
  buttonSize,
}: {
  buttonSize?: VariantProps<typeof buttonVariants>["size"];
}) {
  const t = useTranslations("user");
  const { data, isPending } = useSession();
  const router = useRouter();
  const user = data?.user;

  if (isPending) {
    return <UserActionsSkeleton/>;
  }
  
  const userActions = [
    {
      href: routes.auth.profile,
      title: t("profile"),
      icon: LuCircleUser,
    },
  ];

  return (
    <div className="flex gap-2">
      {user ? (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 w-full p-2 rounded-lg hover:bg-accent cursor-pointer">
                <Avatar className="h-8 w-8">
                  {user.image ? (
                    <AvatarImage
                      src={user.image}
                      alt={user.name || t('avatar')}
                    />
                  ) : (
                    <AvatarFallback>
                      {user.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="flex flex-col items-start flex-1">
                  <span className="text-sm font-medium">
                    {user.name || t("anonymous")}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {user.email}
                  </span>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {userActions.map((item) => (
                <DropdownMenuItem key={item.title} asChild>
                  <Link href={item.href} className="flex items-center gap-2">
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem
                className="flex items-center gap-2"
                onClick={async () => {
                  await signOut({
                    fetchOptions: {
                      onSuccess: () => {
                        router.push(routes.auth.signIn);
                      },
                    },
                  });
                }}
              >
                <LuLogOut />
                <span>{t("signOut")}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      ) : (
        <>
          <Button
            asChild
            size={buttonSize ? buttonSize : "default"}
            variant="outline"
          >
            <Link href={routes.auth.signUp}>{t("signUp")}</Link>
          </Button>
          <Button asChild size={buttonSize ? buttonSize : "default"}>
            <Link href={routes.auth.signIn}>{t("signIn")}</Link>
          </Button>
        </>
      )}
    </div>
  );
}

function UserActionsSkeleton() {
  return (
    <div className="flex items-center space-x-4 h-[52px]">
      <Skeleton className="h-8 w-8 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-2 w-[110px]" />
        <Skeleton className="h-2 w-[130px]" />
      </div>
    </div>
  )
}