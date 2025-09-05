"use client";

import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import React from "react";
import EventCard from "./event-card";

export default function EventsList() {
  const t = useTranslations("base");
  const trpc = useTRPC();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery(
      trpc.event.get.infiniteQueryOptions(
        {},
        { getNextPageParam: (lastPage) => lastPage.nextCursor }
      )
    );

  return (
    <>
      {data.pages.map((page, i) => (
        <React.Fragment key={i}>
          {page.items.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </React.Fragment>
      ))}

      {hasNextPage && (
        <div className="col-span-full flex justify-center m-4">
          <Button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            variant="outline"
          >
            {isFetchingNextPage ? t("loading") : t("loadMore")}
          </Button>
        </div>
      )}
    </>
  );
}
