import { EventContactType, PrismaClient } from "@prisma/client";

export interface EventContactSeedData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  type?: EventContactType;
  order: number;
}

export interface NotificationSettingsSeedData {
  onImageUpload: boolean;
  onAttendanceRespond: boolean;
}

export interface EventSeedData {
  name: string;
  respondStart?: Date;
  respondEnd?: Date;
  contacts: EventContactSeedData[];
  notificationSettings: NotificationSettingsSeedData;
}

export const eventSeedData: EventSeedData[] = [
  {
    name: "Sarah & Michael's Wedding Extravaganza",
    respondStart: new Date(),
    respondEnd: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days
    contacts: [
      {
        firstName: "Sarah",
        lastName: "Thompson",
        phoneNumber: "+1-555-0101",
        email: "sarah.thompson@example.com",
        type: EventContactType.BRIDE,
        order: 0,
      },
      {
        firstName: "Michael",
        lastName: "Johnson",
        phoneNumber: "+1-555-0102",
        email: "michael.johnson@example.com",
        type: EventContactType.GROOM,
        order: 1,
      },
      {
        firstName: "Emma",
        lastName: "Wilson",
        phoneNumber: "+1-555-0103",
        email: "emma.wilson@example.com",
        type: EventContactType.MAID_OF_HONOR,
        order: 2,
      },
      {
        firstName: "James",
        lastName: "Davis",
        phoneNumber: "+1-555-0104",
        email: "james.davis@example.com",
        type: EventContactType.BEST_MAN,
        order: 3,
      },
      {
        firstName: "Robert",
        lastName: "Smith",
        phoneNumber: "+1-555-0105",
        email: "robert.smith@example.com",
        order: 4,
      },
    ],
    notificationSettings: {
      onImageUpload: true,
      onAttendanceRespond: true,
    },
  },
  {
    name: "Corporate Annual Gala 2025",
    respondStart: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days
    respondEnd: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 days
    contacts: [
      {
        firstName: "Jennifer",
        lastName: "Adams",
        phoneNumber: "+1-555-0201",
        email: "jennifer.adams@company.com",
        order: 0,
      },
      {
        firstName: "David",
        lastName: "Brown",
        phoneNumber: "+1-555-0202",
        email: "david.brown@company.com",
        order: 1,
      },
    ],
    notificationSettings: {
      onImageUpload: false,
      onAttendanceRespond: true,
    },
  },
  {
    name: "Family Reunion BBQ",
    respondStart: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago (edge case)
    respondEnd: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days
    contacts: [
      {
        firstName: "Margaret",
        lastName: "Thompson",
        phoneNumber: "+1-555-0301",
        email: "margaret.thompson@example.com",
        order: 0,
      },
    ],
    notificationSettings: {
      onImageUpload: true,
      onAttendanceRespond: false,
    },
  },
  {
    name: "Milestone Birthday Celebration",
    // No respond dates (edge case)
    contacts: [
      {
        firstName: "Alexander",
        lastName: "Thompson",
        phoneNumber: "+1-555-0401",
        email: "alex.thompson@example.com",
        order: 0,
      },
    ],
    notificationSettings: {
      onImageUpload: false,
      onAttendanceRespond: false,
    },
  },
];

export async function seedEvents(prisma: PrismaClient, userId: string) {
  console.log("Seeding events...");

  const events = [];

  for (const eventData of eventSeedData) {
    const event = await prisma.event.create({
      data: {
        name: eventData.name,
        userId,
        respondStart: eventData.respondStart,
        respondEnd: eventData.respondEnd,
        eventContacts: {
          create: eventData.contacts,
        },
        notificationSettings: {
          create: eventData.notificationSettings,
        },
      },
      include: {
        eventContacts: true,
        notificationSettings: true,
      },
    });

    events.push(event);
  }

  console.log(`Created ${events.length} events`);
  return events;
}
