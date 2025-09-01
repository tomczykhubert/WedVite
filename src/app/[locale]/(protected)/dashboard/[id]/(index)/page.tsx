import AddContactForm from "@/components/dashboard/contact/add-contact-form";
import ContactsList from "@/components/dashboard/contact/contacts-list";
import { EventCardSkeleton } from "@/components/dashboard/event/event-card";
import AddPlanItemForm from "@/components/dashboard/plan-item/add-plan-item-form";
import PlanItemList from "@/components/dashboard/plan-item/plan-item-list";
import { caller, HydrateClient, prefetch, trpc } from "@/trpc/server";
import { getTranslations } from "next-intl/server";
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
  const t = await getTranslations("dashboard.event");
  if (!event) {
    return notFound();
  }

  prefetch(trpc.contact.get.queryOptions({ eventId: event.id }));
  prefetch(trpc.planItem.get.queryOptions({ eventId: event.id }));
  return (
  <HydrateClient>
    <div>
      <section>
        <h2>{t("planItems")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          <AddPlanItemForm eventId={event.id} />
          <ErrorBoundary fallback={<div>Something went wrong</div>}>
            <Suspense fallback={<EventCardSkeleton />}>
              <PlanItemList event={event} />
            </Suspense>
          </ErrorBoundary>
        </div>
      </section>
      <section>
        <h2>{t("contacts")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
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
