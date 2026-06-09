"use client";

import { useState } from "react";
import {
  IconFileText,
  IconLayoutDashboard,
  IconMessage,
  IconShield,
} from "@tabler/icons-react";

const users = [
  {
    id: 1,
    name: "Sarah Admin",
    shortName: "SA",
    role: "Super Admin",
    email: "sarah.admin@example.com",
  },
  {
    id: 2,
    name: "Mina Moderator",
    shortName: "MM",
    role: "Moderator",
    email: "mina.mod@example.com",
  },
  {
    id: 3,
    name: "Akib Regular",
    shortName: "AR",
    role: "Regular User",
    email: "akib.user@example.com",
  },
  {
    id: 4,
    name: "Guest Visitor",
    shortName: "GV",
    role: "Guest",
    email: "guest@example.com",
  },
];

const roleCards = [
  {
    role: "Super Admin",
    title: "Full delete access",
    text: "Can delete any post or comment in the system.",
  },
  {
    role: "Moderator",
    title: "Content moderation",
    text: "Can delete any post or comment, but cannot manage users.",
  },
  {
    role: "Regular User",
    title: "Post and comment access",
    text: "Can create posts and comments, and update or delete only own posts.",
  },
  {
    role: "Guest",
    title: "Read only access",
    text: "Can only view posts and comments.",
  },
];

const startingPosts = [
  {
    id: 1,
    title: "Welcome to RoleBoard",
    content:
      "This post belongs to Akib Regular. Other regular users can comment on it, but only the owner, moderator, or super admin can delete comments here.",
    authorId: 3,
    author: "Akib Regular",
    comments: [
      {
        id: 1,
        text: "Nice post. This comment is from another regular user.",
        authorId: 6,
        author: "Sample Regular User",
      },
      {
        id: 2,
        text: "This is Akib's own comment for testing own-comment delete permission.",
        authorId: 3,
        author: "Akib Regular",
      },
    ],
  },
  {
    id: 2,
    title: "Permission testing checklist",
    content:
      "Use the role switcher to test create, edit, delete, and comment actions. The backend version will enforce the same rules through API routes.",
    authorId: 3,
    author: "Akib Regular",
    comments: [
      {
        id: 3,
        text: "Moderator and Super Admin should be able to delete this comment.",
        authorId: 6,
        author: "Sample Regular User",
      },
    ],
  },
];

export default function Home() {
  const [selectedUser, setSelectedUser] = useState(users[2]);
  const [posts, setPosts] = useState(startingPosts);
  const [searchText, setSearchText] = useState("");
  const [isPostFormOpen, setIsPostFormOpen] = useState(false);
  const [editingPostId, setEditingPostId] = useState(null);
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [message, setMessage] = useState("");

  const filteredPosts = posts.filter((post) => {
    const keyword = searchText.toLowerCase();

    return (
      post.title.toLowerCase().includes(keyword) ||
      post.content.toLowerCase().includes(keyword) ||
      post.author.toLowerCase().includes(keyword)
    );
  });

  function showMessage(text) {
    setMessage(text);

    setTimeout(() => {
      setMessage("");
    }, 2400);
  }

  function canCreatePost() {
    return selectedUser.role === "Regular User";
  }

  function canCreateComment() {
    return selectedUser.role === "Regular User";
  }

  function canUpdatePost(post) {
    return (
      selectedUser.role === "Regular User" && selectedUser.id === post.authorId
    );
  }

  function canDeletePost(post) {
    if (selectedUser.role === "Super Admin") return true;
    if (selectedUser.role === "Moderator") return true;
    if (
      selectedUser.role === "Regular User" &&
      selectedUser.id === post.authorId
    )
      return true;

    return false;
  }

  function canDeleteComment(post, comment) {
    if (selectedUser.role === "Super Admin") return true;
    if (selectedUser.role === "Moderator") return true;

    if (
      selectedUser.role === "Regular User" &&
      (selectedUser.id === post.authorId ||
        selectedUser.id === comment.authorId)
    ) {
      return true;
    }

    return false;
  }

  function getBadgeClass(role) {
    if (role === "Super Admin") return "badge badge-red";
    if (role === "Moderator") return "badge badge-amber";
    if (role === "Regular User") return "badge badge-green";
    return "badge badge-slate";
  }
  function getRoleClass(role) {
  if (role === "Super Admin") return "role-super-admin";
  if (role === "Moderator") return "role-moderator";
  if (role === "Regular User") return "role-regular-user";
  return "role-guest";
}


  function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);

    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function openCreatePostForm() {
    if (!canCreatePost()) {
      showMessage("Blocked: only Regular Users can create posts.");
      return;
    }

    setEditingPostId(null);
    setPostTitle("");
    setPostContent("");
    setIsPostFormOpen(true);
  }

  function openEditPostForm(post) {
    if (!canUpdatePost(post)) {
      showMessage("Blocked: you can only edit your own post.");
      return;
    }

    setEditingPostId(post.id);
    setPostTitle(post.title);
    setPostContent(post.content);
    setIsPostFormOpen(true);
  }

  function savePost(event) {
    event.preventDefault();

    if (!postTitle.trim() || !postContent.trim()) {
      showMessage("Please write both title and content.");
      return;
    }

    if (editingPostId) {
      const postToEdit = posts.find((post) => post.id === editingPostId);

      if (!postToEdit || !canUpdatePost(postToEdit)) {
        showMessage("Blocked: you can only update your own post.");
        return;
      }

      setPosts((currentPosts) =>
        currentPosts.map((post) =>
          post.id === editingPostId
            ? {
                ...post,
                title: postTitle.trim(),
                content: postContent.trim(),
              }
            : post,
        ),
      );

      showMessage("Post updated successfully.");
    } else {
      if (!canCreatePost()) {
        showMessage("Blocked: only Regular Users can create posts.");
        return;
      }

      const newPost = {
        id: Date.now(),
        title: postTitle.trim(),
        content: postContent.trim(),
        authorId: selectedUser.id,
        author: selectedUser.name,
        comments: [],
      };

      setPosts((currentPosts) => [newPost, ...currentPosts]);
      showMessage("Post created successfully.");
    }

    setPostTitle("");
    setPostContent("");
    setEditingPostId(null);
    setIsPostFormOpen(false);
  }

  function deletePost(post) {
    if (!canDeletePost(post)) {
      showMessage("Blocked: you do not have permission to delete this post.");
      return;
    }

    setPosts((currentPosts) =>
      currentPosts.filter((item) => item.id !== post.id),
    );
    showMessage("Post deleted successfully.");
  }

  function startComment(postId) {
    if (!canCreateComment()) {
      showMessage(
        "Blocked: guests, moderators, and admins cannot create comments in this task.",
      );
      return;
    }

    setActiveCommentPostId(postId);
    setCommentText("");
  }

  function saveComment(postId) {
    if (!canCreateComment()) {
      showMessage("Blocked: only Regular Users can create comments.");
      return;
    }

    if (!commentText.trim()) {
      showMessage("Please write a comment first.");
      return;
    }

    const newComment = {
      id: Date.now(),
      text: commentText.trim(),
      authorId: selectedUser.id,
      author: selectedUser.name,
    };

    setPosts((currentPosts) =>
      currentPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: [...post.comments, newComment],
            }
          : post,
      ),
    );

    setActiveCommentPostId(null);
    setCommentText("");
    showMessage("Comment added successfully.");
  }

  function deleteComment(post, comment) {
    if (!canDeleteComment(post, comment)) {
      showMessage("Blocked: you cannot delete this comment.");
      return;
    }

    setPosts((currentPosts) =>
      currentPosts.map((item) =>
        item.id === post.id
          ? {
              ...item,
              comments: item.comments.filter(
                (savedComment) => savedComment.id !== comment.id,
              ),
            }
          : item,
      ),
    );

    showMessage("Comment deleted successfully.");
  }

  function exportData() {
    const fileData = {
      exportedBy: selectedUser.name,
      selectedRole: selectedUser.role,
      posts,
    };

    const blob = new Blob([JSON.stringify(fileData, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "roleboard-data.json";
    link.click();

    URL.revokeObjectURL(url);
    showMessage("Export file downloaded.");
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">R</div>
          <div>
            <h1>RoleBoard</h1>
            <p>Access Control</p>
          </div>
        </div>

        <nav className="side-menu">
          <button
            onClick={() => scrollToSection("dashboard")}
            className="menu-item active"
          >
            <IconLayoutDashboard size={17} stroke={1.8} />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => scrollToSection("posts")}
            className="menu-item"
          >
            <IconFileText size={17} stroke={1.8} />
            <span>Posts</span>
          </button>

          <button
            onClick={() => scrollToSection("comments")}
            className="menu-item"
          >
            <IconMessage size={17} stroke={1.8} />
            <span>Comments</span>
          </button>

          <button
            onClick={() => scrollToSection("roles")}
            className="menu-item"
          >
            <IconShield size={17} stroke={1.8} />
            <span>Roles</span>
          </button>
        </nav>

        <div className="sidebar-card">
          <p>Current role</p>
          <strong>{selectedUser.name}</strong>
          <span className={getBadgeClass(selectedUser.role)}>
            {selectedUser.role}
          </span>
        </div>
      </aside>

      <section className="main-area" id="dashboard">
        <header className="top-bar">
          <div>
            <h2>Role Based Post & Comment Management</h2>
            <span>
              Test permissions for posts and comments using the four required
              roles.
            </span>
          </div>

          <div className="top-actions">
            <input
              type="search"
              placeholder="Search posts..."
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
            />
            <button onClick={exportData}>Export</button>
            <div className="profile-circle">{selectedUser.shortName}</div>
          </div>
        </header>

        {message && <div className="toast">{message}</div>}

        <section className="user-tabs" id="roles">
          {users.map((user) => (
            <button
              key={user.id}
              onClick={() => setSelectedUser(user)}
              className={
                selectedUser.id === user.id
                  ? "user-tab selected " + getRoleClass(user.role)
                  : "user-tab " + getRoleClass(user.role)
              }
            >
              <span>{user.shortName}</span>
              <div>
                <strong>{user.name}</strong>
                <small>{user.role}</small>
              </div>
            </button>
          ))}
        </section>

        <section className="summary-grid">
          {roleCards.map((item) => (
            <article
              key={item.role}
              className={
                selectedUser.role === item.role
                  ? "summary-card active-card " + getRoleClass(item.role)
                  : "summary-card " + getRoleClass(item.role)
              }
            >
              <p>{item.role}</p>
              <h3>{item.title}</h3>
              <span>{item.text}</span>
            </article>
          ))}
        </section>

        <section className="content-grid" id="posts">
          <div className="panel large-panel">
            <div className="panel-header">
              <div>
                <p className="section-label">Permission Preview</p>
                <h3>Post Management</h3>
              </div>

              <button
                className={
                  canCreatePost() ? "primary-btn" : "primary-btn muted-btn"
                }
                onClick={openCreatePostForm}
              >
                Create Post
              </button>
            </div>

            {isPostFormOpen && (
              <form className="post-form" onSubmit={savePost}>
                <input
                  type="text"
                  placeholder="Post title"
                  value={postTitle}
                  onChange={(event) => setPostTitle(event.target.value)}
                />
                <textarea
                  placeholder="Write post content..."
                  value={postContent}
                  onChange={(event) => setPostContent(event.target.value)}
                  rows={4}
                />
                <div className="form-actions">
                  <button type="submit" className="primary-btn">
                    {editingPostId ? "Update Post" : "Publish Post"}
                  </button>
                  <button
                    type="button"
                    className="secondary-btn"
                    onClick={() => setIsPostFormOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Post Title</th>
                    <th>Owner</th>
                    <th>Comments</th>
                    <th>Edit</th>
                    <th>Delete</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredPosts.map((post) => (
                    <tr key={post.id}>
                      <td>
                        <strong>{post.title}</strong>
                        <small>{post.content}</small>
                      </td>
                      <td>{post.author}</td>
                      <td>
                        <span className="status-pill">
                          {post.comments.length}
                        </span>
                      </td>
                      <td>
                        <button
                          className={
                            canUpdatePost(post)
                              ? "outline-btn"
                              : "outline-btn muted-btn"
                          }
                          onClick={() => openEditPostForm(post)}
                        >
                          Edit
                        </button>
                      </td>
                      <td>
                        <button
                          className={
                            canDeletePost(post)
                              ? "danger-btn"
                              : "danger-btn muted-btn"
                          }
                          onClick={() => deletePost(post)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}

                  {filteredPosts.length === 0 && (
                    <tr>
                      <td colSpan="5" className="empty-cell">
                        No posts found for this search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="panel small-panel">
            <div className="panel-header">
              <div>
                <p className="section-label">Current Permission</p>
                <h3>Role Rules</h3>
              </div>
            </div>

            <div className="quick-list">
              <div
                className={
                  canCreatePost() ? "quick-card allowed" : "quick-card blocked"
                }
              >
                <strong>Create post</strong>
                <span>{canCreatePost() ? "Allowed" : "Blocked"}</span>
              </div>

              <div
                className={
                  canCreateComment()
                    ? "quick-card allowed"
                    : "quick-card blocked"
                }
              >
                <strong>Create comment</strong>
                <span>{canCreateComment() ? "Allowed" : "Blocked"}</span>
              </div>

              <div className="quick-card blocked">
                <strong>Manage users</strong>
                <span>Not included in this task</span>
              </div>
            </div>

            <div className="note-box">
              <strong>Security note</strong>
              <p>
                The next phase will move these permission checks into API routes
                so users cannot bypass rules from the browser.
              </p>
            </div>
          </div>
        </section>

        <section className="panel" id="comments">
          <div className="panel-header">
            <div>
              <p className="section-label">Comment Rules</p>
              <h3>Comment Delete Testing</h3>
            </div>
          </div>

          <div className="comment-grid">
            {filteredPosts.map((post) => (
              <article className="comment-card" key={post.id}>
                <div className="comment-card-top">
                  <div>
                    <h4>{post.title}</h4>
                    <p>Post owner: {post.author}</p>
                  </div>

                  <button
                    className={
                      canCreateComment()
                        ? "primary-btn"
                        : "primary-btn muted-btn"
                    }
                    onClick={() => startComment(post.id)}
                  >
                    Add Comment
                  </button>
                </div>

                {activeCommentPostId === post.id && (
                  <div className="comment-form">
                    <textarea
                      placeholder="Write your comment..."
                      rows={3}
                      value={commentText}
                      onChange={(event) => setCommentText(event.target.value)}
                    />
                    <div className="form-actions">
                      <button
                        className="primary-btn"
                        onClick={() => saveComment(post.id)}
                      >
                        Save Comment
                      </button>
                      <button
                        className="secondary-btn"
                        onClick={() => setActiveCommentPostId(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {post.comments.map((comment) => (
                  <div className="comment-row" key={comment.id}>
                    <div>
                      <strong>{comment.author}</strong>
                      <span>{comment.text}</span>
                    </div>

                    <button
                      className={
                        canDeleteComment(post, comment)
                          ? "danger-btn"
                          : "danger-btn muted-btn"
                      }
                      onClick={() => deleteComment(post, comment)}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
