# RoleBoard - Role Based Post and Comment Management System

RoleBoard is a small full stack web application created for a Full Stack Developer job task.

The main goal of this project is to show role-based permissions for posts and comments using four different roles:

- Super Admin
- Moderator
- Regular User
- Guest

## Task Requirements

The system must support four roles with different permissions.

### Roles

| Role | Permission |
|---|---|
| Super Admin | Full access to delete anything in the system |
| Moderator | Can delete any post or comment, but cannot manage users |
| Regular User | Can create posts and comments, and can update or delete only their own posts |
| Guest | Can only view/read everything |

## Post Rules

- Regular Users can create posts.
- Each user can only update or delete their own posts.
- Super Admin can delete anything.
- Moderator can delete any post.

## Comment Rules

- If User A creates a post, User B can comment on it.
- User A, the post owner, can delete User B's comment.
- User B can also delete their own comment.
- User C cannot delete User B's comment.
- Moderator can delete any comment.
- Super Admin can delete any comment.

## Tech Stack

- Next.js
- React
- CSS
- Prisma and SQLite will be added later

## Current Status

Phase 0 completed:

- Project created
- Basic Next.js setup completed
- Initial README added
- Project pushed to GitHub

## Next Phases

1. Frontend layout and UI design
2. Database schema and seed data
3. Backend API routes
4. Role-based permission logic
5. Frontend and backend connection
6. Testing and final README update