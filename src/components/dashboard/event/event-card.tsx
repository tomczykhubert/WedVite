import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Event } from "@prisma/client";
import { FilePlus } from "lucide-react";

export default function EventCard({event}: {event: Event}) {

  return (
    <Card key={event.id} className="h-full min-h-[300px]">
      <CardHeader>
        <CardTitle>
          <h2 className="m-0">{event.name}</h2>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {event.userId}
      </CardContent>
    </Card>
  )
}


export function EventCardSkeleton(props: { pulse?: boolean }) {
  const { pulse = true } = props;

  const lines = ["w-1/3", "w-4/5", "w-2/3", "w-1/4", "w-3/5"]
  return (
    <div className="flex flex-row rounded-lg bg-stone-900 p-4 h-full min-h-[300px]">
      <div className="flex-grow">
        <h2
          className={cn(
            "w-3/4 rounded bg-stone-800 text-2xl font-bold",
            pulse && "animate-pulse",
          )}
        >
          &nbsp;
        </h2>

        {lines.map((width, i) => (
          <p key={i}
          className={cn(
            `mt-2 w-${width} rounded bg-stone-700`,
            pulse && "animate-pulse",
            width
          )}
        >
          &nbsp;
        </p>
        ))}
      </div>
    </div>
  );
}