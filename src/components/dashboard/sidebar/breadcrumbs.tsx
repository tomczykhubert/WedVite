"use client";

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link } from "@/i18n/navigation";
import React, { JSX, useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const MAX_BREADCRUMB_ITEM_LENGTH = {
  sm: 1,
  md: 2,
  lg: 3,
  xl: 5,
} as const;

const MAX_NAME_LENGTH = 15;

export default function Breadcrumbs({
  breadcrumbs,
}: {
  breadcrumbs: BreadcrumbsItemType[];
}) {
  const [open, setOpen] = useState(false);
  const isXl = useMediaQuery({ query: "(min-width: 1280px)" });
  const isLg = useMediaQuery({ query: "(min-width: 1024px)" });
  const isMd = useMediaQuery({ query: "(min-width: 768px)" });
  const [isMounted, setIsMounted] = useState(false);
  const size = (isXl && "xl") || (isLg && "lg") || (isMd && "md") || "sm";

  const startItems = breadcrumbs.slice(0, 1);

  const visibleCount = MAX_BREADCRUMB_ITEM_LENGTH[size];
  const shouldUseDropdown = breadcrumbs.length > visibleCount + 1;

  const endItems = shouldUseDropdown
    ? breadcrumbs.slice(breadcrumbs.length - visibleCount + 1)
    : breadcrumbs.slice(1);

  const dropdownItems = shouldUseDropdown
    ? breadcrumbs.slice(1, breadcrumbs.length - visibleCount + 1)
    : [];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          {startItems.map((item, i) => renderItem(item, true, i))}
          {dropdownItems.length != 0 && (
            <>
              <BreadcrumbItem>
                <DropdownMenu open={open} onOpenChange={setOpen}>
                  <DropdownMenuTrigger
                    className="flex items-center gap-1"
                    aria-label="Toggle menu"
                  >
                    <BreadcrumbEllipsis className="size-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {dropdownItems.map((item, i) => (
                      <DropdownMenuItem
                        key={i}
                        disabled={item.link == undefined}
                      >
                        {item.link ? (
                          <Link href={item.link}>
                            {item.icon}
                            {item.name}
                          </Link>
                        ) : (
                          <>
                            {item.icon}
                            {item.name}
                          </>
                        )}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </>
          )}
          {endItems.map((item, i) =>
            renderItem(item, i != endItems.length - 1, i)
          )}
        </BreadcrumbList>
      </Breadcrumb>
    </>
  );
}

const renderItem = (
  item: BreadcrumbsItemType,
  addSeparator: boolean,
  i: number
) => {
  return (
    <React.Fragment key={i}>
      <BreadcrumbItem>
        {item.link ? (
          <BreadcrumbLink asChild>
            <Link href={item.link} className="flex items-center gap-1">
              {item.icon}
              {shortenName(item.name)}
            </Link>
          </BreadcrumbLink>
        ) : (
          <BreadcrumbPage>{item.name}</BreadcrumbPage>
        )}
      </BreadcrumbItem>
      {addSeparator && <BreadcrumbSeparator />}
    </React.Fragment>
  );
};

const shortenName = (name: string = "") => {
  return name.length > MAX_NAME_LENGTH
    ? name.slice(0, MAX_NAME_LENGTH) + "..."
    : name;
};

export type BreadcrumbsItemNameOrIconType =
  | { icon: JSX.Element; name?: string }
  | { name: string; icon?: JSX.Element };
export type BreadcrumbsItemType = BreadcrumbsItemNameOrIconType & {
  link?: string;
};
