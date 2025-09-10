import { cn } from "@/lib/utils";
import { Card, CardContent } from "../ui/card";

export default function RSVPCard({
  message,
  className,
}: {
  message: string;
  className?: string;
}) {
  return (
    <div className="container mx-auto max-w-2xl p-4">
      <Card className="border-b bg-accent/40">
        <CardContent className={cn("text-center py-8", className)}>
          <h2>{message}</h2>
        </CardContent>
      </Card>
    </div>
  );
}
