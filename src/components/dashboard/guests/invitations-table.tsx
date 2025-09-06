"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Event, Gender, Guest, GuestType, Invitation } from "@prisma/client";
import { useTranslations } from "next-intl";
import Image from "next/image";
import React from "react";
import { InvitationWithGuests, useInvitations } from "./invitations-context";
import { AttendanceStatusBadge, InvitationStatusBadge } from "./invitations-badges";
import ConfirmModal from "@/components/base/confirm-modal";
import ActionButton from "@/components/base/button-link";
import { FaTrash } from "react-icons/fa";
import Loader from "@/components/base/loader";

export default function InvitationsTable() {
  const baseT = useTranslations("base");
  const t = useTranslations("dashboard.event.guests");
  const { hasActiveFilters, invitations, hasNextPage, isFetchingNextPage, fetchNextPage, isFetching } = useInvitations();

  if (!invitations.length && !hasActiveFilters() && !isFetching) {
    return <div className="p-4 text-center text-muted-foreground">{t("noGuestsFound")}</div>
  }

  if (!invitations.length && !isFetching) {
    return <div className="p-4 text-center text-muted-foreground">{t("noGuestsFoundForFilter")}</div>
  }

  return (
    <>
      <div className="overflow-auto">
        <div className="min-w-max">
          <div className="grid grid-cols-[minmax(150px,auto)_150px_100px] font-bold w-full [&>*]:px-4 [&>*]:py-2">
            <div>{baseT('name')}</div>
            <div>{baseT('status')}</div>
            <div className="text-end">{baseT('actions')}</div>
          </div>

          {isFetching ? <InvitationsTableSkeleton /> :
          invitations.map((invitation) => (
            <InvitationRow invitation={invitation} key={invitation.id} />
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
  );
}

export function InvitationsTableSkeleton(props: { pulse?: boolean }) {
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

function InvitationRow({ invitation }: { invitation: InvitationWithGuests }) {

  return (
    <div className="flex flex-col mb-8 bg-accent/20 rounded-xl w-full">
      <div className="grid grid-cols-[minmax(150px,auto)_150px_100px] border-b bg-accent/40 rounded-t w-full items-center [&>*]:px-4 [&>*]:py-2">
        <div className="font-bold"><div className="max-w-[150px] md:max-w-[300px] xl:max-w-[400px] whitespace-normal [overflow-wrap:anywhere] line-clamp-2">{invitation.name}</div></div>
        <div><InvitationStatusBadge status={invitation.status} /></div>
        <div></div>
      </div>

      <div>
        {invitation.guests.map((guest) => (
          <GuestRow guest={guest} invitation={invitation} key={guest.id} />
        ))}
      </div>
    </div>
  );
}

function GuestRow({ guest, invitation }: { guest: Guest, invitation: InvitationWithGuests }) {
  const { filters } = useInvitations()
  const baseT = useTranslations("base");
  const t = useTranslations("dashboard.event.guests");
  const isGuestSearched = (invitation: Invitation, guest: Guest) => {
    const nameFilter = filters.name?.toLowerCase();
    const attendanceFilter = filters.attendanceStatus;

    let nameMatches = true;
    if (nameFilter) {
      const invitationMatches = invitation.name.toLowerCase().includes(nameFilter);
      const guestMatches = guest.name.toLowerCase().includes(nameFilter);
      nameMatches = invitationMatches || guestMatches;
    }

    let attendanceMatches = true;
    if (attendanceFilter) {
      attendanceMatches = guest.status === attendanceFilter;
    }

    return nameMatches && attendanceMatches;
  };
  return (
    <div
      className={cn("grid grid-cols-[minmax(150px,auto)_150px_100px] border-t border-accent items-center min-w-max [&>*]:px-4 [&>*]:py-2",
        !isGuestSearched(invitation, guest) && "opacity-50"
      )}
    >
      <div className="flex items-center gap-3">
        <Image
          src={`/images/guests/${getGuestImage(guest.type, guest.gender)}.png`}
          alt={t(`typeAlt.${getGuestImage(guest.type, guest.gender)}`)}
          width={32}
          height={32}
        />
        <div className="font-semibold max-w-[300px] whitespace-normal [overflow-wrap:anywhere] line-clamp-2">{guest.name}</div>
      </div>
      <div><AttendanceStatusBadge status={guest.status} /></div>
      <div className="text-end">
        <DeleteGuest guest={guest} />
        <button className="text-primary">{baseT('edit')}</button>
      </div>
    </div>
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
