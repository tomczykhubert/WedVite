import { LangSwitcher } from "@/components/lang-switcher"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import Breadcrumbs, { BreadcrumbsItem } from "./breadcrumbs"

//TODO: Breadcrumbs
export function AppHeader({ breadcrumbs }: { breadcrumbs: BreadcrumbsItem[] }) {
  return (
    <header className="flex  shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
      <div className="flex w-full items-center gap-1 lg:gap-2 lg:px-2">
        <SidebarTrigger className="h-9 w-9 cursor-pointer" size={"lg"} variant={"outline"} />
        <Separator
          orientation="vertical"
          className=" data-[orientation=vertical]:h-8"
        />
        <div className="p-2 flex w-full items-center gap-2">
          <Breadcrumbs breadcrumbs={breadcrumbs}></Breadcrumbs>
          <div className="ml-auto flex items-center gap-2">
            <ThemeSwitcher />
            <LangSwitcher />
          </div>
        </div>
      </div>
    </header>
  )
}
