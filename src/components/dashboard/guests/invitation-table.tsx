"use client";

import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { Event } from "@prisma/client";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import React, { useState } from "react";

export default function InvitationTable({ event }: { event: Event }) {
  const t = useTranslations("base");
  const [nameFilter, setNameFilter] = useState(null);
  const trpc = useTRPC();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery(
      trpc.invitation.get.infiniteQueryOptions(
        { eventId: event.id, name: nameFilter },
        { getNextPageParam: (lastPage) => lastPage.nextCursor }
      )
    );

  return (
    <>
      {/* <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Name</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.pages.map((page, i) => (
            <React.Fragment key={i}>
              {page.items.map((invitation) => (
                <React.Fragment key={invitation.id}>
                  <TableRow className="bg-primary">
                    <TableCell className="font-medium" colSpan={4}>
                      {invitation.name}
                    </TableCell>
                    <TableCell className="font-medium" colSpan={4}>
                      {invitation.status}
                    </TableCell>
                  </TableRow>
                  {invitation.guests.map((guest) => (
                    <TableRow key={guest.id}>
                      <TableCell className="font-medium">
                        {guest.name}
                      </TableCell>
                      <TableCell>{guest.gender}</TableCell>
                      <TableCell>{guest.status}</TableCell>
                      <TableCell>{guest.type}</TableCell>
                    </TableRow>
                  ))}
                </React.Fragment>
              ))}
            </React.Fragment>
          ))}
        </TableBody>
      </Table> */}

      <div className="grid grid-cols-[auto_1fr_1fr_auto] bg-muted font-medium text-sm px-4 py-2">
        <div>Name</div>
        <div>Email</div>
        <div>Status</div>
        <div>Actions</div>
      </div>
      {data.pages.map((page, i) => (
        <React.Fragment key={i}>
          {page.items.map((invitation) => (
            <React.Fragment key={invitation.id}>
              <div className="grid grid-cols-[auto_1fr_1fr_auto] px-4 py-2 text-sm border-t hover:bg-muted/50">
                <div>{invitation.name}</div>
                {/* <div>{invitation.email}</div> */}
                <div>{invitation.status}</div>
                <div>{invitation.status}</div>
                <div>
                  <button className="text-primary">Edit</button>
                </div>
              </div>
              {invitation.guests.map((guest) => (
                <div
                  key={guest.id}
                  className="grid grid-cols-[auto_1fr_1fr_auto] px-4 py-2 text-sm border-t hover:bg-muted/50"
                >
                  <div>{guest.name}</div>
                  <div>{guest.gender}</div>
                  <div>{guest.status}</div>
                  <div>
                    <button className="text-primary">Edit</button>
                  </div>
                </div>
              ))}
            </React.Fragment>
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
