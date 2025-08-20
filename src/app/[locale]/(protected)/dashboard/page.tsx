import AddEventForm from "@/components/dashboard/event/add-event-form";
import { EventCardSkeleton } from "@/components/dashboard/event/event-card";
import EventsList from "@/components/dashboard/event/events-list";
import { Suspense } from "react";

export default function Dashboard() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <AddEventForm />
      <EventsList />
    </div>
  );
}
