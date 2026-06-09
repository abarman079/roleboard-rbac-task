export function canCreatePost(user) {
  return user?.role === "REGULAR_USER";
}

export function canCreateComment(user) {
  return user?.role === "REGULAR_USER";
}

export function canUpdatePost(user, post) {
  return user?.role === "REGULAR_USER" && user.id === post.authorId;
}

export function canDeletePost(user, post) {
  if (user?.role === "SUPER_ADMIN") return true;
  if (user?.role === "MODERATOR") return true;
  if (user?.role === "REGULAR_USER" && user.id === post.authorId) return true;

  return false;
}

export function canDeleteComment(user, post, comment) {
  if (user?.role === "SUPER_ADMIN") return true;
  if (user?.role === "MODERATOR") return true;

  if (
    user?.role === "REGULAR_USER" &&
    (user.id === post.authorId || user.id === comment.authorId)
  ) {
    return true;
  }

  return false;
}