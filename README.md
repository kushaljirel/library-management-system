// Project README: setup, run, deploy, and usage instructions for the Library Management System.

# Library Management System (MERN)

A minimal, production-ready Library Management System with authentication, books management, and borrow/return transactions.

Technologies: React 18 + Vite + Tailwind CSS (frontend), Node.js + Express (backend), MongoDB Atlas (database), JWT + bcrypt (auth).

## Features

- Auth: register, login, JWT token (7d), logout, protected routes, auto-logout on token expiration
- Users: users collection with roles (`admin` or `user`); admin can view users
- Books: add/edit/delete/list/search (title/author/category), status (available/borrowed)
- Transactions: borrow a book, return a book, list transaction history, show overdue items (due after 14 days)
- Dashboard: totals for books, borrowed, overdue
- Security: JWT auth, bcrypt password hashing, role-based admin guard, Helmet, CORS, body size limit

## Monorepo Structure

- `frontend/`: React app (Vite + Tailwind CSS)
- `backend/`: Express API server (MongoDB with Mongoose)

## Prerequisites

- Node.js 18+
- npm 9+
- A free MongoDB Atlas cluster (see below)

## 1) Create a free MongoDB Atlas cluster

1. Go to the MongoDB Atlas website (`https://www.mongodb.com/cloud/atlas`) and sign up.
2. Create a new free tier cluster.
3. Create a database user (username/password) and allow access from your IP (or 0.0.0.0/0 for dev).
4. Get the connection string (Driver: Node.js) and replace `<username>`, `<password>`, and `<cluster-url>` placeholders.
   - It should look like: `mongodb+srv://<username>:<password>@<cluster-url>/library?retryWrites=true&w=majority&appName=<appName>`

## 2) Backend: Environment variables

Copy `backend/.env.example` to `backend/.env` and edit:

```
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=super_secure_jwt_secret
PORT=5000
FRONTEND_URL=http://localhost:5173
JWT_EXPIRES_IN=7d
```

- `MONGODB_URI`: Atlas connection string
- `JWT_SECRET`: any strong random string
- `PORT`: defaults to 5000
- `FRONTEND_URL`: frontend origin for CORS (local dev: `http://localhost:5173`)
- `JWT_EXPIRES_IN`: token lifetime (default 7d)

## 3) Local Development

Open two terminals from the project root.

Backend:
```
cd backend
npm install
npm run dev
```

Frontend:
```
cd frontend
npm install
npm run dev
```

- Frontend runs at `http://localhost:5173`
- Backend runs at `http://localhost:5000`
- API base URL defaults to `http://localhost:5000/api`. To override, set `VITE_API_URL` in `frontend/.env` (optional).

## 4) Seed initial data

Create an admin user and sample books:

```
cd backend
npm run seed
```

Default admin credentials:
- Email: `admin@library.com`
- Password: `Admin123!`

## 5) Deployment (Free tiers)

### Backend on Render (recommended) or Railway

- Repo: push your code to GitHub.
- On Render:
  - Create a new Web Service from your repo root.
  - Build Command: `cd backend && npm install`
  - Start Command: `cd backend && npm start`
  - Environment Variables:
    - `MONGODB_URI`
    - `JWT_SECRET`
    - `PORT` (Render sets `PORT`, but we also support 5000 default)
    - `FRONTEND_URL` (your Vercel URL after you deploy frontend)
    - `JWT_EXPIRES_IN` (optional)
- On Railway:
  - Create a new project, deploy from repo.
  - Set same environment variables (add `PORT` if required by Railway).

After deploy, note your backend base URL (e.g., `https://your-backend.onrender.com`). The API base is `${BACKEND_URL}/api`.

### Frontend on Vercel

- From your GitHub repo, import project into Vercel.
- Set in Project Settings → Environment Variables:
  - `VITE_API_URL` → your backend API base URL, e.g., `https://your-backend.onrender.com/api`
- Build command: `cd frontend && npm install && npm run build`
- Output directory: `frontend/dist`
- Vercel will serve the built React app.

Update your backend `FRONTEND_URL` to your Vercel domain (e.g., `https://your-frontend.vercel.app`) for CORS.

## 6) Notes

- JWT is stored in `localStorage` to keep the stack simple without server-managed sessions or cookies. Interceptors add `Authorization: Bearer <token>` to API requests. The app auto-logs out on 401 or when the token is detected as expired.
- Overdue: a book is overdue when a transaction's `returnDate` is null and `borrowDate + 14 days < now`.

## 7) API Overview

- Auth: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- Users (admin): `GET /api/users`
- Books:
  - `GET /api/books` (query: `q`, `category`, `status`)
  - `GET /api/books/:id`
  - `POST /api/books` (admin)
  - `PUT /api/books/:id` (admin)
  - `DELETE /api/books/:id` (admin, only when available)
- Transactions:
  - `POST /api/transactions/borrow` (body: `{ bookId }`)
  - `POST /api/transactions/return` (body: `{ bookId }`)
  - `GET /api/transactions` (admin: all, user: own)
  - `GET /api/transactions/active` (user's active borrows)
  - `GET /api/transactions/overdue` (admin: all overdue, user: own overdue)
  - `GET /api/transactions/stats` (counts for dashboard)

## 8) Scripts

Backend:
- `npm run dev`: dev with nodemon
- `npm start`: production start
- `npm run seed`: seed initial admin and sample books

Frontend:
- `npm run dev`: dev server
- `npm run build`: build
- `npm run preview`: preview built app

Happy building!


## Documentation

- See `docs/` for detailed documents:
  - [Features](docs/features.md)
  - [System Design](docs/system-design.md)
  - [Docs Home](docs/README.md)

