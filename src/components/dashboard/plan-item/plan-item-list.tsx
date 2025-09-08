"use client";

import { useTRPC } from "@/trpc/client";
import { Event } from "@prisma/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import PlanItemCard from "./plan-item-card";

export default function PlanItemList({ event }: { event: Event }) {
  const trpc = useTRPC();
  const { data: planItems } = useSuspenseQuery(
    trpc.planItem.get.queryOptions({ eventId: event.id })
  );
  if (!planItems) return null;
  return (
    <>
      {planItems.map((planItem) => (
        <PlanItemCard key={planItem.id} planItem={planItem} />
      ))}
    </>
  );
}
