import { prisma } from "@/lib/prisma";
import { apiSuccess } from "@/lib/currentUser";

export async function GET() {
  const users = await prisma.user.findMany({
    orderBy: {
      id: "asc",
    },
  });

  return apiSuccess(users);
}