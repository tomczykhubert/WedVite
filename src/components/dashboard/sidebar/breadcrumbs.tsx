import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { IconType } from "react-icons"
import { Link } from "@/i18n/navigation";
import { FaHSquare } from "react-icons/fa";
import React from "react";

export default function Breadcrumbs({ breadcrumbs }: { breadcrumbs: BreadcrumbsItem[] }) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        { breadcrumbs.map((item, i) =>
          <React.Fragment key={i}>
            <BreadcrumbItem>
              {item.link ?
                <BreadcrumbLink asChild >
                  <Link href={item.link} className="flex items-center gap-1">
                    {item.icon && <item.icon />}
                    {item.name}
                  </Link>
                </BreadcrumbLink>
                :
                <BreadcrumbPage>{item.name}</BreadcrumbPage>
              }
            </BreadcrumbItem>
            {i < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export type BreadcrumbsItemNameOrIcon = { icon: IconType; name?: string; } | { name: string; icon?: IconType; };
export type BreadcrumbsItem = BreadcrumbsItemNameOrIcon & { link?: string }