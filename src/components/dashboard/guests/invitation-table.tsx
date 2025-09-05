"use client";

import ActionButton from "@/components/base/button-link";
import ConfirmModal from "@/components/base/confirm-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn, getEnumKeys } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { AttendanceStatus, Event, Gender, Guest, GuestType, InvitationStatus } from "@prisma/client";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { LucideSearch } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import React, { useState } from "react";
import { FaTrash } from "react-icons/fa";

export default function InvitationTable({ event }: { event: Event }) {
  const baseT = useTranslations("base");
  const invT = useTranslations("dashboard.event.invitations");
  const t = useTranslations("dashboard.event.guests");
  const [nameFilter, setNameFilter] = useState<string | null>(null);
  const [guestStatusFilter, setGuestStatusFilter] = useState<AttendanceStatus | null>(null);
  const [invitationStatusFilter, setInvitationStatusFilter] = useState<InvitationStatus | null>(null);
  const trpc = useTRPC();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery(
      trpc.invitation.get.infiniteQueryOptions(
        {
          eventId: event.id,
          name: nameFilter,
          attendanceStatus: guestStatusFilter,
          invitationStatus: invitationStatusFilter
        },
        { getNextPageParam: (lastPage) => lastPage.nextCursor }
      )
    );

  const areFiltersGiven = () => {
    return nameFilter || guestStatusFilter || invitationStatusFilter
  }
  if (!data.pages[0]?.items?.length && !areFiltersGiven()) {
    return <div className="p-4 text-center text-muted-foreground">{t("noGuestsFound")}</div>
  }

  return (
    <>

      <div className="flex justify-end gap-3 items-end mb-4 flex-wrap">
        <div>
          <p className="text-sm">{t('attendanceStatus')}:</p>
          <div className="flex items-center gap-2">
            {getEnumKeys(AttendanceStatus).map(status => (
              <GuestStatusBadge status={status}
                className={cn(
                  "cursor-pointer",
                  guestStatusFilter != status && "opacity-50"
                )}
                onClick={() => {
                  if (guestStatusFilter == status) {
                    setGuestStatusFilter(null)
                  } else {
                    setGuestStatusFilter(status)
                  }
                }
                } key={status} />
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm">{invT('invitationStatus')}:</p>
          <div className="flex items-center gap-2">
            {getEnumKeys(InvitationStatus).map(status => (
              <InvitationStatusBadge status={status}
                className={cn(
                  "cursor-pointer",
                  invitationStatusFilter != status && "opacity-50"
                )}
                onClick={() => {
                  if (invitationStatusFilter == status) {
                    setInvitationStatusFilter(null)
                  } else {
                    setInvitationStatusFilter(status)
                  }
                }
                } key={status} />
            ))}
          </div>
        </div>
        <SearchBox onSearch={(query) => setNameFilter(query)} placeholder={t("search")} className="max-w-[500px] grow" />
      </div>

      {!data.pages[0]?.items?.length
        ?
        <div className="p-4 text-center text-muted-foreground">{t("noGuestsFoundForFilter")}</div>
        :
        <>
          <div className="overflow-auto">
            <div className="min-w-max">
              <div className="grid grid-cols-[minmax(150px,auto)_150px_100px] font-bold w-full">
                <div className="px-4 py-2">{baseT('name')}</div>
                <div className="px-4 py-2">{baseT('status')}</div>
                <div className="px-4 py-2 text-end">{baseT('actions')}</div>
              </div>

              {data.pages.map((page, i) => (
                <React.Fragment key={i}>
                  {page.items.map((invitation) => (
                    <div key={invitation.id} className="flex flex-col mb-8 bg-accent/20 rounded-xl w-full">
                      <div className="grid grid-cols-[minmax(150px,auto)_150px_100px] border-b bg-accent/40 rounded-t w-full">
                        <div className="px-4 py-2 font-bold">{invitation.name}</div>
                        <div className="px-4 py-2"><InvitationStatusBadge status={invitation.status} /></div>
                        <div className="px-4 py-2"></div>
                      </div>

                      <div>
                        {invitation.guests.map((guest) => (
                          <div
                            key={guest.id}
                            className={cn("grid grid-cols-[minmax(150px,auto)_150px_100px] border-t border-accent items-center min-w-max",
                              guestStatusFilter && guestStatusFilter != guest.status && "opacity-50"
                            )}
                          >
                            <div className="px-4 py-2 flex items-center gap-3">
                              <Image
                                src={`/images/guests/${getGuestImage(guest.type, guest.gender)}.png`}
                                alt={t(`typeAlt.${getGuestImage(guest.type, guest.gender)}`)}
                                width={32}
                                height={32}
                              />
                              <span className="font-semibold">{guest.name}</span>
                            </div>
                            <div className="px-4 py-2"><GuestStatusBadge status={guest.status} /></div>
                            <div className="px-4 py-2 text-end">
                              <DeleteGuest guest={guest} />
                              <button className="text-primary">{baseT('edit')}</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </React.Fragment>
              ))}
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
      }
    </>
  );
}

export function InvitationTableSkeleton(props: { pulse?: boolean }) {
  const { pulse = true } = props;

  const lines = ["w-1/3", "w-1/5", "w-1/3", "w-1/4", "w-1/6"];
  return (<>

    {[1, 2].map(l => (
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
                pulse && "animate-pulse",
              )}
            >
              &nbsp;
            </p>
          </div>

          {lines.map((width, i) => (
            <div className="border-accent border-t px-4 py-2 flex items-center gap-3" key={i}>
              <div className={cn(
                `w-8 h-8 bg-accent rounded`,
                pulse && "animate-pulse",
              )}></div>
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

const getGuestImage = (type: GuestType, gender: Gender): string => {
  if (gender == Gender.UNSPECIFIED) return 'unspecified'

  switch (type) {
    case GuestType.ADULT:
    case GuestType.COMPANION:
      return gender.toLowerCase()
    case GuestType.CHILD:
      return gender == Gender.MALE ? 'boy' : 'girl'
    default:
      return 'unspecified'
  }
}

function getInvitationBadgeVariant(status: InvitationStatus) {
  switch (status) {
    case InvitationStatus.CREATED:
      return "neutral";
    case InvitationStatus.DELIVERED:
      return "yellow";
    case InvitationStatus.ANSWERED:
      return "success";
  }
}

function InvitationStatusBadge({
  status,
  className,
  onClick
}: { status: InvitationStatus, className?: string, onClick?: (status: InvitationStatus) => void }) {
  const t = useTranslations("dashboard.event.invitations.status")


  return (<>
    <Badge className={cn(className)} variant={getInvitationBadgeVariant(status)} onClick={() => onClick?.(status)}>{t(status.toLowerCase())}</Badge>
  </>
  )
}

function getGuestBadgeVariant(status: AttendanceStatus) {
  switch (status) {
    case AttendanceStatus.CONFIRMED:
      return "success";
    case AttendanceStatus.DECLINED:
      return "destructive";
    case AttendanceStatus.PENDING:
      return "neutral";
  }
}

function GuestStatusBadge({
  status,
  className,
  onClick
}: { status: AttendanceStatus, className?: string, onClick?: (status: AttendanceStatus) => void }) {
  const t = useTranslations("dashboard.event.guests.status")

  return (<>
    <Badge className={cn(className)} variant={getGuestBadgeVariant(status)} onClick={() => onClick?.(status)}>{t(status.toLowerCase())}</Badge>
  </>
  )
}


function DeleteGuest({ guest }: { guest: Guest }) {
  const formsT = useTranslations("formValidation.forms");
  const t = useTranslations("dashboard.event.guests.delete");
  // const trpc = useTRPC();
  // const queryClient = useQueryClient();

  // const deleteContact = useMutation(
  //   trpc.contact.delete.mutationOptions({
  //     onSuccess: async () => {
  //       await queryClient.invalidateQueries(trpc.contact.pathFilter());
  //       toast.success(formsT("success"));
  //     },
  //     onError: (err) => {
  //       toast.error(formsT("error"));
  //     },
  //   })
  // );
  const onConfirm = () => {
    console.log("usuwanie")
    // deleteContact.mutate({ id: contact.id });
  };

  return (
    <ConfirmModal
      header={t("header")}
      message={t("message")}
      onConfirm={onConfirm}
      trigger={
        <ActionButton variant="destructive" size="sm" tooltip={t("header")}>
          <FaTrash />
        </ActionButton>
      }
    />
  );
}

interface SearchBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  placeholder: string;
  onSearch: (query: string) => void;
}

export const SearchBox: React.FC<SearchBoxProps> = ({
  placeholder,
  onSearch,
  className,
  ...props
}) => {
  const [query, setQuery] = React.useState("");

  const handleSearch = () => {
    if (onSearch) onSearch(query);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className={cn("flex items-center space-x-2", className)} {...props}>
      <Input
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1"
      />
      <Button onClick={handleSearch} variant="default">
        <LucideSearch className="w-4 h-4" />
      </Button>
    </div>
  );
};