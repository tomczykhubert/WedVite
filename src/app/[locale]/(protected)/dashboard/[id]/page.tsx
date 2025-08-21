import { useTRPC } from "@/trpc/client";
import { caller, trpc } from "@/trpc/server";
import ID from "@/types/id";
import { useQuery } from "@tanstack/react-query";
import { notFound } from "next/navigation";

export default async function EventPage({
  params,
}: {
  params: { id: string };
}) {
  const paramss = await params;
  const data = await caller.event.getById({ id: paramss.id });
  if (!data) {
    return notFound();
  }
  return <div>{data.name}</div>;
}
