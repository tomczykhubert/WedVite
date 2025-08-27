import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { EventContact } from "@prisma/client";

export default function ContactCard({ contact }: { contact: EventContact }) {
  return (
    <Card
      key={contact.id}
      className="h-full min-h-[300px] relative overflow-hidden py-0"
    >
      <CardHeader>
        <CardTitle>
          <h2 className="m-0 whitespace-normal [overflow-wrap:anywhere]">
            {contact.firstName} {contact.lastName}
          </h2>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          {contact.email}
        </div>
        <div>
          {contact.phoneNumber}
        </div>
      </CardContent>
    </Card>
  );
}

export function ContactCardSkeleton(props: { pulse?: boolean }) {
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
