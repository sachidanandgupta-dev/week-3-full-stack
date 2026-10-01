# Week 3 – Full Stack Integration (MERN)

One project that covers all Week 3 deliverables:

| Requirement | Where |
|---|---|
| Full Stack To-Do App (auth, CRUD, routing) | `/login`, `/register`, `/tasks` |
| Image Upload (Multer + React preview/display) | `/images` |
| Mini Project: Task Manager (login + filtering) | `/tasks` – filter by status, priority, search |

**Stack:** React (Vite) · React Router (protected routes) · Context API · Axios · Express · MongoDB (Mongoose) · JWT · bcrypt · Multer

## Run locally
Requires Node 18+ and MongoDB running locally (or an Atlas URI).

```bash
# 1) Backend
cd server
npm install
# edit .env if needed (MONGO_URI, JWT_SECRET)
npm run dev          # http://localhost:5000

# 2) Frontend (new terminal)
cd client
npm install
npm run dev          # http://localhost:5173
```

## API
| Method | Route | Auth | Purpose |
|---|---|---|---|
| POST | `/api/auth/register` | – | Create account |
| POST | `/api/auth/login` | – | Login, returns JWT |
| GET | `/api/auth/me` | ✔ | Current user |
| GET | `/api/tasks?status=&priority=&search=` | ✔ | List/filter tasks |
| POST/PUT/DELETE | `/api/tasks[/:id]` | ✔ | Create / update / delete |
| POST | `/api/images` (field `image`) | ✔ | Upload (jpg/png/gif/webp, ≤2MB) |
| GET/DELETE | `/api/images[/:id]` | ✔ | List / delete uploads |

## Notes
- Never commit `server/.env` (already git-ignored). `.env.example` shows the variables.
- The Vite dev server proxies `/api` and `/uploads` to port 5000.
