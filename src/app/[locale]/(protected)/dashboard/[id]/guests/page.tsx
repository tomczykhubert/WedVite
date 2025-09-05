import { EventCardSkeleton } from "@/components/dashboard/event/event-card";
import AddInvitationForm from "@/components/dashboard/guests/add-invitation-form";
import InvitationTable from "@/components/dashboard/guests/invitation-table";
import { caller, prefetch, trpc } from "@/trpc/server";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export default async function Guests({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await caller.event.getById({ id });
  if (!event) {
    return notFound();
  }

  prefetch(trpc.invitation.get.queryOptions({ eventId: event.id }));
  return (
    <div>
      <AddInvitationForm event={event} />
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <Suspense fallback={<EventCardSkeleton />}>
          <InvitationTable event={event} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
