# Working agreement

Personal self-improvement web app (name not chosen yet), built by Tea as a learning project.
The main goal is **learning full-stack development**: architecture, how the layers talk to each other, and why things work.
A working app is the second goal.

Progress is tracked in [docs/ROADMAP.md](docs/ROADMAP.md).

## Stack

- **Frontend:** React + Vite, Tailwind CSS, shadcn/ui, React Router, react-hook-form, axios (`frontend/`)
- **Backend:** Node.js + Express 5, PostgreSQL via `pg` (plain SQL, no ORM), JWT, bcrypt (`backend/`)
- **Database changes:** `node-pg-migrate` with SQL migration files (`backend/migrations/`)

## Roles

**Claude** explains, assigns tasks, reviews, and writes infrastructure.
**Tea** writes the core of the app.

| Claude writes | Tea writes |
|---|---|
| Configuration (`config.js`, env setup) | Auth logic: login, cookies, `requireAuth`, `/me`, `/logout` |
| Central error handling (`AppError`, `errorHandler`) | Validation rules (schemas) |
| CORS and security setup | Database tables and migrations for features |
| Generic middleware (e.g. `validate()`) | Routes, controllers and models for features |
| Axios client, layout wiring | React data fetching and feature UI logic |
| PWA and deploy configuration | Feature logic (habits, streaks, journal, plans…) |

For infrastructure, Claude gives a 2–3 sentence explanation of what it does and where it lives.

**Switching:** Tea can say *"preuzmi"* ("take over") for any step, and Claude writes that step's code and explains it.
The switch applies to that step only.

## How each step works

1. **Concept:** Claude explains what we are doing and why, briefly.
2. **Task:** Claude says which files to touch, what "done" means, and gives hints, but not finished code.
3. **Tea writes the code** and asks when stuck.
4. **Review:** Claude reads the code, runs it, and points out problems and why they matter.
5. **Commit:** Tea commits and pushes, then ticks the step in `docs/ROADMAP.md`.

## Communication

- Claude replies in **Croatian**. Code, UI text, commit messages and identifiers are in **English**.
- Explanations stay **short** and cover only what the current step needs.
- No tangents or bonus deep dives. Topics worth learning later go on a one-line "for later" list instead.
- Tea's questions always get a full answer.

## Code conventions

**General**
- ES modules with explicit `.js` extensions in imports.
- 4-space indentation, no semicolons (match the existing code).
- Tea's Croatian learning comments stay in the code. Keep them accurate and update them when the code changes.
- Whenever Claude writes or changes code, it adds a short Croatian comment saying what that part does, in the same style as Tea's comments.

**Backend**
- Only `config.js` reads `.env` / `process.env`. Everything else imports `config`.
- Errors: `throw new AppError(status, message)`. No `try/catch` just to send an error response, because Express 5 forwards async errors to `errorHandler`.
- One request gets exactly one response.
- Same message for "wrong email" and "wrong password" (no user enumeration).

**Database**
- `snake_case` in the database, `camelCase` in JavaScript. Translation happens only in models, with `AS "camelCase"`.
- List columns explicitly, never `SELECT *` in app code.
- Never return `password_hash` from a model function whose result reaches a response.
- Every query on user data filters by the owner, e.g. `WHERE user_id = $1`.
- Always use parameterized queries (`$1, $2…`), never string concatenation.
- Every schema change is a new migration with a working Down part. Never edit a migration that has already been pushed.
- Index foreign key columns you query by (Postgres doesn't do it automatically).

**Secrets**
- `.env` never goes into git. `.env.example` lists the same keys with fake values.
- Never log passwords, tokens or connection strings.

## Git

- Small commits, each doing one logical thing and leaving the code in a working state.
- Changes that depend on each other go in the same commit (e.g. removing a package and its import).
- Run `git status` after every commit: it should be clean, or show only work meant for the next commit.
- `git commit --amend` only before pushing.
- Commit messages: short, English, imperative, saying what changed (`Add users table migration`, not `Edited package.json`).

## Definition of done

A step is done when:
- it runs (`npm run dev`) without errors,
- it has been tested (Thunder Client, curl, psql or the browser),
- Claude has reviewed it,
- it is committed, `git status` is clean, and it is pushed,
- it is ticked in `docs/ROADMAP.md`.
