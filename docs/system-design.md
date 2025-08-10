# System Design

A simple, scalable architecture for a library management system built on MERN.

## Architecture Overview

Client (React, Vite, Tailwind)
  |
  | HTTPS (Axios with JWT Bearer)
  v
API (Express)
  - Middlewares: Helmet, CORS allowlist (FRONTEND_URL), JSON body limit, morgan
  - Auth: JWT verification middleware, role guard (admin)
  - Routes: /auth, /books, /users, /transactions, /health
  |
  v
MongoDB (Mongoose)
  - Collections: users, books, transactions

## Backend Components
- `server.js`: App setup (Helmet, CORS, parsers, logging), routes, health check, 404, error handler
- Middlewares
  - Auth: validates `Authorization: Bearer <token>`, attaches `{ id, email, name, role }`
  - Role: `requireAdmin` enforces admin-only access
- Routes
  - `/auth`: `POST /register`, `POST /login`, `GET /me`
  - `/books`: `GET /`, `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id`
  - `/users`: `GET /` (admin)
  - `/transactions`: `POST /borrow`, `POST /return`, `GET /`, `GET /active`, `GET /overdue`, `GET /stats`
- Error Handling: centralized handler returns `{ message }` with appropriate HTTP status

## Data Models
- User
  - `{ name, email(unique, lowercase), password(hash), role('admin'|'user'), timestamps }`
  - Methods: `comparePassword(candidate)`
- Book
  - `{ title, author, category?, status('available'|'borrowed'), timestamps }`
- Transaction
  - `{ user: ObjectId<User>, book: ObjectId<Book>, borrowDate, dueDate, returnDate?, timestamps }`
  - Index: `{ user: 1, book: 1, returnDate: 1 }`

## Core Flows
### Login
1. Client → `POST /auth/login` with `{ email, password }`
2. Server verifies credentials; responds with `{ token, user }`
3. Client saves token; Axios attaches `Authorization` header; navigates to protected routes

### Registration
1. Client → `POST /auth/register` with `{ name, email, password }`
2. Server creates user, hashes password, returns `{ token, user }`

### Borrow a Book
1. Client → `POST /transactions/borrow` with `{ bookId }`
2. Server ensures book is available and user has no active borrow for it
3. Creates transaction with `dueDate = now + 14 days`, sets book `status = 'borrowed'`

### Return a Book
1. Client → `POST /transactions/return` with `{ bookId }`
2. Server finds active borrow, sets `returnDate = now`, updates book to `available` if no other active borrows exist

### Overdue Calculation
- Overdue if `returnDate = null` and `dueDate < now`
- Admin sees all overdue; user sees their own

## Security
- JWT signed with `JWT_SECRET`, expiry via `JWT_EXPIRES_IN` (default 7d)
- Helmet-enabled HTTP security headers
- CORS allowlist (`FRONTEND_URL`) prevents unauthorized origins
- No passwords returned by API; hashed with bcrypt
- Consistent 401/403 responses for auth/role violations

## Scalability & Operations
- Stateless API (JWT) supports horizontal scaling
- MongoDB indexes for typical queries; consider additional indexes on `books.status` and `books.category`
- Logging via morgan; extend with structured logs and monitoring
- Deployment:
  - Backend: Render/Railway (set `MONGODB_URI`, `JWT_SECRET`, `PORT`, `FRONTEND_URL`)
  - Frontend: Vercel (`VITE_API_URL` pointing to backend `/api`)

## Configuration
- Backend `.env`:
  - `MONGODB_URI`, `JWT_SECRET`, `PORT`, `FRONTEND_URL`, `JWT_EXPIRES_IN`
- Frontend `.env` (optional):
  - `VITE_API_URL` → backend API base URL

## Future Enhancements
- Add rate limiting (e.g., express-rate-limit)
- Request validation (zod/joi) and better client-side form validation
- Role expansion (e.g., librarians), audit logs, reservations/waitlists
- Pagination and sorting for large book/transaction lists
