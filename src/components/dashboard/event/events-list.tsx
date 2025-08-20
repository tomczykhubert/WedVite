"use client"

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import EventCard, { EventCardSkeleton } from "./event-card";

export default function EventsList() {
  const trpc = useTRPC();
  const { data: events } = useQuery(trpc.event.get.queryOptions());

  if (!events) return [...Array(7)].map((e, i) => <EventCardSkeleton key={i} />)

  return (<>
    {events.map((e) => {
      return <EventCard key={e.id} event={e} />;
    })}
  </>
  );
}
