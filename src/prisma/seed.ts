import { auth } from "@/lib/auth/auth";
import prisma from "@/lib/prisma/prisma";
import {
  AttendanceStatus,
  EventContactType,
  Gender,
  GuestType,
  InvitationStatus,
} from "@prisma/client";

async function main() {
  console.log("Starting database seeding...");

  // Clean up existing data if needed
  await prisma.guest.deleteMany();
  await prisma.invitation.deleteMany();
  await prisma.notificationSettings.deleteMany();
  await prisma.eventContact.deleteMany();
  await prisma.eventPlanItem.deleteMany();
  await prisma.event.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  // Create test users
  const { user: testUser1 } = await auth.api.signUpEmail({
    body: {
      name: "Test User",
      email: "test@example.com",
      password: "Admin123!",
      preferredLocale: "en",
    },
  });

  await prisma.user.update({
    where: {
      id: testUser1.id,
    },
    data: {
      emailVerified: true,
    },
  });

  const { user: testUser2 } = await auth.api.signUpEmail({
    body: {
      name: "Anna Kowalska",
      email: "anna@example.com",
      password: "Admin123!",
      preferredLocale: "pl",
    },
  });
  await prisma.user.update({
    where: {
      id: testUser2.id,
    },
    data: {
      emailVerified: true,
    },
  });

  // Create events for the first user
  const weddingEvent = await prisma.event.create({
    data: {
      name: "Our Wedding",
      userId: testUser1.id,
      respondStart: new Date(),
      respondEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    },
  });

  // Create notification settings for the event
  await prisma.notificationSettings.create({
    data: {
      eventId: weddingEvent.id,
      onImageUpload: true,
      onAttendanceRespond: true,
    },
  });

  // Create event contacts
  await prisma.eventContact.create({
    data: {
      firstName: "John",
      lastName: "Doe",
      phoneNumber: "+48123456789",
      email: "john@example.com",
      type: EventContactType.GROOM,
      eventId: weddingEvent.id,
      order: 1,
    },
  });

  await prisma.eventContact.create({
    data: {
      firstName: "Jane",
      lastName: "Doe",
      phoneNumber: "+48987654321",
      email: "jane@example.com",
      type: EventContactType.BRIDE,
      eventId: weddingEvent.id,
      order: 0,
    },
  });

  // Create event plan items
  await prisma.eventPlanItem.create({
    data: {
      name: "Wedding Ceremony",
      description: "The official wedding ceremony",
      startAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
      endAt: new Date(
        Date.now() + 60 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000
      ), // 2 hours after start
      details: "Please arrive 30 minutes before the ceremony starts",
      addressLine1: "St. Mary's Church",
      addressLine2: "123 Wedding Street",
      city: "Warsaw",
      postalCode: "00-001",
      region: "Mazowieckie",
      country: "PL",
      eventId: weddingEvent.id,
    },
  });

  await prisma.eventPlanItem.create({
    data: {
      name: "Wedding Reception",
      description: "Dinner and celebration",
      startAt: new Date(
        Date.now() + 60 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000
      ), // 3 hours after ceremony
      endAt: new Date(
        Date.now() + 60 * 24 * 60 * 60 * 1000 + 10 * 60 * 60 * 1000
      ), // 7 hours after reception start
      details: "Smart casual dress code",
      addressLine1: "Grand Hotel",
      addressLine2: "456 Reception Avenue",
      city: "Warsaw",
      postalCode: "00-002",
      region: "Mazowieckie",
      country: "PL",
      eventId: weddingEvent.id,
    },
  });

  // Create invitations
  const invitation1 = await prisma.invitation.create({
    data: {
      name: "Smith Family",
      status: InvitationStatus.CREATED,
      eventId: weddingEvent.id,
    },
  });

  const invitation2 = await prisma.invitation.create({
    data: {
      name: "Johnson Family",
      status: InvitationStatus.DELIVERED,
      eventId: weddingEvent.id,
    },
  });

  const invitation3 = await prisma.invitation.create({
    data: {
      name: "Williams Family",
      status: InvitationStatus.ANSWERED,
      responseDate: new Date(),
      eventId: weddingEvent.id,
    },
  });

  // Create guests for invitations
  await prisma.guest.create({
    data: {
      name: "Robert Smith",
      status: AttendanceStatus.PENDING,
      gender: Gender.MALE,
      type: GuestType.ADULT,
      invitationId: invitation1.id,
    },
  });

  await prisma.guest.create({
    data: {
      name: "Mary Smith",
      status: AttendanceStatus.PENDING,
      gender: Gender.FEMALE,
      type: GuestType.ADULT,
      invitationId: invitation1.id,
    },
  });

  await prisma.guest.create({
    data: {
      name: "Michael Johnson",
      status: AttendanceStatus.PENDING,
      gender: Gender.MALE,
      type: GuestType.ADULT,
      invitationId: invitation2.id,
    },
  });

  await prisma.guest.create({
    data: {
      name: "Sarah Johnson",
      status: AttendanceStatus.PENDING,
      gender: Gender.FEMALE,
      type: GuestType.ADULT,
      invitationId: invitation2.id,
    },
  });

  await prisma.guest.create({
    data: {
      name: "Emma Johnson",
      status: AttendanceStatus.PENDING,
      gender: Gender.FEMALE,
      type: GuestType.CHILD,
      invitationId: invitation2.id,
    },
  });

  await prisma.guest.create({
    data: {
      name: "David Williams",
      status: AttendanceStatus.CONFIRMED,
      gender: Gender.MALE,
      type: GuestType.ADULT,
      respondedAt: new Date(),
      invitationId: invitation3.id,
    },
  });

  await prisma.guest.create({
    data: {
      name: "Lisa Williams",
      status: AttendanceStatus.DECLINED,
      gender: Gender.FEMALE,
      type: GuestType.ADULT,
      respondedAt: new Date(),
      invitationId: invitation3.id,
    },
  });

  // Create a second event for the first user
  const birthdayEvent = await prisma.event.create({
    data: {
      name: "Birthday Party",
      userId: testUser1.id,
      respondStart: new Date(),
      respondEnd: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  // Create event plan item for birthday
  await prisma.eventPlanItem.create({
    data: {
      name: "Birthday Celebration",
      description: "Annual birthday party",
      startAt: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 days from now
      endAt: new Date(
        Date.now() + 20 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000
      ), // 4 hours after start
      details: "Casual attire, gifts optional",
      addressLine1: "Home",
      addressLine2: "789 Birthday Lane",
      city: "New York",
      postalCode: "00-003",
      region: "New York",
      country: "US",
      eventId: birthdayEvent.id,
    },
  });

  // Create an event for the second user
  const anniversaryEvent = await prisma.event.create({
    data: {
      name: "Anniversary Dinner",
      userId: testUser2.id,
      respondStart: new Date(),
      respondEnd: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  // Create event plan item for anniversary
  await prisma.eventPlanItem.create({
    data: {
      name: "Anniversary Dinner",
      description: "5th Anniversary Celebration",
      startAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
      endAt: new Date(
        Date.now() + 15 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000
      ), // 3 hours after start
      details: "Formal attire required",
      addressLine1: "Luxury Restaurant",
      addressLine2: "101 Fine Dining Street",
      city: "Krakow",
      postalCode: "30-001",
      region: "Małopolskie",
      country: "PL",
      eventId: anniversaryEvent.id,
    },
  });

  console.log("Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
