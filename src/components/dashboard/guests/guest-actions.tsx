import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Guest } from "@prisma/client";
import { MoreHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import DeleteGuest from "./delete-guest";
import { InvitationWithGuests } from "./invitations-context";
import UpdateGuestForm from "./update-guest-form";

export default function GuestActions({
  guest,
  invitation,
}: {
  guest: Guest;
  invitation: InvitationWithGuests;
}) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const baseT = useTranslations("base");
  const t = useTranslations("dashboard.event.guests");
  const isLastGuest = invitation.guests.length === 1;
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">{baseT("openMenu")}</span>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => {
              setUpdateOpen(true);
            }}
          >
            {t("edit")}
          </DropdownMenuItem>
          {!isLastGuest && (
            <DropdownMenuItem
              onClick={() => {
                setDeleteOpen(true);
              }}
            >
              {t("delete.header")}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      {!isLastGuest && (
        <DeleteGuest
          guestId={guest.id}
          open={deleteOpen}
          setOpen={(value) => setDeleteOpen(value)}
        />
      )}
      <UpdateGuestForm
        open={updateOpen}
        setOpen={(value) => setUpdateOpen(value)}
        guest={guest}
      />
    </>
  );
}
