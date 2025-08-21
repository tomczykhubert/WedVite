import { caller } from "@/trpc/server";
import { notFound } from "next/navigation";

export default async function EventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await caller.event.getById({ id });
  if (!data) {
    return notFound();
  }
  return <div>{data.name}</div>;
}
