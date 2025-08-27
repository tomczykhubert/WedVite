"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import React from "react";
import { useTranslations } from "next-intl";
import ContactCard from "./contact-card";

export default function ContactsList({ limit }: { limit: number }) {
  const t = useTranslations('base')
  const trpc = useTRPC();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery(
      trpc.contact.get.infiniteQueryOptions(
        { limit },
        { getNextPageParam: (lastPage) => lastPage.nextCursor }
      )
    );

  return (
    <>
      {data.pages.map((page, i) => (
        <React.Fragment key={i}>
          {page.items.map((contact) => (
            <ContactCard key={contact.id} contact={contact} />
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
            {isFetchingNextPage ? t('loading') : t('loadMore')}
          </Button>
        </div>
      )}
    </>
  );
}
