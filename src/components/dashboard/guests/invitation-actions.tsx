import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import AccessDialog from "./access-dialog";
import AddGuestForm from "./add-guest-form";
import DeleteInvitation from "./delete-invitation";
import { InvitationWithGuests } from "./invitations-context";
import UpdateInvitationForm from "./update-invitation-form";

export default function InvitationActions({
  invitation,
}: {
  invitation: InvitationWithGuests;
}) {
  const [updateOpen, setUpdateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [addGuestOpen, setAddGuestOpen] = useState(false);
  const [accessOpen, setAccessOpen] = useState(false);
  const baseT = useTranslations("base");
  const t = useTranslations("dashboard.event.invitations");
  const gT = useTranslations("dashboard.event.guests");
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
              setAccessOpen(true);
            }}
          >
            {t("access.title")}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setUpdateOpen(true);
            }}
          >
            {t("edit")}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setDeleteOpen(true);
            }}
          >
            {t("delete.header")}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              setAddGuestOpen(true);
            }}
          >
            {gT("add")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AccessDialog
        invitationId={invitation.id}
        open={accessOpen}
        setOpen={(value) => setAccessOpen(value)}
      />
      <DeleteInvitation
        invitationId={invitation.id}
        open={deleteOpen}
        setOpen={(value) => setDeleteOpen(value)}
      />
      <UpdateInvitationForm
        invitation={invitation}
        open={updateOpen}
        setOpen={(value) => setUpdateOpen(value)}
      />
      <AddGuestForm
        invitationId={invitation.id}
        open={addGuestOpen}
        setOpen={(value) => setAddGuestOpen(value)}
      />
    </>
  );
}
