# Self-Improvement App

A full-stack web application for personal growth: habits, journaling, plans and progress tracking.
Built as a learning project. Progress is tracked in [docs/ROADMAP.md](docs/ROADMAP.md).

## Tech Stack

**Frontend:** React (Vite), React Router, react-hook-form, axios, Tailwind CSS, shadcn/ui

**Backend:** Node.js, Express 5, PostgreSQL (`pg`, plain SQL), node-pg-migrate, zod, JWT, bcrypt, cookie-parser, helmet

## Project Structure

```
├── backend/
│   ├── migrations/      # database schema changes (SQL, run with node-pg-migrate)
│   ├── routes/          # URL → middleware → controller
│   ├── middleware/      # requireAuth, validate, errorHandler
│   ├── schemas/         # zod validation rules
│   ├── controllers/     # request handling logic
│   ├── models/          # SQL queries
│   ├── utils/           # AppError
│   ├── config.js        # the only place that reads .env
│   ├── database.js      # PostgreSQL connection pool
│   └── app.js           # Express app and middleware order
├── frontend/
│   └── src/
│       ├── api/         # axios client
│       ├── context/     # AuthContext (who is logged in)
│       ├── layouts/     # AppLayout (sidebar + page)
│       ├── components/  # shared components (ui/ = shadcn)
│       ├── pages/       # one component per page
│       └── utils/       # ProtectedRoutes
└── docs/
    └── ROADMAP.md
```

## Setup

### Prerequisites

- Node.js 22.12 or later
- PostgreSQL 14 or later
- Git

### 1. Database

Connect to PostgreSQL as an admin user (e.g. `postgres`) and create a dedicated user and database for the app:

```sql
CREATE ROLE selfimprovement_app LOGIN PASSWORD 'choose_a_password';
CREATE DATABASE selfimprovement_dev OWNER selfimprovement_app;
```

### 2. Backend

```bash
cd backend
npm install
```

Copy `backend/.env.example` to `backend/.env` and fill in the values:

```env
DATABASE_URL=postgres://selfimprovement_app:choose_a_password@localhost:5432/selfimprovement_dev
JWT_SECRET=a-long-random-string
PORT=3000
CORS_ORIGIN=http://localhost:5173
```

Generate a strong `JWT_SECRET` with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Create the tables, then start the server:

```bash
npm run migrate up
npm run dev
```

The backend runs on `http://localhost:3000`. `npm run dev` restarts automatically when a file changes.

### 3. Frontend

```bash
cd frontend
npm install
```

Copy `frontend/.env.example` to `frontend/.env` (default: `VITE_API_URL=http://localhost:3000`), then:

```bash
npm run dev
```

The frontend runs on `http://localhost:5173`.

## Authentication Flow

1. **Register:** the frontend sends nickname, email and password. The backend validates them (zod), hashes the password (bcrypt) and stores the user.
2. **Login:** the backend checks the password and puts a signed JWT in an **httpOnly cookie**. JavaScript can't read it, so an injected script can't steal it.
3. **Every request:** the browser sends the cookie automatically. The `requireAuth` middleware verifies it and sets `req.user`.
4. **App load:** the frontend calls `GET /api/auth/me` to find out who is logged in (`AuthContext`).
5. **Logout:** the backend clears the cookie.

## API

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | no | Create an account (`email`, `password`, `nickname`) |
| POST | `/api/auth/login` | no | Log in (`email`, `password`), sets the `token` cookie |
| GET | `/api/auth/me` | yes | Current user |
| POST | `/api/auth/logout` | no | Clear the `token` cookie |

All errors are returned as JSON: `{ "message": "...", "errors": [{ "field": "...", "message": "..." }] }` (`errors` only for validation errors).

## Features

**Done**
- Registration and login with validation on both frontend and backend
- Cookie-based JWT authentication, protected routes, logout
- App layout with sidebar, 404 page

**Planned**
- Habit tracking (daily, weekly, monthly) with streaks and statistics
- Journal with notebooks, images and video
- Plans and goals with steps
- Calendar
- Selective sharing with other users
- Mobile support (installable PWA)

## Author

Tea

## License

This project is for educational purposes.
