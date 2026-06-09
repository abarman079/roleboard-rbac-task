import { prisma } from "@/lib/prisma";
import { apiError, apiSuccess, getCurrentUser } from "@/lib/currentUser";
import { canCreateComment } from "@/lib/permissions";

export async function POST(request) {
  const body = await request.json();
  const user = await getCurrentUser(request, body.userId);

  if (!user) {
    return apiError("User not found.", 401);
  }

  if (!canCreateComment(user)) {
    return apiError("Only Regular Users can create comments.", 403);
  }

  if (!body.text?.trim()) {
    return apiError("Comment text is required.");
  }

  const post = await prisma.post.findUnique({
    where: {
      id: Number(body.postId),
    },
  });

  if (!post) {
    return apiError("Post not found.", 404);
  }

  const comment = await prisma.comment.create({
    data: {
      text: body.text.trim(),
      postId: post.id,
      authorId: user.id,
    },
    include: {
      author: true,
      post: true,
    },
  });

  return apiSuccess(comment, 201);
}
