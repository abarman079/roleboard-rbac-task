# RoleBoard - Role Based Post and Comment Management System

RoleBoard is a small full stack web application built for a Full Stack Developer job task.
It demonstrates role-based access control for posts and comments using a clean dashboard interface and backend API permission checks.

## Live Purpose

The project allows switching between different user roles and testing what each role is allowed or blocked from doing.

## User Roles

| Role         | Permission Summary                                                              |
| ------------ | ------------------------------------------------------------------------------- |
| Super Admin  | Can delete any post or comment                                                  |
| Moderator    | Can delete any post or comment, but cannot manage users                         |
| Regular User | Can create posts and comments, update/delete own posts, and delete own comments |
| Guest        | Can only view posts and comments                                                |

## Main Features

* Role switching dashboard
* Post list loaded from database
* Create post as Regular User
* Edit own post as Regular User
* Delete post based on role permission
* Add comments as Regular User
* Delete own comment
* Post owner can delete comments on their own post
* Moderator can delete any post or comment
* Super Admin can delete any post or comment
* Guest has read-only access
* Search posts
* Export current data as JSON
* Server-side permission checks through API routes
* SQLite database with Prisma ORM
* Clean responsive admin dashboard UI

## Tech Stack

* Next.js
* React
* Prisma ORM
* SQLite
* JavaScript
* CSS
* Tabler Icons

## Project Structure

```txt
app/
├── api/
│   ├── comments/
│   ├── posts/
│   └── users/
├── globals.css
├── layout.js
└── page.js

lib/
├── currentUser.js
├── permissions.js
└── prisma.js

prisma/
├── schema.prisma
└── seed.ts
```

## Permission Logic

The main role rules are written in:

```txt
lib/permissions.js
```

This keeps the authorization logic separate from the UI and makes the code easier to review.

## API Routes

| Route                | Method | Purpose                    |
| -------------------- | ------ | -------------------------- |
| `/api/users`         | GET    | Get demo users             |
| `/api/posts`         | GET    | Get all posts and comments |
| `/api/posts`         | POST   | Create a post              |
| `/api/posts/[id]`    | PATCH  | Update a post              |
| `/api/posts/[id]`    | DELETE | Delete a post              |
| `/api/comments`      | POST   | Create a comment           |
| `/api/comments/[id]` | DELETE | Delete a comment           |

## How to Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/abarman079/roleboard-rbac-task.git
cd roleboard-rbac-task
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create environment file

Create a `.env` file in the project root and add:

```env
DATABASE_URL="file:./prisma/dev.db"
```

### 4. Run Prisma migration

```bash
npx prisma migrate dev
```

### 5. Seed the database

```bash
npx prisma db seed
```

### 6. Start the development server

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

## Demo Users

| Display Name  | Role         |
| ------------- | ------------ |
| Super Admin   | Super Admin  |
| Moderator     | Moderator    |
| Akib Regular  | Regular User |
| Hasan Regular | Regular User |
| Guest Visitor | Guest        |

## Testing Checklist

| Test Case                                        | Expected Result |
| ------------------------------------------------ | --------------- |
| Guest creates post                               | Blocked         |
| Guest creates comment                            | Blocked         |
| Regular User creates post                        | Allowed         |
| Regular User edits own post                      | Allowed         |
| Regular User edits another user's post           | Blocked         |
| Regular User deletes own post                    | Allowed         |
| Regular User deletes another user's post         | Blocked         |
| User B comments on User A's post                 | Allowed         |
| User A deletes User B's comment on User A's post | Allowed         |
| User C deletes User B's comment on User A's post | Blocked         |
| Moderator deletes any post/comment               | Allowed         |
| Super Admin deletes any post/comment             | Allowed         |

## Notes

This project uses demo user switching instead of real login so the role permissions can be tested quickly.
Even though the frontend shows allowed and blocked actions, the API routes also check permission before changing database data.
