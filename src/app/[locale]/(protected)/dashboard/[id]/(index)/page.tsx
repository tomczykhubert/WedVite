import AddContactForm from "@/components/dashboard/contact/add-contact-form";
import ContactsList from "@/components/dashboard/contact/contacts-list";
import { EventCardSkeleton } from "@/components/dashboard/event/event-card";
import { caller, HydrateClient, prefetch, trpc } from "@/trpc/server";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export default async function EventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await caller.event.getById({ id });
  if (!event) {
    return notFound();
  }

  prefetch(trpc.contact.get.queryOptions({ eventId: event.id }));
  return (
  <HydrateClient>
    <div>
      <section>
        <h2>plan items</h2>
        <div className="item"></div>
        <div className="item"></div>
        <div className="item"></div>
        <div className="item"></div>
      </section>
      <section>
        <h2>contact</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AddContactForm eventId={event.id} />
          <ErrorBoundary fallback={<div>Something went wrong</div>}>
            <Suspense fallback={<EventCardSkeleton />}>
              <ContactsList event={event} />
            </Suspense>
          </ErrorBoundary>
        </div>
      </section>
    </div>
  </HydrateClient>
  )
}
