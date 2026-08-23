# Cohort

A professional networking platform for higher-education students — built to solve
a specific gap: once class ends, there's no continuous space for students, alumni,
and faculty to keep building a professional record together (unlike LinkedIn, which
isn't campus-shaped, or a Discord server, which doesn't persist a profile).

**MVP scope:** profiles, connections (send/accept/ignore), and a feed for posting
updates, research, and milestones — with likes and comments.

This repo is a **frontend-first build**: `client/` is a complete, polished, fully
working React app. It runs standalone with a realistic mock backend (`localStorage`
under the hood), so you can open it and use every feature immediately — no database
setup required. `server/` is a working Express + MongoDB API covering the same
MVP feature set, scaffolded so you can extend it (jobs board, events, mentorship
matching, etc.) rather than start from zero.

## Quick start (frontend only, zero setup)

```bash
cd client
npm install
npm run dev
```

Open the printed localhost URL. Click **Create your profile** to "register" (demo
auth accepts any email/password) and explore the feed, network, and profile pages.
Data persists in your browser's localStorage between reloads; there's a
`resetDemoData()` helper exported from `src/api/mockApi.js` if you want to reset it.

## Running the real backend

```bash
cd server
cp .env.example .env    # then fill in MONGO_URI and JWT_SECRET
npm install
npm run dev              # starts on http://localhost:5000
```

You'll need a MongoDB instance — either [MongoDB Atlas](https://www.mongodb.com/atlas)
(free tier, no local install) or a local `mongod`. Paste the connection string into
`MONGO_URI` in `server/.env`.

### Wiring the frontend to the real backend

The frontend currently imports from `src/api/mockApi.js` everywhere. To point it at
your running Express server instead:

1. Copy `client/.env.example` to `client/.env` and confirm `VITE_API_URL` matches
   your server (defaults to `http://localhost:5000/api`).
2. In each page that does `import * as api from "../api/mockApi"`, change the path
   to `"../api/serverApi"`. That file (`client/src/api/serverApi.js`) is a drop-in
   replacement — same function names, same return shapes — talking to your real API.

Files that import the API layer: `src/context/AuthContext.jsx`, `src/pages/Feed.jsx`,
`src/pages/Network.jsx`, `src/pages/Profile.jsx`.

## Project structure

```
campus-network/
├── client/                  React app (Vite)
│   └── src/
│       ├── api/
│       │   ├── mockApi.js      localStorage-backed mock backend (default)
│       │   ├── serverApi.js    real API wrapper, same interface as mockApi
│       │   ├── client.js       axios instance for serverApi
│       │   └── seedData.js     demo users/posts shown on first run
│       ├── components/         Avatar, GrowthRing, PostCard, AppShell, etc.
│       ├── context/AuthContext.jsx
│       └── pages/               Login, Register, Feed, Network, Profile
└── server/                  Express + MongoDB API
    ├── models/               User, Post, Connection (Mongoose schemas)
    ├── routes/                auth, users, posts, connections
    ├── middleware/auth.js     JWT verification
    └── server.js
```

## Design notes

The visual identity is built around a **growth ring** — a segmented circle around
each avatar (see `GrowthRing.jsx`), styled after tree growth rings, representing a
student's accumulating "development credits" as they post, connect, and build out
their profile. It's the one recurring motif tying the UI back to the actual problem:
professional growth that keeps accumulating past a single semester, instead of a
one-off gold star.

Palette: forest green (growth, academia) + a muted gold accent (achievement) on a
warm parchment background, paired with a serif display face (Fraunces) for identity
and a clean sans (Inter) for body text — deliberately avoiding the generic
cream-and-terracotta AI-template look.

## Extending this

Natural next features, given the models already in place:
- **Events/webinars** — new `Event` model, RSVP list, shows up on profiles and feed
- **Mentorship matching** — tag users as `mentor`/`mentee`, filter Network by role
- **Jobs board** — `Job` model posted by faculty/alumni, applications tracked per user
- **Notifications** — new connection requests and comments currently require a
  page reload/re-fetch; a `Notification` model + polling or WebSocket would close
  that gap
