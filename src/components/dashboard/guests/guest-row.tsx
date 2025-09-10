import { cn } from "@/lib/utils";
import { Gender, Guest, GuestType, Invitation } from "@prisma/client";
import { useTranslations } from "next-intl";
import Image from "next/image";
import GuestActions from "./guest-actions";
import { AttendanceStatusBadge } from "./invitations-badges";
import { InvitationWithGuests, useInvitations } from "./invitations-context";

export default function GuestRow({
  guest,
  invitation,
}: {
  guest: Guest;
  invitation: InvitationWithGuests;
}) {
  const { filters } = useInvitations();
  const t = useTranslations("dashboard.event.guests");
  const isGuestSearched = (invitation: Invitation, guest: Guest) => {
    const nameFilter = filters.name?.toLowerCase();
    const attendanceFilter = filters.attendanceStatus;

    let nameMatches = true;
    if (nameFilter) {
      const invitationMatches = invitation.name
        .toLowerCase()
        .includes(nameFilter);
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
      className={cn(
        "grid grid-cols-[minmax(150px,auto)_150px_90px] border-t border-accent items-center min-w-max [&>*]:px-4 [&>*]:py-2",
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
        <div className="font-semibold max-w-[300px] whitespace-normal [overflow-wrap:anywhere] line-clamp-2">
          {guest.name || t(`guestTypes.${GuestType.COMPANION}`)}
        </div>
      </div>
      <div>
        <AttendanceStatusBadge status={guest.status} />
      </div>
      <div className="flex justify-center">
        <GuestActions guest={guest} invitation={invitation} />
      </div>
    </div>
  );
}

export const getGuestImage = (type: GuestType, gender: Gender): string => {
  if (gender == Gender.UNSPECIFIED) return "unspecified";

  switch (type) {
    case GuestType.ADULT:
    case GuestType.COMPANION:
      return gender.toLowerCase();
    case GuestType.CHILD:
      return gender == Gender.MALE ? "boy" : "girl";
    default:
      return "unspecified";
  }
};
