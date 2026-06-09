import { prisma } from "@/lib/prisma";
import { apiError, apiSuccess, getCurrentUser } from "@/lib/currentUser";
import { canCreatePost } from "@/lib/permissions";

export async function GET() {
  const posts = await prisma.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      author: true,
      comments: {
        orderBy: {
          createdAt: "asc",
        },
        include: {
          author: true,
        },
      },
    },
  });

  return apiSuccess(posts);
}

export async function POST(request) {
  const body = await request.json();
  const user = await getCurrentUser(request, body.userId);

  if (!user) {
    return apiError("User not found.", 401);
  }

  if (!canCreatePost(user)) {
    return apiError("Only Regular Users can create posts.", 403);
  }

  if (!body.title?.trim() || !body.content?.trim()) {
    return apiError("Post title and content are required.");
  }

  const post = await prisma.post.create({
    data: {
      title: body.title.trim(),
      content: body.content.trim(),
      authorId: user.id,
    },
    include: {
      author: true,
      comments: true,
    },
  });

  return apiSuccess(post, 201);
}