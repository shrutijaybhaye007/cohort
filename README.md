# Cohort — Professional Networking Platform for Higher Education Students

> **GPI Internship Project** — Full-Stack Web Application  
> Problem Statement: *Unavailability of a Professional Networking Platform for Higher Education Students for Continuous Professional Development*

---

## 🚀 Live Deployment

| Service | URL |
|---------|-----|
| Frontend | https://cohort-client.onrender.com *(after deployment)* |
| Backend API | https://cohort-api.onrender.com/api/health *(after deployment)* |
| Repository | https://github.com/shrutijaybhaye007/cohort |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, React Router v7 |
| Backend | Node.js, Express.js (ESM) |
| Database | MongoDB Atlas (Mongoose ODM) |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| Security | helmet, express-rate-limit, CORS origin restriction |
| Deployment | Render (API + Static Site) + MongoDB Atlas |

---

## Project Structure

```
campus-network/
├── render.yaml          ← Render deployment blueprint
├── netlify.toml         ← Netlify alternative config
├── client/              # React frontend (Vite)
│   ├── src/
│   │   ├── api/
│   │   │   ├── index.js      ← API mode switcher (mock ↔ real)
│   │   │   ├── mockApi.js    ← localStorage mock (demo/offline)
│   │   │   ├── serverApi.js  ← real Express+MongoDB API
│   │   │   └── client.js     ← Axios base instance
│   │   ├── context/          ← AuthContext, NotificationContext
│   │   ├── hooks/            ← useDebounce, useFetch, useToast
│   │   ├── pages/            ← 10 pages
│   │   └── components/       ← 18 reusable components
└── server/              # Express backend
    ├── models/          ← 7 Mongoose models
    ├── routes/          ← 8 REST route groups
    ├── middleware/       ← JWT auth guard
    ├── seeds/           ← DB seed script
    └── config/          ← MongoDB connection
```

---

## Running Locally

### Demo Mode (no backend needed)

```bash
cd client
npm install
npm run dev     # http://localhost:5173
```

Uses localStorage — works offline. Any email/password accepted.

---

### Full-Stack Mode (React → Express → MongoDB)

**1. Start MongoDB** (local or Atlas)

**2. Configure & start the server**
```bash
cd server
cp .env.example .env
# Edit .env — set MONGO_URI and JWT_SECRET
npm install
npm start       # API on http://localhost:5000
```

**3. Configure & start the client**
```bash
cd client
cp .env.example .env
# Set VITE_USE_REAL_API=true and VITE_API_URL=http://localhost:5000/api
npm run dev     # http://localhost:5173
```

**4. (Optional) Seed demo data**
```bash
cd server
node seeds/seed.js
# Demo login: sanket@demo.com / demo1234
```

---

## Deploying to Render + MongoDB Atlas

See the full step-by-step guide in [`deployment_guide.md`](./DEPLOYMENT.md).

**Quick summary:**
1. Create free MongoDB Atlas cluster → copy connection URI
2. Render → New Web Service → root: `server` → add env vars (`MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`)
3. Render → New Static Site → root: `client` → add env vars (`VITE_API_URL`, `VITE_USE_REAL_API=true`)

---

## Features

| Feature | Page | Status |
|---------|------|--------|
| Register / Login (JWT) | `/register`, `/login` | ✅ |
| Onboarding wizard | `/onboarding` | ✅ |
| Professional dashboard | `/` | ✅ |
| Activity feed (post, like, comment, delete) | `/feed` | ✅ |
| Network / Connections | `/network` | ✅ |
| Opportunities | `/opportunities` | ✅ |
| Learning resources | `/resources` | ✅ |
| Development goals + skills | `/development` | ✅ |
| Profile editor | `/profile` | ✅ |
| Notifications | `/notifications` | ✅ |
| Settings | `/settings` | ✅ |

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/health` | — | Health check |
| POST | `/api/auth/register` | — | Register |
| POST | `/api/auth/login` | — | Login → JWT |
| GET | `/api/auth/session` | ✅ | Current user |
| GET | `/api/users` | ✅ | List users (`?q=search`) |
| GET | `/api/users/me` | ✅ | Own profile |
| PATCH | `/api/users/me` | ✅ | Update profile |
| GET | `/api/users/:id` | ✅ | User by ID |
| GET | `/api/posts` | ✅ | Feed posts |
| POST | `/api/posts` | ✅ | Create post |
| POST | `/api/posts/:id/like` | ✅ | Toggle like |
| POST | `/api/posts/:id/comments` | ✅ | Add comment |
| DELETE | `/api/posts/:id` | ✅ | Delete own post |
| GET | `/api/connections` | ✅ | My connections |
| POST | `/api/connections/:id/request` | ✅ | Send request |
| POST | `/api/connections/:id/accept` | ✅ | Accept |
| DELETE | `/api/connections/:id/ignore` | ✅ | Decline |
| GET | `/api/opportunities` | ✅ | Opportunities |
| GET | `/api/resources` | ✅ | Resources |
| GET | `/api/notifications` | ✅ | Notifications |
| PUT | `/api/notifications/read-all` | ✅ | Mark all read |
| GET | `/api/development/goals` | ✅ | Goals |
| POST | `/api/development/goals` | ✅ | Create goal |
| PUT | `/api/development/goals/:id` | ✅ | Update goal |
| DELETE | `/api/development/goals/:id` | ✅ | Delete goal |

---

## Security

- Passwords hashed with `bcryptjs` (salt rounds: 10)
- JWT tokens — 7-day expiry
- `helmet` security headers
- CORS restricted to `CLIENT_URL`
- Rate limiting: auth (20/15 min), global (300/15 min)
- No `err.message` exposure in production
- Server-side ownership checks on all write routes
- `trust proxy` set for Render's reverse proxy
