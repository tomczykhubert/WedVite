import AddContactForm from "@/components/dashboard/contact/add-contact-form";
import ContactsList from "@/components/dashboard/contact/contacts-list";
import { EventCardSkeleton } from "@/components/dashboard/event/event-card";
import AddPlanItemForm from "@/components/dashboard/plan-item/add-plan-item-form";
import PlanItemList from "@/components/dashboard/plan-item/plan-item-list";
import { caller, HydrateClient, prefetch, trpc } from "@/trpc/server";
import ID from "@/types/id";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export default async function EventPage({
  params,
}: {
  params: Promise<{ id: ID }>;
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
        <section className="mb-16">
          <div className="bg-muted p-4 rounded-lg mb-8 border-dashed border-2 border-accent">
            <h2>{t("planItems")}</h2>
            <p>{t("planItemsDescription")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 lg:gap-8">
            <AddPlanItemForm eventId={event.id} />
            <ErrorBoundary fallback={<div>Something went wrong</div>}>
              <Suspense fallback={<EventCardSkeleton />}>
                <PlanItemList event={event} />
              </Suspense>
            </ErrorBoundary>
          </div>
        </section>
        <section>
          <div className="bg-muted p-4 rounded-lg mb-8 border-dashed border-2 border-accent">
            <h2>{t("contacts")}</h2>
            <p>{t("contactsDescription")}</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 lg:gap-8">
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
  );
}
