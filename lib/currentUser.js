import { NextResponse } from "next/server";
import { prisma } from "./prisma";

export async function getCurrentUser(request, bodyUserId) {
  const url = new URL(request.url);
  const queryUserId = url.searchParams.get("userId");
  const userId = Number(bodyUserId || queryUserId);

  if (!userId) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  return user;
}

export function apiError(message, status = 400) {
  return NextResponse.json(
    {
      success: false,
      message,
    },
    {
      status,
    },
  );
}

export function apiSuccess(data, status = 200) {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    {
      status,
    },
  );
}