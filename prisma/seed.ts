import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient, Role } from "../generated/prisma/client";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || "file:./prisma/dev.db",
});

const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  const superAdmin = await prisma.user.create({
    data: {
      name: "Super Admin",
      email: "sarah.admin@example.com",
      role: Role.SUPER_ADMIN,
    },
  });

  const moderator = await prisma.user.create({
    data: {
      name: "Moderator",
      email: "mina.mod@example.com",
      role: Role.MODERATOR,
    },
  });

  const akib = await prisma.user.create({
    data: {
      name: "Akib Regular",
      email: "akib.user@example.com",
      role: Role.REGULAR_USER,
    },
  });

  const hasan = await prisma.user.create({
    data: {
      name: "Hasan Regular",
      email: "hasan.user@example.com",
      role: Role.REGULAR_USER,
    },
  });

  const guest = await prisma.user.create({
    data: {
      name: "Guest Visitor",
      email: "guest@example.com",
      role: Role.GUEST,
    },
  });

  const postOne = await prisma.post.create({
    data: {
      title: "Welcome to RoleBoard",
      content:
        "This post is created by Akib Regular. Other users can read it and regular users can comment on it.",
      authorId: akib.id,
    },
  });

  const postTwo = await prisma.post.create({
    data: {
      title: "Frontend permission preview",
      content:
        "This screen started as a frontend preview. Backend permission checks will be added in the next phase.",
      authorId: hasan.id,
    },
  });

  await prisma.comment.createMany({
    data: [
      {
        text: "Nice post. This comment was written by Hasan.",
        postId: postOne.id,
        authorId: hasan.id,
      },
      {
        text: "This is a sample comment for permission testing.",
        postId: postOne.id,
        authorId: akib.id,
      },
      {
        text: "Moderator and Super Admin should be able to delete this later.",
        postId: postTwo.id,
        authorId: akib.id,
      },
    ],
  });

  console.log("Database seeded successfully.");
  console.log("Users created:", {
    superAdmin: superAdmin.email,
    moderator: moderator.email,
    regularOne: akib.email,
    regularTwo: hasan.email,
    guest: guest.email,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });