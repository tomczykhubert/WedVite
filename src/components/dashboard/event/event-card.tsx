import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Event } from "@prisma/client";

export default async function EventsCards({event}: {event: Event}) {

  return (
    <Card className="mx-4" key={event.id}>
      <CardHeader>
        <CardTitle>
          <h1 className="text-center m-0">{event.name}</h1>
        </CardTitle>
      </CardHeader>
      <CardContent>{event.userId}</CardContent>
    </Card>
  )
}
