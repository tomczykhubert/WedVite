import { PrismaClient } from "@prisma/client";

export interface EventPlanItemSeedData {
  name: string;
  description?: string;
  startAt: Date;
  endAt?: Date;
  details?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  postalCode: string;
  region?: string;
  country?: string;
}

// Plan items for each event (indexed by event order)
export const eventPlanItemsSeedData: Record<number, EventPlanItemSeedData[]> = {
  0: [
    // Wedding event
    {
      name: "Wedding Ceremony",
      description: "Sacred union ceremony in the beautiful garden chapel",
      startAt: new Date(Date.now() + 70 * 24 * 60 * 60 * 1000), // 70 days
      endAt: new Date(Date.now() + 70 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000), // 1.5 hours
      details:
        "Please arrive 45 minutes early. Outdoor ceremony weather permitting. Umbrellas provided if needed.",
      addressLine1: "Garden Chapel of St. Augustine",
      addressLine2: "1247 Harmony Drive",
      city: "Napa Valley",
      postalCode: "94558",
      region: "California",
      country: "US",
    },
    {
      name: "Cocktail Hour",
      description: "Welcome drinks and canapés",
      startAt: new Date(
        Date.now() + 70 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000
      ), // 2 hours after ceremony
      endAt: new Date(
        Date.now() + 70 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000
      ), // 1 hour duration
      details: "Signature cocktails and hors d'oeuvres on the vineyard terrace",
      addressLine1: "Sunset Vineyard Terrace",
      addressLine2: "Same venue as ceremony",
      city: "Napa Valley",
      postalCode: "94558",
      region: "California",
      country: "US",
    },
    {
      name: "Wedding Reception & Dinner",
      description: "Three-course dinner, dancing, and celebration",
      startAt: new Date(
        Date.now() + 70 * 24 * 60 * 60 * 1000 + 3.5 * 60 * 60 * 1000
      ),
      endAt: new Date(
        Date.now() + 70 * 24 * 60 * 60 * 1000 + 11 * 60 * 60 * 1000
      ), // 7.5 hours duration
      details:
        "Black tie optional. Live band from 8 PM. Late night snacks at 11 PM.",
      addressLine1: "Grand Ballroom",
      addressLine2: "Château Élegance",
      city: "Napa Valley",
      postalCode: "94558",
      region: "California",
      country: "US",
    },
    {
      name: "After Party",
      description: "Casual drinks and dancing",
      startAt: new Date(
        Date.now() + 70 * 24 * 60 * 60 * 1000 + 11.5 * 60 * 60 * 1000
      ),
      // No end time (edge case)
      details: "Open bar, DJ, pool area open. Casual attire welcome.",
      addressLine1: "Pool Deck & Lounge",
      city: "Napa Valley",
      postalCode: "94558",
      region: "California",
      country: "US",
    },
    {
      name: "Farewell Brunch",
      description: "Next day farewell gathering",
      startAt: new Date(
        Date.now() + 71 * 24 * 60 * 60 * 1000 + 10 * 60 * 60 * 1000
      ), // Next day 10 AM
      endAt: new Date(
        Date.now() + 71 * 24 * 60 * 60 * 1000 + 13 * 60 * 60 * 1000
      ), // 3 hours
      details: "Continental breakfast and mimosas. Share memories and photos!",
      addressLine1: "Garden Pavilion",
      addressLine2: "Hotel Vineyard Resort",
      city: "Napa Valley",
      postalCode: "94559",
      region: "California",
      country: "US",
    },
  ],
  1: [
    // Corporate gala
    {
      name: "VIP Reception",
      description: "Executive networking hour",
      startAt: new Date(
        Date.now() + 35 * 24 * 60 * 60 * 1000 + 17 * 60 * 60 * 1000
      ), // 5 PM
      endAt: new Date(
        Date.now() + 35 * 24 * 60 * 60 * 1000 + 18 * 60 * 60 * 1000
      ),
      details: "By invitation only. Business formal attire.",
      addressLine1: "Executive Boardroom",
      addressLine2: "Pinnacle Tower, 45th Floor",
      city: "Manhattan",
      postalCode: "10001",
      region: "New York",
      country: "US",
    },
    {
      name: "Annual Gala Dinner",
      description: "Awards ceremony and networking dinner",
      startAt: new Date(
        Date.now() + 35 * 24 * 60 * 60 * 1000 + 19 * 60 * 60 * 1000
      ),
      endAt: new Date(
        Date.now() + 35 * 24 * 60 * 60 * 1000 + 23 * 60 * 60 * 1000
      ),
      details: "Black tie event. Award presentations at 9 PM.",
      addressLine1: "Metropolitan Ballroom",
      addressLine2: "Grand Plaza Hotel",
      city: "Manhattan",
      postalCode: "10001",
      region: "New York",
      country: "US",
    },
  ],
  2: [
    // Family reunion
    {
      name: "Family BBQ & Games",
      description: "All-day family gathering",
      startAt: new Date(
        Date.now() + 25 * 24 * 60 * 60 * 1000 + 11 * 60 * 60 * 1000
      ), // 11 AM
      endAt: new Date(
        Date.now() + 25 * 24 * 60 * 60 * 1000 + 20 * 60 * 60 * 1000
      ), // 8 PM
      details:
        "Bring lawn chairs and sunscreen. Activities for all ages. Pet-friendly event.",
      addressLine1: "Riverside Park Pavilion",
      addressLine2: "1500 River Road",
      city: "Austin",
      postalCode: "78701",
      region: "Texas",
      country: "US",
    },
  ],
  3: [
    // Birthday celebration
    {
      name: "Surprise Birthday Party",
      description: "50th Birthday Celebration",
      startAt: new Date(
        Date.now() + 15 * 24 * 60 * 60 * 1000 + 18 * 60 * 60 * 1000
      ), // 6 PM
      endAt: new Date(
        Date.now() + 15 * 24 * 60 * 60 * 1000 + 22 * 60 * 60 * 1000
      ),
      details: "SURPRISE PARTY! Please arrive by 5:45 PM. Casual dress code.",
      addressLine1: "Thompson Family Home",
      addressLine2: "742 Maple Street",
      city: "Portland",
      postalCode: "97201",
      region: "Oregon",
      country: "US",
    },
  ],
};

export async function seedEventPlanItems(prisma: PrismaClient, events: any[]) {
  console.log("Seeding event plan items...");

  let totalPlanItems = 0;

  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    const planItemsData = eventPlanItemsSeedData[i] || [];

    if (planItemsData.length > 0) {
      await prisma.eventPlanItem.createMany({
        data: planItemsData.map((item) => ({
          ...item,
          eventId: event.id,
        })),
      });

      totalPlanItems += planItemsData.length;
    }
  }

  console.log(`Created ${totalPlanItems} event plan items`);
}
