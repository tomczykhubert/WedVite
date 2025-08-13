import { Specification } from "@/lib/prisma/specification";
import Event from "@/types/event";
import ID from "@/types/id";
import { Event as PrismaEvent } from "@prisma/client";
import { BaseRepository } from "./baseRepository";

class EventRepository extends BaseRepository<Event, PrismaEvent> {
  constructor() {
    super("event");
  }

  protected getIncludeRelations(): Record<string, boolean> | undefined {
    return {
      addresses: true,
      contactInfos: true,
    };
  }
}

const eventRepository = new EventRepository();

export async function createEvent(event: Event): Promise<Event> {
  return eventRepository.create(event);
}

export async function getEvents(
  specification?: Specification<Event>
): Promise<Event[]> {
  return eventRepository.getAll(specification);
}

export async function updateEvent(
  id: ID,
  data: Partial<Event>
): Promise<Event> {
  return eventRepository.update(id, data);
}

export async function deleteEvent(id: ID): Promise<void> {
  return eventRepository.delete(id);
}

export async function getEvent(id: ID): Promise<Event> {
  return eventRepository.getById(id);
}
