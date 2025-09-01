"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import ContactCard from "./contact-card";
import { Event } from "@prisma/client";
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  TouchSensor,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { toast } from "sonner";

export default function ContactsList({ event }: { event: Event }) {
  const t = useTranslations("base");
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: fetchedContacts } = useSuspenseQuery(
    trpc.contact.get.queryOptions({ eventId: event.id })
  );

  const [contacts, setContacts] = useState(fetchedContacts || []);

  useEffect(() => {
    if (fetchedContacts) {
      setContacts(fetchedContacts);
    }
  }, [fetchedContacts]);


  const updateOrderMutation = useMutation(trpc.contact.updateOrder.mutationOptions({
    onSuccess: async () => {
      queryClient.invalidateQueries(trpc.contact.pathFilter())
    },
    onError: () => {
      toast.error("Error updating order");
    },
  }));

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (dragEvent: DragEndEvent) => {
    const { active, over } = dragEvent;

    if (active.id !== over?.id) {
      const oldIndex = contacts.findIndex((contact) => contact.id === active.id);
      const newIndex = contacts.findIndex((contact) => contact.id === over?.id);

      const newOrder = arrayMove(contacts, oldIndex, newIndex);
      setContacts(newOrder);

      updateOrderMutation.mutate({
        contacts: newOrder.map((contact, index) => ({
          id: contact.id,
          order: index,
        })),
      });
    }
  };

  if (!contacts) return null;

  return (
    <DndContext
      id="contacts-dnd-context"
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToWindowEdges]}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={contacts.map((contact) => contact.id)}>
        {contacts.map((contact) => (
          <SortableContactCard key={contact.id} contact={contact} />
        ))}
      </SortableContext>
    </DndContext>
  );
}

function SortableContactCard({ contact }: { contact: any }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: contact.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 2 : 1,
  };
  const dragAttributes = { ...attributes, style: { cursor: 'grab', zIndex: 1 } };

  return (
    <div ref={setNodeRef} style={style}>
      <ContactCard contact={contact} dragListeners={listeners} dragAttributes={dragAttributes} />
    </div>
  );
}
