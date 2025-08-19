
import * as React from "react";
import {
  Menubar,
  MenubarContent,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import {
  availableLocales,
} from "@/i18n/routing";
import { LuGlobe } from "react-icons/lu";
import Image from "next/image";
import { Link} from "@/i18n/navigation";
import { getLocale } from "next-intl/server";
import { headers } from "next/headers";

export async function LangSwitcher() {
  let locale  = await getLocale();
  const headersList = await headers();
  const pathname = headersList.get("x-current-path") ?? '/';
  
  return (
    <Menubar className="p-0 h-9 w-9 border transition-all hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50">
      <MenubarMenu>
        <MenubarTrigger className="w-full h-full flex items-center justify-center cursor-pointer">
          <LuGlobe />
        </MenubarTrigger>
        <MenubarContent>
          <MenubarRadioGroup value={locale}>
            {availableLocales.map((loc) => (
              <Link key={loc.code} href={pathname} locale={loc.code}>
                <MenubarRadioItem key={loc.code} value={loc.code}>
                  {loc.name}{" "}
                  <MenubarShortcut>
                    <Image
                      src={loc.flag}
                      alt={loc.code}
                      width={30}
                      height={20}
                    />
                  </MenubarShortcut>
                </MenubarRadioItem>
              </Link>
            ))}
          </MenubarRadioGroup>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
