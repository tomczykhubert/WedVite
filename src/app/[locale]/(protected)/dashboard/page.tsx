import AddEventForm from "@/components/dashboard/event/add-event-form";
import EventsCards from "@/components/dashboard/event/events-cards";

export default async function Dashboard() {
  return (
    <>
      <EventsCards />
      <AddEventForm/>
    </>
  );
}
