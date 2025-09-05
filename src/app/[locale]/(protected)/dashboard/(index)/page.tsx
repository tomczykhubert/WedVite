import AddEventForm from "@/components/dashboard/event/add-event-form";
import { EventCardSkeleton } from "@/components/dashboard/event/event-card";
import EventsList from "@/components/dashboard/event/events-list";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export default async function Dashboard() {
  prefetch(trpc.event.get.infiniteQueryOptions({}));

  return (
    <HydrateClient>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <AddEventForm />
        <ErrorBoundary fallback={<div>Something went wrong</div>}>
          <Suspense fallback={<EventCardSkeleton />}>
            <EventsList />
          </Suspense>
        </ErrorBoundary>
      </div>
    </HydrateClient>
  );
}
