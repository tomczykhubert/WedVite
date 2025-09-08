import Invitations from "@/components/dashboard/guests/invitations";
import { caller, HydrateClient } from "@/trpc/server";
import ID from "@/types/id";
import { notFound } from "next/navigation";
import { ErrorBoundary } from "react-error-boundary";

export default async function Guests({
  params,
}: {
  params: Promise<{ id: ID }>;
}) {
  const { id } = await params;
  const event = await caller.event.getById({ id });

  if (!event) {
    return notFound();
  }

  return (
    <HydrateClient>
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <Invitations event={event} />
      </ErrorBoundary>
    </HydrateClient>
  );
}
