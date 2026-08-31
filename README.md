# Cohort — Professional Networking Platform for Higher Education Students

> **GPI Internship Project** — Full-Stack Web Application  
> Problem Statement: *Unavailability of a Professional Networking Platform for Higher Education Students for Continuous Professional Development*

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, React Router v7 |
| Backend | Node.js, Express.js (ESM) |
| Database | MongoDB (Mongoose ODM) |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| Security | helmet, express-rate-limit, CORS origin restriction |

---

## Project Structure

```
campus-network/
├── client/          # React frontend (Vite)
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
└── server/          # Express backend
    ├── models/      ← 7 Mongoose models
    ├── routes/      ← 8 REST route groups
    ├── middleware/  ← JWT auth guard
    ├── seeds/       ← DB seed script
    └── config/      ← MongoDB connection
```

---

## Running the App

### Mode A — Demo/Offline (no backend needed)

```bash
cd client
npm install
npm run dev
```

Open `http://localhost:5173`. Uses in-memory localStorage data.  
Default credentials: **any email / any password** (mock accepts all).

---

### Mode B — Full-Stack (React → Express → MongoDB)

#### 1. Start MongoDB
```bash
# Local MongoDB must be running on port 27017
# Or set MONGO_URI in server/.env to a MongoDB Atlas URI
```

#### 2. Configure the server
```bash
cd server
cp .env.example .env
# Edit .env — set MONGO_URI and a strong JWT_SECRET
npm install
```

#### 3. (Optional) Seed the database
```bash
node seeds/seed.js
# Creates demo users, posts, opportunities, resources
# Demo login after seeding: sanket@demo.com / demo1234
```

#### 4. Start the server
```bash
npm start
# API runs on http://localhost:5000
```

#### 5. Configure the client and start
```bash
cd client
cp .env.example .env
# Set VITE_USE_REAL_API=true in client/.env
npm run dev
# App runs on http://localhost:5173
```

---

## Features

| Feature | Page | Status |
|---------|------|--------|
| Register / Login (JWT) | `/register`, `/login` | ✅ |
| Onboarding wizard (4 steps) | `/onboarding` | ✅ |
| Professional dashboard | `/` | ✅ |
| Activity feed (post, like, comment, delete) | `/feed` | ✅ |
| Network / Connections | `/network` | ✅ |
| Opportunities (internships, hackathons, …) | `/opportunities` | ✅ |
| Learning resources | `/resources` | ✅ |
| Development goals + skill tracking | `/development` | ✅ |
| Full profile editor | `/profile` | ✅ |
| Notifications | `/notifications` | ✅ |
| Settings | `/settings` | ✅ |

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | — | Register new user |
| POST | `/api/auth/login` | — | Login, returns JWT |
| GET | `/api/auth/session` | ✅ | Get current user |
| GET | `/api/users` | ✅ | List users (search: `?q=`) |
| GET | `/api/users/me` | ✅ | Get own profile |
| PATCH | `/api/users/me` | ✅ | Update own profile |
| GET | `/api/users/:id` | ✅ | Get user by ID |
| GET | `/api/posts` | ✅ | Get all posts |
| POST | `/api/posts` | ✅ | Create post |
| POST | `/api/posts/:id/like` | ✅ | Toggle like |
| POST | `/api/posts/:id/comments` | ✅ | Add comment |
| DELETE | `/api/posts/:id` | ✅ | Delete own post |
| GET | `/api/connections` | ✅ | Get connections |
| POST | `/api/connections/:id/request` | ✅ | Send connection request |
| POST | `/api/connections/:id/accept` | ✅ | Accept request |
| DELETE | `/api/connections/:id/ignore` | ✅ | Decline request |
| GET | `/api/opportunities` | ✅ | List opportunities |
| GET | `/api/resources` | ✅ | List resources |
| GET | `/api/notifications` | ✅ | Get notifications |
| PUT | `/api/notifications/read-all` | ✅ | Mark all read |
| PUT | `/api/notifications/:id/read` | ✅ | Mark one read |
| GET | `/api/development/goals` | ✅ | Get user goals |
| POST | `/api/development/goals` | ✅ | Create goal |
| PUT | `/api/development/goals/:id` | ✅ | Update goal |
| DELETE | `/api/development/goals/:id` | ✅ | Delete goal |
| GET | `/api/health` | — | Health check |

---

## Security

- Passwords hashed with `bcryptjs` (salt rounds: 10)
- JWT tokens expire in 7 days
- `helmet` security headers on all responses
- CORS restricted to `CLIENT_URL` origin
- Auth rate limiting: 20 requests / 15 min per IP
- Global rate limiting: 300 requests / 15 min per IP
- Server never leaks `err.message` stack traces in production
- All write routes enforce server-side ownership checks
- Password field excluded from all query results (`select: false`)
