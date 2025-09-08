"use client";

import { useTRPC } from "@/trpc/client";
import {
  AttendanceStatus,
  Guest,
  Invitation,
  InvitationStatus,
} from "@prisma/client";
import { useInfiniteQuery } from "@tanstack/react-query";
import React, { createContext, useContext, useEffect, useState } from "react";
export type InvitationWithGuests = Invitation & { guests: Guest[] };

interface InvitationsState {
  name?: string;
  attendanceStatus?: AttendanceStatus;
  invitationStatus?: InvitationStatus;
}

interface InvitationsContextType {
  filters: InvitationsState;
  setFilters: React.Dispatch<React.SetStateAction<InvitationsState>>;
  updateFilter: <K extends keyof InvitationsState>(
    key: K,
    value: InvitationsState[K]
  ) => void;
  hasActiveFilters: () => boolean;
  resetFilters: () => void;

  invitations: InvitationWithGuests[];

  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  isFetching: boolean;
  refetch: () => void;
}

const defaultState: InvitationsState = {
  name: undefined,
  attendanceStatus: undefined,
  invitationStatus: undefined,
};

const InvitationsContext = createContext<InvitationsContextType | undefined>(
  undefined
);

export const InvitationsProvider = ({
  children,
  eventId,
}: {
  children: React.ReactNode;
  eventId: string;
}) => {
  const [filters, setFilters] = useState<InvitationsState>(defaultState);
  const [invitations, setInvitations] = useState<InvitationWithGuests[]>([]);
  const trpc = useTRPC();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isFetching,
  } = useInfiniteQuery(
    trpc.invitation.get.infiniteQueryOptions(
      {
        eventId: eventId,
        ...filters,
      },
      { getNextPageParam: (lastPage) => lastPage.nextCursor }
    )
  );

  useEffect(() => {
    if (data?.pages) {
      setInvitations(data.pages.flatMap((p) => p.items));
    }
  }, [data]);

  const updateFilter = <K extends keyof InvitationsState>(
    key: K,
    value: InvitationsState[K]
  ) => {
    setFilters((prev) => {
      if (key === "name" && typeof value === "string" && value.trim() === "") {
        return { ...prev, [key]: undefined };
      }
      return { ...prev, [key]: value };
    });
  };

  const hasActiveFilters = () => {
    return Object.values(filters).some((value) => {
      if (typeof value === "string") {
        return value.trim() !== "";
      }
      return value !== undefined;
    });
  };

  const resetFilters = () => {
    setFilters(defaultState);
  };

  return (
    <InvitationsContext.Provider
      value={{
        filters,
        setFilters,
        updateFilter,
        hasActiveFilters,
        resetFilters,

        invitations,

        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isFetching,
        refetch,
      }}
    >
      {children}
    </InvitationsContext.Provider>
  );
};

export const useInvitations = () => {
  const context = useContext(InvitationsContext);
  if (!context) {
    throw new Error("useInvitations must be used within a InvitationsProvider");
  }
  return context;
};
