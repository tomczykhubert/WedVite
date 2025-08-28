"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import React from "react";
import { useTranslations } from "next-intl";
import ContactCard from "./contact-card";
import { Event } from "@prisma/client";

export default function ContactsList({ event }: { event: Event }) {
  const t = useTranslations('base')
  const trpc = useTRPC();
  const { data: contacts } =
    useSuspenseQuery(
      trpc.contact.get.queryOptions({ eventId: event.id })
    );
  if (!contacts) return null;
  return (
    <>
      {contacts.map((contact) => (
        <ContactCard key={contact.id} contact={contact} />
      ))}
    </>
  );
}
