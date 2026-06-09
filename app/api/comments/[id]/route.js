import { prisma } from "@/lib/prisma";
import { apiError, apiSuccess, getCurrentUser } from "@/lib/currentUser";
import { canDeleteComment } from "@/lib/permissions";

export async function DELETE(request, { params }) {
  const { id } = await params;
  const commentId = Number(id);

  const user = await getCurrentUser(request);

  if (!user) {
    return apiError("User not found.", 401);
  }

  const comment = await prisma.comment.findUnique({
    where: {
      id: commentId,
    },
    include: {
      post: true,
    },
  });

  if (!comment) {
    return apiError("Comment not found.", 404);
  }

  if (!canDeleteComment(user, comment.post, comment)) {
    return apiError("You do not have permission to delete this comment.", 403);
  }

  await prisma.comment.delete({
    where: {
      id: commentId,
    },
  });

  return apiSuccess({
    message: "Comment deleted successfully.",
  });
}