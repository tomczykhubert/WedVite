import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/trpc/server";

export default async function EventsCards() {
  const events = await trpc.event.get();

  return events?.map((event) => (
    <Card className="mx-4" key={event.id}>
      <CardHeader>
        <CardTitle>
          <h1 className="text-center m-0">{event.name}</h1>
        </CardTitle>
      </CardHeader>
      <CardContent>{event.userId}</CardContent>
    </Card>
  ));
}
