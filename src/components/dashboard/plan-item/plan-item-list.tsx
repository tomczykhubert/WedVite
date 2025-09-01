"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import React from "react";
import { useTranslations } from "next-intl";
import { Event } from "@prisma/client";
import PlanItemCard from "./plan-item-card";

export default function PlanItemList({ event }: { event: Event }) {
  const t = useTranslations('base')
  const trpc = useTRPC();
  const { data: planItems } =
    useSuspenseQuery(
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
