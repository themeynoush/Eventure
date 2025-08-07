import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = "admin@example.com";
  const passwordHash = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: { email: adminEmail, name: "Admin", passwordHash, role: "ADMIN", profile: { create: {} } },
  });

  await prisma.event.create({
    data: {
      title: "Community Meetup",
      description: "Local community gathering",
      category: "community",
      startTime: new Date(Date.now() + 86400000),
      latitude: 37.7749,
      longitude: -122.4194,
      address: "San Francisco, CA",
      source: "INTERNAL",
      createdById: admin.id,
    },
  });

  console.log("Seed complete");
}

main().finally(async () => {
  await prisma.$disconnect();
});