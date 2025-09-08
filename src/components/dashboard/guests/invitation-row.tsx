import GuestRow from "./guest-row";
import InvitationActions from "./invitation-actions";
import { InvitationStatusBadge } from "./invitations-badges";
import { InvitationWithGuests } from "./invitations-context";

export default function InvitationRow({
  invitation,
}: {
  invitation: InvitationWithGuests;
}) {
  return (
    <div className="flex flex-col mb-8 bg-accent/20 rounded-xl w-full">
      <div className="grid grid-cols-[minmax(150px,auto)_150px_90px] border-b bg-accent/40 rounded-t w-full items-center [&>*]:px-4 [&>*]:py-2">
        <div className="font-bold">
          <div className="max-w-[150px] md:max-w-[300px] xl:max-w-[400px] whitespace-normal [overflow-wrap:anywhere] line-clamp-2">
            {invitation.name}
          </div>
        </div>
        <div>
          <InvitationStatusBadge status={invitation.status} />
        </div>
        <div className="flex justify-center">
          <InvitationActions invitation={invitation} />
        </div>
      </div>

      <div>
        {invitation.guests.map((guest) => (
          <GuestRow guest={guest} invitation={invitation} key={guest.id} />
        ))}
      </div>
    </div>
  );
}
