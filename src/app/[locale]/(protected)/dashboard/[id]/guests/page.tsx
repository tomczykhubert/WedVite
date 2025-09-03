"use client";

import { BaseLoader } from "@/components/base/loader";
import AddInvitationForm from "@/components/dashboard/guests/add-invitation-form";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { notFound, useParams } from "next/navigation";

export default function Guests() {
  const { id } = useParams();

  const trpc = useTRPC();
  const { data: event, isPending } = useQuery(
    trpc.event.getById.queryOptions({
      id: id as string,
    })
  );
  if (isPending) return <BaseLoader isLoading={isPending}></BaseLoader>;
  if (!event) return notFound();

  return (
    <div>
      <AddInvitationForm event={event} />
    </div>
  );
}
