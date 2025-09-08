import Invitations from "@/components/dashboard/guests/invitations";
import { caller, HydrateClient } from "@/trpc/server";
import { notFound } from "next/navigation";
import { ErrorBoundary } from "react-error-boundary";

export default async function Guests({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await caller.event.getById({ id });
  // const t = await getTranslations("dashboard.event");

  if (!event) {
    return notFound();
  }

  // prefetch(trpc.invitation.get.infiniteQueryOptions({ eventId: event.id }));
  return (
    <HydrateClient>
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <Invitations event={event} />
      </ErrorBoundary>
    </HydrateClient>
  );
}
