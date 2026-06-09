"use client";

import { useState } from "react";

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
    name: "Hasan Regular",
    shortName: "HR",
    role: "Regular User",
    email: "hasan.user@example.com",
  },
  {
    id: 5,
    name: "Guest Visitor",
    shortName: "GV",
    role: "Guest",
    email: "guest@example.com",
  },
];

const posts = [
  {
    id: 1,
    title: "Welcome to RoleBoard",
    authorId: 3,
    author: "Akib Regular",
    status: "Active",
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
    authorId: 4,
    author: "Hasan Regular",
    status: "Active",
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

const roleCards = [
  {
    role: "Super Admin",
    title: "Full Control",
    text: "Can delete any post or comment in the system.",
  },
  {
    role: "Moderator",
    title: "Content Review",
    text: "Can delete any post or comment, but cannot manage users.",
  },
  {
    role: "Regular User",
    title: "Member Access",
    text: "Can create posts and comments, and manage own posts.",
  },
  {
    role: "Guest",
    title: "Read Only",
    text: "Can only view posts and comments.",
  },
];

export default function Home() {
  const [selectedUser, setSelectedUser] = useState(users[2]);

  function canCreatePost() {
    return selectedUser.role === "Regular User";
  }

  function canCreateComment() {
    return selectedUser.role === "Regular User";
  }

  function canUpdatePost(post) {
    return selectedUser.role === "Regular User" && selectedUser.id === post.authorId;
  }

  function canDeletePost(post) {
    if (selectedUser.role === "Super Admin") return true;
    if (selectedUser.role === "Moderator") return true;
    if (selectedUser.role === "Regular User" && selectedUser.id === post.authorId) return true;

    return false;
  }

  function canDeleteComment(post, comment) {
    if (selectedUser.role === "Super Admin") return true;
    if (selectedUser.role === "Moderator") return true;

    if (
      selectedUser.role === "Regular User" &&
      (selectedUser.id === post.authorId || selectedUser.id === comment.authorId)
    ) {
      return true;
    }

    return false;
  }

  function showResult(action, allowed) {
    if (allowed) {
      alert("Allowed: " + action);
    } else {
      alert("Blocked: You do not have permission for this action.");
    }
  }

  function getBadgeClass(role) {
    if (role === "Super Admin") return "badge red";
    if (role === "Moderator") return "badge yellow";
    if (role === "Regular User") return "badge green";
    return "badge purple";
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">R</div>
          <div>
            <h1>RoleBoard</h1>
            <p>RBAC System</p>
          </div>
        </div>

        <nav className="side-menu">
          <button className="menu-item active">Dashboard</button>
          <button className="menu-item">Posts</button>
          <button className="menu-item">Comments</button>
          <button className="menu-item">Permissions</button>
          <button className="menu-item">Users</button>
        </nav>

        <div className="sidebar-card">
          <p>Logged in as</p>
          <strong>{selectedUser.name}</strong>
          <span className={getBadgeClass(selectedUser.role)}>{selectedUser.role}</span>
        </div>
      </aside>

      <section className="main-area">
        <header className="top-bar">
          <div>
            <p className="page-label">Full Stack Developer Task</p>
            <h2>Role Based Post & Comment Management</h2>
            <span>Test different users and see which actions are allowed or blocked.</span>
          </div>

          <div className="top-actions">
            <button>Search</button>
            <button>Export</button>
            <div className="profile-circle">{selectedUser.shortName}</div>
          </div>
        </header>

        <section className="user-tabs">
          {users.map((user) => (
            <button
              key={user.id}
              onClick={() => setSelectedUser(user)}
              className={selectedUser.id === user.id ? "user-tab selected" : "user-tab"}
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
                selectedUser.role === item.role ? "summary-card active-card" : "summary-card"
              }
            >
              <p>{item.role}</p>
              <h3>{item.title}</h3>
              <span>{item.text}</span>
            </article>
          ))}
        </section>

        <section className="content-grid">
          <div className="panel large-panel">
            <div className="panel-header">
              <div>
                <p className="page-label">Permission Preview</p>
                <h3>Post Management</h3>
              </div>

              <button
                className={canCreatePost() ? "primary-btn" : "primary-btn disabled"}
                onClick={() => showResult("Create post", canCreatePost())}
              >
                Create Post
              </button>
            </div>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Post Title</th>
                    <th>Owner</th>
                    <th>Status</th>
                    <th>Edit</th>
                    <th>Delete</th>
                  </tr>
                </thead>

                <tbody>
                  {posts.map((post) => (
                    <tr key={post.id}>
                      <td>
                        <strong>{post.title}</strong>
                        <small>{post.comments.length} comments available</small>
                      </td>
                      <td>{post.author}</td>
                      <td>
                        <span className="status-pill">{post.status}</span>
                      </td>
                      <td>
                        <button
                          className={canUpdatePost(post) ? "outline-btn" : "outline-btn blocked"}
                          onClick={() => showResult("Edit post", canUpdatePost(post))}
                        >
                          Edit
                        </button>
                      </td>
                      <td>
                        <button
                          className={canDeletePost(post) ? "danger-btn" : "danger-btn blocked"}
                          onClick={() => showResult("Delete post", canDeletePost(post))}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="panel small-panel">
            <div className="panel-header">
              <div>
                <p className="page-label">Current Permission</p>
                <h3>Quick Test</h3>
              </div>
            </div>

            <div className="quick-list">
              <button
                className={canCreatePost() ? "quick-btn allowed" : "quick-btn blocked"}
                onClick={() => showResult("Create post", canCreatePost())}
              >
                Create Post
              </button>

              <button
                className={canCreateComment() ? "quick-btn allowed" : "quick-btn blocked"}
                onClick={() => showResult("Create comment", canCreateComment())}
              >
                Create Comment
              </button>

              <button
                className="quick-btn blocked"
                onClick={() => showResult("Manage users", false)}
              >
                Manage Users
              </button>
            </div>

            <div className="note-box">
              <strong>Rule note</strong>
              <p>
                This phase is frontend only. Real server-side permission checking will be added
                in the backend phase.
              </p>
            </div>
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <p className="page-label">Comment Rules</p>
              <h3>Comment Delete Testing</h3>
            </div>

            <button
              className={canCreateComment() ? "primary-btn" : "primary-btn disabled"}
              onClick={() => showResult("Create comment", canCreateComment())}
            >
              Add Comment
            </button>
          </div>

          <div className="comment-grid">
            {posts.map((post) => (
              <article className="comment-card" key={post.id}>
                <h4>{post.title}</h4>
                <p>Post owner: {post.author}</p>

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
                          : "danger-btn blocked"
                      }
                      onClick={() =>
                        showResult("Delete comment", canDeleteComment(post, comment))
                      }
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