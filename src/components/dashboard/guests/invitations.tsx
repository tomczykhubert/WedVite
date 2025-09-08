"use client";

import { Event } from "@prisma/client";
import { useTranslations } from "next-intl";
import AddInvitationForm from "./add-invitation-form";
import { InvitationsProvider } from "./invitations-context";
import InvitationsTable from "./invitations-table";
import InvitationsTableFilters from "./invitations-table-filters";

export default function Invitations({ event }: { event: Event }) {
  const t = useTranslations("dashboard.event");
  return (
    <InvitationsProvider eventId={event.id}>
      <div className="flex items-center justify-between mb-4">
        <h1>{t("guests.guestsList")}</h1>
        <AddInvitationForm event={event} />
      </div>
      <InvitationsTableFilters />
      <InvitationsTable />
    </InvitationsProvider>
  );
}
