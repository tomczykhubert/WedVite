"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import InvitationRow from "./invitation-row";
import { useInvitations } from "./invitations-context";

export default function InvitationsTable() {
  const baseT = useTranslations("base");
  const t = useTranslations("dashboard.event.guests");
  const {
    hasActiveFilters,
    invitations,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    isFetching,
  } = useInvitations();

  if (!invitations.length && !hasActiveFilters() && !isFetching) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        {t("noGuestsFound")}
      </div>
    );
  }

  if (!invitations.length && !isFetching) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        {t("noGuestsFoundForFilter")}
      </div>
    );
  }

  return (
    <>
      <div className="overflow-auto">
        <div className="min-w-max">
          <div className="grid grid-cols-[minmax(150px,auto)__90px_90px_90px] font-bold w-full [&>*]:px-4 [&>*]:py-2">
            <div>{baseT("name")}</div>
            <div className="text-center">{t("menu")}</div>
            <div className="text-center">{baseT("status")}</div>
            <div className="text-center">{baseT("actions")}</div>
          </div>

          {isFetching ? (
            <InvitationsTableSkeleton />
          ) : (
            invitations.map((invitation) => (
              <InvitationRow invitation={invitation} key={invitation.id} />
            ))
          )}
        </div>
      </div>
      {hasNextPage && (
        <div className="col-span-full flex justify-center m-4">
          <Button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            variant="outline"
          >
            {isFetchingNextPage ? baseT("loading") : baseT("loadMore")}
          </Button>
        </div>
      )}
    </>
  );
}

export function InvitationsTableSkeleton(props: { pulse?: boolean }) {
  const { pulse = true } = props;

  const lines = ["w-1/3", "w-1/5", "w-1/3", "w-1/4", "w-1/6"];
  return (
    <>
      {[1, 2].map((l) => (
        <div className="flex flex-row bg-accent/20 rounded-xl mb-8" key={l}>
          <div className="flex-grow">
            <div
              className={cn(
                "w-full rounded bg-accent/40 h-10 px-4 py-2",
                pulse && "animate-pulse"
              )}
            >
              <p
                className={cn(
                  `w-1/5 bg-accent rounded-md`,
                  pulse && "animate-pulse"
                )}
              >
                &nbsp;
              </p>
            </div>

            {lines.map((width, i) => (
              <div
                className="border-accent border-t px-4 py-2 flex items-center gap-3"
                key={i}
              >
                <div
                  className={cn(
                    `w-8 h-8 bg-accent rounded`,
                    pulse && "animate-pulse"
                  )}
                ></div>
                <p
                  className={cn(
                    `w-full bg-accent rounded-md h-4`,
                    pulse && "animate-pulse",
                    width
                  )}
                >
                  &nbsp;
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
