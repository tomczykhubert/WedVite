import AddInvitationForm from "@/components/dashboard/guests/add-invitation-form";
import InvitationTable, { InvitationTableSkeleton } from "@/components/dashboard/guests/invitation-table";
import { caller, HydrateClient, prefetch, trpc } from "@/trpc/server";
import { getTranslations } from "next-intl/server";
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
  const t = await getTranslations("dashboard.event")

  if (!event) {
    return notFound();
  }

  prefetch(trpc.invitation.get.infiniteQueryOptions({ eventId: event.id }));
  return (
    <HydrateClient>
      <div>
        <div className="flex items-center justify-between mb-4">
          <h1>{t("guests.guestsList")}</h1>
          <AddInvitationForm event={event} />
        </div>
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <Suspense fallback={<InvitationTableSkeleton />}>
          <InvitationTable event={event} />
        </Suspense>
      </ErrorBoundary>
      </div>
    </HydrateClient>
  );
}
