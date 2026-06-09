import { prisma } from "@/lib/prisma";
import { apiError, apiSuccess, getCurrentUser } from "@/lib/currentUser";
import { canDeletePost, canUpdatePost } from "@/lib/permissions";

export async function PATCH(request, { params }) {
  const { id } = await params;
  const postId = Number(id);
  const body = await request.json();

  const user = await getCurrentUser(request, body.userId);

  if (!user) {
    return apiError("User not found.", 401);
  }

  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });

  if (!post) {
    return apiError("Post not found.", 404);
  }

  if (!canUpdatePost(user, post)) {
    return apiError("You can only update your own post.", 403);
  }

  if (!body.title?.trim() || !body.content?.trim()) {
    return apiError("Post title and content are required.");
  }

  const updatedPost = await prisma.post.update({
    where: {
      id: postId,
    },
    data: {
      title: body.title.trim(),
      content: body.content.trim(),
    },
  });

  return apiSuccess(updatedPost);
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  const postId = Number(id);

  const user = await getCurrentUser(request);

  if (!user) {
    return apiError("User not found.", 401);
  }

  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });

  if (!post) {
    return apiError("Post not found.", 404);
  }

  if (!canDeletePost(user, post)) {
    return apiError("You do not have permission to delete this post.", 403);
  }

  await prisma.post.delete({
    where: {
      id: postId,
    },
  });

  return apiSuccess({
    message: "Post deleted successfully.",
  });
}