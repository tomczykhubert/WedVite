"use client"

import * as React from "react"
import {
  Menubar,
  MenubarContent,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar"
import { hasLocale } from "next-intl"
import { availableLocales, getLocaleConfig, Locale, routing } from "@/i18n/routing"
import { useParams } from "next/navigation"
import { LuGlobe } from "react-icons/lu"
import Image from "next/image"
import { Link, usePathname } from "@/i18n/navigation"

export function LangSwitcher() {
  let { locale } = useParams()
  const pathname = usePathname();

  if (!hasLocale(routing.locales, locale)) {
    locale = routing.defaultLocale;
  }
  let currentLocale = locale as Locale; 

  return (

    <Menubar className="p-0 h-9 w-9 border transition-all hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50">
      <MenubarMenu>
        <MenubarTrigger className="w-full h-full flex items-center justify-center cursor-pointer"><LuGlobe /></MenubarTrigger>
        <MenubarContent>
          <MenubarRadioGroup value={currentLocale}>
            {availableLocales.map((loc) => (
                <Link key={loc.code} href={pathname} locale={loc.code}>
                  <MenubarRadioItem key={loc.code} value={loc.code}>
                    {loc.name} <MenubarShortcut><Image src={loc.flag} alt={loc.code} width={30} height={20}/></MenubarShortcut>
                  </MenubarRadioItem>
                </Link>
            ))}
          </MenubarRadioGroup>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}
