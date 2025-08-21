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
  return <div>

    <section>
      <h2>plan items</h2>
      <div className="item"></div>
      <div className="item"></div>
      <div className="item"></div>
      <div className="item"></div>
    </section>
    <section>
      <h2>constacts</h2>
      <div className="contact"></div>
      <div className="contact"></div>
      <div className="contact"></div>
      <div className="contact"></div>
    </section>
  </div>;
}
