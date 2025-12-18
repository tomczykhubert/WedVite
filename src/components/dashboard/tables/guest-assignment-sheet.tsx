"use client";

import { Loader } from "@/components/base/loader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Search, User, Users, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface GuestAssignmentSheetProps {
  seatId: string;
  eventId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function GuestAssignmentSheet({
  seatId,
  eventId,
  onClose,
  onSuccess,
}: GuestAssignmentSheetProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const { data, isLoading } = useQuery(
    trpc.invitation.get.queryOptions({
      eventId,
      name: search || undefined,
    })
  );

  const assignGuest = useMutation(
    trpc.table.assignGuestToSeat.mutationOptions({
      onSuccess: async (_, variables) => {
        await queryClient.invalidateQueries(trpc.table.pathFilter());
        await queryClient.invalidateQueries(trpc.invitation.pathFilter());
        toast.success(variables.guestId ? "Guest assigned" : "Seat cleared");
        onSuccess();
        onClose();
      },
      onError: () => {
        toast.error("Failed to assign guest");
      },
      onMutate: async () => {
        setLoading(true);
      },
      onSettled: async () => {
        setLoading(false);
      },
    })
  );

  const handleAssignGuest = (guestId: string | null) => {
    assignGuest.mutate({ seatId, guestId });
  };

  return (
    <>
      <Loader isLoading={loading} />
      <Sheet open onOpenChange={onClose}>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Assign Guest to Seat</SheetTitle>
            <SheetDescription>
              Select a guest from the list or clear the seat
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search invitations or guests..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleAssignGuest(null)}
              disabled={loading}
            >
              <X className="h-4 w-4 mr-2" />
              Clear Seat
            </Button>

            <ScrollArea className="h-[calc(100vh-280px)]">
              {isLoading ? (
                <Loader isLoading={isLoading} />
              ) : (
                <div className="space-y-4">
                  {data?.items.map((invitation) => (
                    <div
                      key={invitation.id}
                      className="border rounded-lg p-4 space-y-2"
                    >
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <h3 className="font-semibold">{invitation.name}</h3>
                        <Badge variant="outline">{invitation.status}</Badge>
                      </div>

                      <div className="space-y-2 pl-6">
                        {invitation.guests.map((guest) => (
                          <Button
                            key={guest.id}
                            variant="ghost"
                            className="w-full justify-start h-auto py-2"
                            onClick={() => handleAssignGuest(guest.id)}
                            disabled={guest.status === "DECLINED" || loading}
                          >
                            <div className="flex items-center gap-3 w-full">
                              <User className="h-4 w-4" />
                              <div className="flex-1 text-left">
                                <div className="font-medium">{guest.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {guest.type} • {guest.status}
                                  {guest.seat && (
                                    <span className="ml-2 text-orange-600">
                                      (Already seated)
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}

                  {data?.items.length === 0 && (
                    <div className="text-center text-muted-foreground py-8">
                      No guests found
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
