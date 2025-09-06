"use client";

import { Event } from "@prisma/client";
import InvitationsTable from "./invitations-table";
import { InvitationsProvider } from "./invitations-context";
import InvitationsTableFilters from "./invitations-table-filters";

export default function Invitations({ event }: { event: Event }) {

  return (
    <InvitationsProvider eventId={event.id}>
      <InvitationsTableFilters />
      <InvitationsTable />;
    </InvitationsProvider>
  );
}