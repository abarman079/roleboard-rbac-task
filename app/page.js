"use client";

import { useEffect, useState } from "react";
import {
  IconFileText,
  IconLayoutDashboard,
  IconMessage,
  IconShield,
} from "@tabler/icons-react";

const roleNames = {
  SUPER_ADMIN: "Super Admin",
  MODERATOR: "Moderator",
  REGULAR_USER: "Regular User",
  GUEST: "Guest",
};

const visibleUserEmails = [
  "sarah.admin@example.com",
  "mina.mod@example.com",
  "akib.user@example.com",
  "guest@example.com",
];

const roleCards = [
  {
    role: "SUPER_ADMIN",
    title: "Full delete access",
    text: "Can delete any post or comment in the system.",
  },
  {
    role: "MODERATOR",
    title: "Content moderation",
    text: "Can delete any post or comment, but cannot manage users.",
  },
  {
    role: "REGULAR_USER",
    title: "Post and comment access",
    text: "Can create posts and comments, and update or delete only own posts.",
  },
  {
    role: "GUEST",
    title: "Read only access",
    text: "Can only view posts and comments.",
  },
];

export default function Home() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isPostFormOpen, setIsPostFormOpen] = useState(false);
  const [editingPostId, setEditingPostId] = useState(null);
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const filteredPosts = posts.filter((post) => {
    const keyword = searchText.toLowerCase();
    const authorName = post.author?.name || "";

    return (
      post.title.toLowerCase().includes(keyword) ||
      post.content.toLowerCase().includes(keyword) ||
      authorName.toLowerCase().includes(keyword)
    );
  });

  useEffect(() => {
    async function loadInitialData() {
      try {
        const usersResult = await requestApi("/api/users");
        const postsResult = await requestApi("/api/posts");

        const preparedUsers = usersResult.data
          .filter((user) => visibleUserEmails.includes(user.email))
          .map((user) => ({
            ...user,
            shortName: getShortName(user.name),
          }));

        const defaultUser =
          preparedUsers.find((user) => user.role === "REGULAR_USER") ||
          preparedUsers[0];

        setUsers(preparedUsers);
        setSelectedUser(defaultUser);
        setPosts(postsResult.data);
      } catch (error) {
        showMessage(error.message || "Something went wrong while loading data.");
      } finally {
        setIsLoading(false);
      }
    }

    loadInitialData();
  }, []);

  async function requestApi(url, options = {}) {
    const response = await fetch(url, options);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Request failed.");
    }

    return result;
  }

  async function refreshPosts() {
    const result = await requestApi("/api/posts");
    setPosts(result.data);
  }

  function showMessage(text) {
    setMessage(text);

    setTimeout(() => {
      setMessage("");
    }, 2600);
  }

  function getShortName(name) {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  function canCreatePost() {
    return selectedUser?.role === "REGULAR_USER";
  }

  function canCreateComment() {
    return selectedUser?.role === "REGULAR_USER";
  }

  function canUpdatePost(post) {
    return selectedUser?.role === "REGULAR_USER" && selectedUser.id === post.authorId;
  }

  function canDeletePost(post) {
    if (selectedUser?.role === "SUPER_ADMIN") return true;
    if (selectedUser?.role === "MODERATOR") return true;
    if (selectedUser?.role === "REGULAR_USER" && selectedUser.id === post.authorId) {
      return true;
    }

    return false;
  }

  function canDeleteComment(post, comment) {
    if (selectedUser?.role === "SUPER_ADMIN") return true;
    if (selectedUser?.role === "MODERATOR") return true;

    if (
      selectedUser?.role === "REGULAR_USER" &&
      (selectedUser.id === post.authorId || selectedUser.id === comment.authorId)
    ) {
      return true;
    }

    return false;
  }

  function getBadgeClass(role) {
    if (role === "SUPER_ADMIN") return "badge badge-red";
    if (role === "MODERATOR") return "badge badge-amber";
    if (role === "REGULAR_USER") return "badge badge-green";
    return "badge badge-slate";
  }

  function getRoleClass(role) {
    if (role === "SUPER_ADMIN") return "role-super-admin";
    if (role === "MODERATOR") return "role-moderator";
    if (role === "REGULAR_USER") return "role-regular-user";
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

  async function savePost(event) {
    event.preventDefault();

    if (!selectedUser) return;

    if (!postTitle.trim() || !postContent.trim()) {
      showMessage("Please write both title and content.");
      return;
    }

    try {
      if (editingPostId) {
        await requestApi(`/api/posts/${editingPostId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: selectedUser.id,
            title: postTitle,
            content: postContent,
          }),
        });

        showMessage("Post updated successfully.");
      } else {
        await requestApi("/api/posts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: selectedUser.id,
            title: postTitle,
            content: postContent,
          }),
        });

        showMessage("Post created successfully.");
      }

      setPostTitle("");
      setPostContent("");
      setEditingPostId(null);
      setIsPostFormOpen(false);
      await refreshPosts();
    } catch (error) {
      showMessage(error.message);
    }
  }

  async function deletePost(post) {
    if (!selectedUser) return;

    try {
      await requestApi(`/api/posts/${post.id}?userId=${selectedUser.id}`, {
        method: "DELETE",
      });

      showMessage("Post deleted successfully.");
      await refreshPosts();
    } catch (error) {
      showMessage(error.message);
    }
  }

  function startComment(postId) {
    if (!canCreateComment()) {
      showMessage("Blocked: only Regular Users can create comments.");
      return;
    }

    setActiveCommentPostId(postId);
    setCommentText("");
  }

  async function saveComment(postId) {
    if (!selectedUser) return;

    if (!commentText.trim()) {
      showMessage("Please write a comment first.");
      return;
    }

    try {
      await requestApi("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: selectedUser.id,
          postId,
          text: commentText,
        }),
      });

      setActiveCommentPostId(null);
      setCommentText("");
      showMessage("Comment added successfully.");
      await refreshPosts();
    } catch (error) {
      showMessage(error.message);
    }
  }

  async function deleteComment(comment) {
    if (!selectedUser) return;

    try {
      await requestApi(`/api/comments/${comment.id}?userId=${selectedUser.id}`, {
        method: "DELETE",
      });

      showMessage("Comment deleted successfully.");
      await refreshPosts();
    } catch (error) {
      showMessage(error.message);
    }
  }

  function exportData() {
    if (!selectedUser) return;

    const fileData = {
      exportedBy: selectedUser.name,
      selectedRole: roleNames[selectedUser.role],
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

  if (isLoading || !selectedUser) {
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
        </aside>

        <section className="main-area">
          <div className="panel">
            <h3>Loading dashboard...</h3>
          </div>
        </section>
      </main>
    );
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
          <button onClick={() => scrollToSection("dashboard")} className="menu-item active">
            <IconLayoutDashboard size={17} stroke={1.8} />
            <span>Dashboard</span>
          </button>

          <button onClick={() => scrollToSection("posts")} className="menu-item">
            <IconFileText size={17} stroke={1.8} />
            <span>Posts</span>
          </button>

          <button onClick={() => scrollToSection("comments")} className="menu-item">
            <IconMessage size={17} stroke={1.8} />
            <span>Comments</span>
          </button>

          <button onClick={() => scrollToSection("roles")} className="menu-item">
            <IconShield size={17} stroke={1.8} />
            <span>Roles</span>
          </button>
        </nav>

        <div className="sidebar-card">
          <p>Current role</p>
          <strong>{selectedUser.name}</strong>
          <span className={getBadgeClass(selectedUser.role)}>
            {roleNames[selectedUser.role]}
          </span>
        </div>
      </aside>

      <section className="main-area" id="dashboard">
        <header className="top-bar">
          <div>
            <h2>Role Based Post & Comment Management</h2>
            <span>
              All post and comment actions are now handled through backend API routes.
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
                <small>{roleNames[user.role]}</small>
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
              <p>{roleNames[item.role]}</p>
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
                className={canCreatePost() ? "primary-btn" : "primary-btn muted-btn"}
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
                      <td>{post.author?.name}</td>
                      <td>
                        <span className="status-pill">{post.comments.length}</span>
                      </td>
                      <td>
                        <button
                          className={
                            canUpdatePost(post) ? "outline-btn" : "outline-btn muted-btn"
                          }
                          onClick={() => openEditPostForm(post)}
                        >
                          Edit
                        </button>
                      </td>
                      <td>
                        <button
                          className={
                            canDeletePost(post) ? "danger-btn" : "danger-btn muted-btn"
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
              <div className={canCreatePost() ? "quick-card allowed" : "quick-card blocked"}>
                <strong>Create post</strong>
                <span>{canCreatePost() ? "Allowed" : "Blocked"}</span>
              </div>

              <div
                className={canCreateComment() ? "quick-card allowed" : "quick-card blocked"}
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
                The dashboard shows allowed actions for usability, but every create,
                edit, and delete request is also checked again by the API.
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
                    <p>Post owner: {post.author?.name}</p>
                  </div>

                  <button
                    className={canCreateComment() ? "primary-btn" : "primary-btn muted-btn"}
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
                        type="button"
                        className="primary-btn"
                        onClick={() => saveComment(post.id)}
                      >
                        Save Comment
                      </button>
                      <button
                        type="button"
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
                      <strong>{comment.author?.name}</strong>
                      <span>{comment.text}</span>
                    </div>

                    <button
                      className={
                        canDeleteComment(post, comment)
                          ? "danger-btn"
                          : "danger-btn muted-btn"
                      }
                      onClick={() => deleteComment(comment)}
                    >
                      Delete
                    </button>
                  </div>
                ))}

                {post.comments.length === 0 && (
                  <div className="comment-row">
                    <div>
                      <strong>No comments yet</strong>
                      <span>This post has no comments.</span>
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}