# Features

A clear, user-focused overview of the web application features.

## Roles
- Admin: full access to books CRUD, view users, see all transactions and overdue items
- User: personal borrowing flows, view/search books, see own transactions and overdue items

## Authentication
- Login (`/login`): Email + password; on success returns `{ token, user }`, stores token in localStorage
- Signup (`/signup`): Creates account; returns `{ token, user }`, logs in automatically
- Session: JWT stored under `lms_token`; auto-logout and redirect to `/login` on 401

## Navigation & Layout
- Navbar: role-aware links (dashboard, books, transactions; admin: users and book management)
- Protected routes: `ProtectedRoute` checks for a valid token; `adminOnly` enforces admin role

## Dashboard (`/dashboard`)
- Displays stats from `GET /api/transactions/stats`:
  - `totalBooks`: total number of books
  - `totalBorrowed`: how many are currently borrowed
  - `totalOverdue`: overdue count

## Books (`/books`)
- Browse and search books with filters:
  - `q`: matches title, author, or category (case-insensitive)
  - `category`: filter by category
  - `status`: `available` or `borrowed`
- Actions:
  - Borrow: `POST /api/transactions/borrow` with `{ bookId }` (requires availability)
  - Return: `POST /api/transactions/return` with `{ bookId }` (requires an active borrow by the user)
- Visibility: list is available to all authenticated users

## Book Management (Admin)
- Create (`/books/new`): `POST /api/books` with `{ title, author, category? }`
- Edit (`/books/:id/edit`): `PUT /api/books/:id` with any of `{ title, author, category }`
- Delete: `DELETE /api/books/:id` (blocked if `status = borrowed`)

## Users (Admin)
- List all users: `GET /api/users` (passwords are never returned)

## Transactions (`/transactions`)
- List transactions: `GET /api/transactions`
  - Admin: all transactions
  - User: only their own
- Active borrows: `GET /api/transactions/active` (user’s current borrows)
- Overdue:
  - Admin: `GET /api/transactions/overdue` shows all overdue items
  - User: the same endpoint shows only their overdue items

## Error Handling & Messaging
- Meaningful API error messages (e.g., borrowing a non-available book)
- Unauthorized (401) triggers token removal and redirect to `/login`

## Security
- JWT Bearer header added by Axios interceptor
- Backend CORS allowlist via `FRONTEND_URL`
- Helmet for secure HTTP headers
- Request body size limits applied

## Notes & Constraints
- Books require `title` and `author`
- Duplicate active borrow of the same book by the same user is prevented
- Overdue definition: `returnDate = null` and `dueDate < now` (14-day default)
