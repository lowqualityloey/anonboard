import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const DEFAULT_BOARDS = [
  {
    name: "General",
    slug: "general",
    description: "General discussion about anything and everything.",
  },
  {
    name: "Study",
    slug: "study",
    description: "Homework help, study groups, and academic resources.",
  },
  {
    name: "Random",
    slug: "random",
    description: "Memes, shower thoughts, and casual off-topic banter.",
  },
];

async function main() {
  console.log("Seeding default boards...");

  for (const board of DEFAULT_BOARDS) {
    await prisma.board.upsert({
      where: { slug: board.slug },
      update: {},
      create: board,
    });
    console.log(`- Upserted board: /b/${board.slug}`);
  }

  console.log("Seeding complete.");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
