import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { routes } from "@/lib/routes/routes";
import { cn } from "@/lib/utils";
import { Event } from "@prisma/client";
import { FilePlus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function EventCard({ event }: { event: Event }) {
  return (
    <Link href={routes.dashboard.event.byId(event.id)}>
      <Card
        key={event.id}
        className="h-full min-h-[300px] relative overflow-hidden py-0"
      >
        {/* Background image with blur effect */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/venue.jpg"
            alt="Venue background"
            fill
            className="object-cover blur-[2px] brightness-50"
            priority
          />
        </div>
        {/* Content with glass effect */}
        <div className="relative z-10 h-full backdrop-blur-sm hover:backdrop-blur-md transition-all">
          <div className="py-6">
            <CardHeader>
              <CardTitle>
                <h2 className="m-0 text-white">{event.name}</h2>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-white/80">{event.userId}</CardContent>
          </div>
        </div>
      </Card>
    </Link>
  );
}

export function EventCardSkeleton(props: { pulse?: boolean }) {
  const { pulse = true } = props;

  const lines = ["w-1/3", "w-4/5", "w-2/3", "w-1/4", "w-3/5"];
  return (
    <div className="flex flex-row rounded-lg bg-muted p-4 h-full min-h-[300px]">
      <div className="flex-grow">
        <h2
          className={cn(
            "w-3/4 rounded bg-accent text-2xl font-bold",
            pulse && "animate-pulse"
          )}
        >
          &nbsp;
        </h2>

        {lines.map((width, i) => (
          <p
            key={i}
            className={cn(
              `mt-2 w-${width} rounded bg-accent`,
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
