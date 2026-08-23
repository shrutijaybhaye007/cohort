import {
  seedUsers,
  seedPosts,
  seedConnections,
  seedOpportunities,
  seedResources,
  seedNotifications,
  seedGoals,
} from "./seedData";

// localStorage-backed mock of the Express API.
// Swap this import for serverApi.js in any page to hit the real backend.

const DB_KEY = "cohort_db_v2";
const SESSION_KEY = "cohort_session_v1";
const LATENCY = 220;

function wait(ms = LATENCY) {
  return new Promise((r) => setTimeout(r, ms));
}

function loadDb() {
  const raw = localStorage.getItem(DB_KEY);
  if (raw) return JSON.parse(raw);
  const fresh = {
    users: seedUsers,
    posts: seedPosts,
    connections: seedConnections,
    opportunities: seedOpportunities,
    resources: seedResources,
    notifications: seedNotifications,
    goals: seedGoals,
  };
  localStorage.setItem(DB_KEY, JSON.stringify(fresh));
  return fresh;
}

function saveDb(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

function currentUserId() {
  return localStorage.getItem(SESSION_KEY) || null;
}

// ─── Auth ──────────────────────────────────────────────────────────────────

export async function login({ email }) {
  await wait();
  const db = loadDb();
  const self = db.users.find((u) => u.isSelf);
  localStorage.setItem(SESSION_KEY, self.id);
  return { user: self, email };
}

export async function register({ name, university, program, year }) {
  await wait();
  const db = loadDb();
  const self = db.users.find((u) => u.isSelf);
  if (name) self.name = name;
  if (university) self.university = university;
  if (program) self.program = program;
  if (year) self.year = year;
  self.onboardingComplete = false;
  saveDb(db);
  localStorage.setItem(SESSION_KEY, self.id);
  return { user: self };
}

export async function logout() {
  await wait(80);
  localStorage.removeItem(SESSION_KEY);
}

export async function getSession() {
  await wait(120);
  const id = currentUserId();
  if (!id) return null;
  const db = loadDb();
  return db.users.find((u) => u.id === id) || null;
}

// ─── Users ─────────────────────────────────────────────────────────────────

export async function getUser(id) {
  await wait();
  const db = loadDb();
  return db.users.find((u) => u.id === id) || null;
}

export async function updateProfile(_id, patch) {
  await wait();
  const db = loadDb();
  const id = _id || currentUserId();
  const idx = db.users.findIndex((u) => u.id === id);
  if (idx === -1) throw new Error("User not found");
  db.users[idx] = { ...db.users[idx], ...patch };
  saveDb(db);
  return db.users[idx];
}

export async function listUsers({ excludeSelf = true, q = "" } = {}) {
  await wait();
  const db = loadDb();
  let users = excludeSelf ? db.users.filter((u) => !u.isSelf) : db.users;
  if (q) {
    const re = new RegExp(q, "i");
    users = users.filter(
      (u) =>
        re.test(u.name) ||
        re.test(u.headline) ||
        re.test(u.university) ||
        (u.skills || []).some((s) => re.test(s))
    );
  }
  return users;
}

// ─── Posts / Feed ──────────────────────────────────────────────────────────

export async function listPosts() {
  await wait();
  const db = loadDb();
  return [...db.posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function createPost({ authorId, content, tag }) {
  await wait();
  const db = loadDb();
  const post = {
    id: `p${Date.now()}`,
    authorId,
    content,
    tag: tag || "Update",
    createdAt: new Date().toISOString(),
    likes: [],
    comments: [],
  };
  db.posts.unshift(post);
  saveDb(db);
  return post;
}

export async function toggleLike(postId, userId) {
  await wait(100);
  const db = loadDb();
  const post = db.posts.find((p) => p.id === postId);
  if (!post) throw new Error("Post not found");
  const has = post.likes.includes(userId);
  post.likes = has ? post.likes.filter((id) => id !== userId) : [...post.likes, userId];
  saveDb(db);
  return post;
}

export async function addComment(postId, { authorId, content }) {
  await wait(150);
  const db = loadDb();
  const post = db.posts.find((p) => p.id === postId);
  if (!post) throw new Error("Post not found");
  const comment = {
    id: `c${Date.now()}`,
    authorId,
    content,
    createdAt: new Date().toISOString(),
  };
  post.comments.push(comment);
  saveDb(db);
  return post;
}

export async function deletePost(postId) {
  await wait();
  const db = loadDb();
  db.posts = db.posts.filter((p) => p.id !== postId);
  saveDb(db);
}

// ─── Connections / Network ─────────────────────────────────────────────────

export async function getConnections() {
  await wait();
  const db = loadDb();
  return db.connections;
}

export async function sendConnectionRequest(targetId) {
  await wait(180);
  const db = loadDb();
  if (!db.connections.pending.includes(targetId)) {
    db.connections.pending.push(targetId);
  }
  saveDb(db);
  return db.connections;
}

export async function acceptConnectionRequest(targetId) {
  await wait(180);
  const db = loadDb();
  db.connections.incoming = db.connections.incoming.filter((id) => id !== targetId);
  if (!db.connections.connected.includes(targetId)) {
    db.connections.connected.push(targetId);
  }
  saveDb(db);
  return db.connections;
}

export async function ignoreConnectionRequest(targetId) {
  await wait(150);
  const db = loadDb();
  db.connections.incoming = db.connections.incoming.filter((id) => id !== targetId);
  saveDb(db);
  return db.connections;
}

// ─── Opportunities ─────────────────────────────────────────────────────────

export async function getOpportunities({ type = "All", q = "" } = {}) {
  await wait();
  const db = loadDb();
  let opps = db.opportunities || [];
  if (type && type !== "All") opps = opps.filter((o) => o.type === type);
  if (q) {
    const re = new RegExp(q, "i");
    opps = opps.filter(
      (o) => re.test(o.title) || re.test(o.organization) || re.test(o.description)
    );
  }
  return opps;
}

// ─── Resources ─────────────────────────────────────────────────────────────

export async function getResources({ category = "All", q = "", difficulty = "All" } = {}) {
  await wait();
  const db = loadDb();
  let res = db.resources || [];
  if (category && category !== "All") res = res.filter((r) => r.category === category);
  if (difficulty && difficulty !== "All") res = res.filter((r) => r.difficulty === difficulty);
  if (q) {
    const re = new RegExp(q, "i");
    res = res.filter(
      (r) =>
        re.test(r.title) ||
        re.test(r.description) ||
        (r.tags || []).some((t) => re.test(t))
    );
  }
  return res;
}

// ─── Notifications ─────────────────────────────────────────────────────────

export async function getNotifications() {
  await wait();
  const db = loadDb();
  return (db.notifications || [])
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function markNotificationRead(id) {
  await wait(80);
  const db = loadDb();
  const n = (db.notifications || []).find((n) => n.id === id);
  if (n) n.read = true;
  saveDb(db);
}

export async function markAllNotificationsRead() {
  await wait(100);
  const db = loadDb();
  (db.notifications || []).forEach((n) => {
    n.read = true;
  });
  saveDb(db);
}

// ─── Development Goals ─────────────────────────────────────────────────────

export async function getGoals() {
  await wait();
  const db = loadDb();
  return (db.goals || [])
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function addGoal({ title, targetDate }) {
  await wait();
  const db = loadDb();
  const goal = {
    id: `g${Date.now()}`,
    title,
    status: "not-started",
    targetDate: targetDate || null,
    createdAt: new Date().toISOString(),
  };
  db.goals = [goal, ...(db.goals || [])];
  saveDb(db);
  return goal;
}

export async function updateGoal(id, patch) {
  await wait();
  const db = loadDb();
  const idx = (db.goals || []).findIndex((g) => g.id === id);
  if (idx === -1) throw new Error("Goal not found");
  db.goals[idx] = { ...db.goals[idx], ...patch };
  saveDb(db);
  return db.goals[idx];
}

export async function deleteGoal(id) {
  await wait();
  const db = loadDb();
  db.goals = (db.goals || []).filter((g) => g.id !== id);
  saveDb(db);
}

// ─── Demo utility ──────────────────────────────────────────────────────────

export async function resetDemoData() {
  localStorage.removeItem(DB_KEY);
  localStorage.removeItem(SESSION_KEY);
  loadDb(); // Re-seed from seedData.js
}
