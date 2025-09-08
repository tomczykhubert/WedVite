import { auth } from "@/lib/auth/auth";
import { PrismaClient } from "@prisma/client";

export interface UserSeedData {
  name: string;
  email: string;
  password: string;
  preferredLocale: string;
}

export const userSeedData: UserSeedData[] = [
  {
    name: "Alexander Thompson",
    email: "test@example.com",
    password: "Admin123!",
    preferredLocale: "en",
  },
];

export async function seedUsers(prisma: PrismaClient) {
  console.log("Seeding users...");

  const users = [];

  for (const userData of userSeedData) {
    const { user } = await auth.api.signUpEmail({
      body: userData,
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: true },
    });

    users.push(user);
  }

  console.log(`Created ${users.length} users`);
  return users;
}
