import prisma from "@/lib/prisma/prisma";
import { seedEventPlanItems } from "./eventPlanItems";
import { seedEvents } from "./events";
import { seedInvitationsAndGuests } from "./invitationsAndGuests";
import { seedUsers } from "./users";

async function cleanDatabase() {
  console.log("Cleaning existing data...");

  // Clean up in reverse dependency order
  await prisma.guest.deleteMany();
  await prisma.invitation.deleteMany();
  await prisma.notificationSettings.deleteMany();
  await prisma.eventContact.deleteMany();
  await prisma.eventPlanItem.deleteMany();
  await prisma.event.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  console.log("Database cleaned successfully");
}

async function main() {
  console.log("🌱 Starting comprehensive database seeding...");
  console.log("=".repeat(50));

  try {
    // Clean existing data
    await cleanDatabase();

    // Seed users
    const users = await seedUsers(prisma);
    const mainUser = users[0]; // Use the first user for all events

    // Seed events with nested contacts and notification settings
    const events = await seedEvents(prisma, mainUser.id);

    // Seed event plan items
    await seedEventPlanItems(prisma, events);

    // Seed invitations and guests
    await seedInvitationsAndGuests(prisma, events);

    console.log("=".repeat(50));
    console.log("🎉 Database seeding completed successfully!");
    console.log(`📊 Summary:`);
    console.log(`   Users: ${users.length}`);
    console.log(`   Events: ${events.length}`);
    console.log(`   User: ${mainUser.name} (${mainUser.email})`);
    console.log("=".repeat(50));
  } catch (error) {
    console.error("❌ Error during seeding:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error("💥 Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log("🔌 Database connection closed");
  });
