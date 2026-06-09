"use client";

import { useState } from "react";

const users = [
  {
    id: 1,
    name: "Sarah Admin",
    role: "Super Admin",
    email: "sarah.admin@example.com",
    className: "super-admin",
  },
  {
    id: 2,
    name: "Mina Moderator",
    role: "Moderator",
    email: "mina.mod@example.com",
    className: "moderator",
  },
  {
    id: 3,
    name: "Akib Regular",
    role: "Regular User",
    email: "akib.user@example.com",
    className: "regular-user",
  },
  {
    id: 4,
    name: "Hasan Regular",
    role: "Regular User",
    email: "hasan.user@example.com",
    className: "regular-user",
  },
  {
    id: 5,
    name: "Guest Visitor",
    role: "Guest",
    email: "guest@example.com",
    className: "guest",
  },
];

const posts = [
  {
    id: 1,
    title: "Welcome to RoleBoard",
    content:
      "This post is created by Akib Regular. Other users can read it and regular users can comment on it.",
    authorId: 3,
    author: "Akib Regular",
    comments: [
      {
        id: 1,
        text: "Nice post. This comment was written by Hasan.",
        authorId: 4,
        author: "Hasan Regular",
      },
      {
        id: 2,
        text: "This is a sample comment for permission testing.",
        authorId: 3,
        author: "Akib Regular",
      },
    ],
  },
  {
    id: 2,
    title: "Frontend permission preview",
    content:
      "This screen is only the frontend design phase. Backend permission checks will be added later.",
    authorId: 4,
    author: "Hasan Regular",
    comments: [
      {
        id: 3,
        text: "Moderator and Super Admin should be able to delete this later.",
        authorId: 3,
        author: "Akib Regular",
      },
    ],
  },
];

const roleDetails = {
  "Super Admin": {
    title: "System controller",
    text: "Can delete any post or comment in the system.",
  },
  Moderator: {
    title: "Content reviewer",
    text: "Can delete any post or comment, but cannot manage users.",
  },
  "Regular User": {
    title: "Normal member",
    text: "Can create posts and comments, and manage their own content.",
  },
  Guest: {
    title: "Read only visitor",
    text: "Can only view posts and comments.",
  },
};

export default function Home() {
  const [selectedUser, setSelectedUser] = useState(users[2]);

  const currentRole = selectedUser.role;
  const canCreatePost = currentRole === "Regular User";
  const canCreateComment = currentRole === "Regular User";

  function showMessage(action, allowed) {
    if (allowed) {
      alert("Allowed: " + action);
    } else {
      alert("Blocked: This role does not have permission for this action.");
    }
  }

  function canUpdatePost(post) {
    return currentRole === "Regular User" && selectedUser.id === post.authorId;
  }

  function canDeletePost(post) {
    if (currentRole === "Super Admin") return true;
    if (currentRole === "Moderator") return true;
    if (currentRole === "Regular User" && selectedUser.id === post.authorId) {
      return true;
    }
    return false;
  }

  function canDeleteComment(post, comment) {
    if (currentRole === "Super Admin") return true;
    if (currentRole === "Moderator") return true;

    if (
      currentRole === "Regular User" &&
      (selectedUser.id === comment.authorId || selectedUser.id === post.authorId)
    ) {
      return true;
    }

    return false;
  }

  return (
    <main className="page">
      <section className="hero">
        <div>
          <p className="eyebrow">Full Stack Developer Task</p>
          <h1>RoleBoard</h1>
          <p className="hero-text">
            A clean role-based post and comment management system with four
            user roles: Super Admin, Moderator, Regular User, and Guest.
          </p>
        </div>

        <div className="hero-card">
          <p>Current user</p>
          <h2>{selectedUser.name}</h2>
          <span className={"role-badge " + selectedUser.className}>
            {selectedUser.role}
          </span>
        </div>
      </section>

      <section className="role-section">
        <div className="section-heading">
          <p className="eyebrow">Step 1</p>
          <h2>Choose a role to test permissions</h2>
        </div>

        <div className="role-grid">
          {users.map((user) => (
            <button
              key={user.id}
              className={
                selectedUser.id === user.id
                  ? "role-card active-role"
                  : "role-card"
              }
              onClick={() => setSelectedUser(user)}
            >
              <span className={"role-badge " + user.className}>
                {user.role}
              </span>
              <strong>{user.name}</strong>
              <small>{user.email}</small>
            </button>
          ))}
        </div>
      </section>

      <section className="dashboard">
        <aside className="side-panel">
          <div className="panel-card">
            <p className="eyebrow">Role summary</p>
            <h2>{roleDetails[currentRole].title}</h2>
            <p>{roleDetails[currentRole].text}</p>
          </div>

          <div className="panel-card">
            <p className="eyebrow">Quick actions</p>

            <button
              className={canCreatePost ? "action-btn" : "action-btn disabled"}
              onClick={() => showMessage("Create post", canCreatePost)}
            >
              Create Post
            </button>

            <button
              className={
                canCreateComment ? "action-btn" : "action-btn disabled"
              }
              onClick={() => showMessage("Create comment", canCreateComment)}
            >
              Create Comment
            </button>

            <button
              className="action-btn disabled"
              onClick={() => showMessage("Manage users", false)}
            >
              Manage Users
            </button>
          </div>

          <div className="panel-card checklist">
            <p className="eyebrow">Permission checklist</p>
            <p>{canCreatePost ? "Allowed" : "Blocked"}: Create post</p>
            <p>{canCreateComment ? "Allowed" : "Blocked"}: Create comment</p>
            <p>
              {currentRole === "Guest" ? "Blocked" : "Role based"}: Delete
              content
            </p>
          </div>
        </aside>

        <section className="feed">
          <div className="section-heading">
            <p className="eyebrow">Demo Feed</p>
            <h2>Posts and comments</h2>
          </div>

          {posts.map((post) => (
            <article className="post-card" key={post.id}>
              <div className="post-top">
                <div>
                  <h3>{post.title}</h3>
                  <p>
                    Posted by <strong>{post.author}</strong>
                  </p>
                </div>

                <div className="post-actions">
                  <button
                    className={
                      canUpdatePost(post) ? "small-btn" : "small-btn disabled"
                    }
                    onClick={() =>
                      showMessage("Update own post", canUpdatePost(post))
                    }
                  >
                    Edit
                  </button>

                  <button
                    className={
                      canDeletePost(post) ? "small-btn danger" : "small-btn disabled"
                    }
                    onClick={() =>
                      showMessage("Delete post", canDeletePost(post))
                    }
                  >
                    Delete
                  </button>
                </div>
              </div>

              <p className="post-content">{post.content}</p>

              <div className="comment-box">
                <h4>Comments</h4>

                {post.comments.map((comment) => (
                  <div className="comment" key={comment.id}>
                    <div>
                      <strong>{comment.author}</strong>
                      <p>{comment.text}</p>
                    </div>

                    <button
                      className={
                        canDeleteComment(post, comment)
                          ? "small-btn danger"
                          : "small-btn disabled"
                      }
                      onClick={() =>
                        showMessage(
                          "Delete comment",
                          canDeleteComment(post, comment)
                        )
                      }
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </section>
      </section>
    </main>
  );
}