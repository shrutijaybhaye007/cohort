/**
 * serverApi.js — Drop-in replacement for mockApi.js.
 *
 * Every function matches mockApi.js's name and return shape so pages
 * don't need to change beyond a single import swap.
 *
 * The app uses this file when VITE_USE_REAL_API=true (see client/.env).
 */
import api from "./client";

// ─── Session helpers ──────────────────────────────────────────────────────

function saveSession({ user, token }) {
  localStorage.setItem("cohort_token", token);
  return { ...user, id: user._id || user.id };
}

// ─── Auth ─────────────────────────────────────────────────────────────────

export async function login({ email, password }) {
  const { data } = await api.post("/auth/login", { email, password });
  const user = saveSession(data);
  return { user };
}

export async function register({ name, email, password, university, program, year }) {
  const { data } = await api.post("/auth/register", {
    name, email, password, university, program, year,
  });
  const user = saveSession(data);
  return { user };
}

export async function logout() {
  localStorage.removeItem("cohort_token");
}

export async function getSession() {
  if (!localStorage.getItem("cohort_token")) return null;
  try {
    const { data } = await api.get("/auth/session");
    const u = data.user || data;
    return { ...u, id: u._id || u.id };
  } catch {
    localStorage.removeItem("cohort_token");
    return null;
  }
}

// ─── Users / Profile ──────────────────────────────────────────────────────

export async function getUser(id) {
  const { data } = await api.get(`/users/${id}`);
  return normalizeUser(data);
}

export async function updateProfile(_id, patch) {
  const { data } = await api.patch("/users/me", patch);
  return normalizeUser(data);
}

export async function listUsers({ q = "" } = {}) {
  const { data } = await api.get("/users", { params: q ? { q } : {} });
  return data.map(normalizeUser);
}

// ─── Posts / Feed ─────────────────────────────────────────────────────────

export async function listPosts() {
  const { data } = await api.get("/posts");
  return data.map(normalizePost);
}

export async function createPost({ content, tag }) {
  const { data } = await api.post("/posts", { content, tag });
  return normalizePost(data);
}

export async function toggleLike(postId) {
  const { data } = await api.post(`/posts/${postId}/like`);
  return normalizePost(data);
}

export async function addComment(postId, { content }) {
  const { data } = await api.post(`/posts/${postId}/comments`, { content });
  return normalizePost(data);
}

export async function deletePost(postId) {
  await api.delete(`/posts/${postId}`);
}

// ─── Connections / Network ────────────────────────────────────────────────

export async function getConnections() {
  const { data } = await api.get("/connections");
  // Server returns ObjectIds; normalize to strings for component comparisons
  return {
    connected: (data.connected || []).map(String),
    pending: (data.pending || []).map(String),
    incoming: (data.incoming || []).map(String),
  };
}

export async function sendConnectionRequest(targetId) {
  await api.post(`/connections/${targetId}/request`);
  return getConnections();
}

export async function acceptConnectionRequest(targetId) {
  await api.post(`/connections/${targetId}/accept`);
  return getConnections();
}

export async function ignoreConnectionRequest(targetId) {
  await api.delete(`/connections/${targetId}/ignore`);
  return getConnections();
}

// ─── Opportunities ────────────────────────────────────────────────────────

export async function getOpportunities({ type = "All", q = "" } = {}) {
  const params = {};
  if (type && type !== "All") params.type = type;
  if (q) params.q = q;
  const { data } = await api.get("/opportunities", { params });
  // Server returns { opportunities, total, page }
  const opps = data.opportunities || data;
  return opps.map((o) => ({ ...o, id: o._id || o.id }));
}

// ─── Resources ────────────────────────────────────────────────────────────

export async function getResources({ category = "All", q = "", difficulty = "All" } = {}) {
  const params = {};
  if (category && category !== "All") params.category = category;
  if (difficulty && difficulty !== "All") params.difficulty = difficulty;
  if (q) params.q = q;
  const { data } = await api.get("/resources", { params });
  const res = data.resources || data;
  return res.map((r) => ({ ...r, id: r._id || r.id }));
}

// ─── Development Goals ────────────────────────────────────────────────────

export async function getGoals() {
  const { data } = await api.get("/development/goals");
  return data.map((g) => ({ ...g, id: g._id || g.id }));
}

export async function addGoal({ title, targetDate }) {
  const { data } = await api.post("/development/goals", { title, targetDate });
  return { ...data, id: data._id || data.id };
}

export async function updateGoal(id, patch) {
  const { data } = await api.put(`/development/goals/${id}`, patch);
  return { ...data, id: data._id || data.id };
}

export async function deleteGoal(id) {
  await api.delete(`/development/goals/${id}`);
}

// ─── Notifications ────────────────────────────────────────────────────────

export async function getNotifications() {
  const { data } = await api.get("/notifications");
  return data.map((n) => ({ ...n, id: n._id || n.id }));
}

export async function markNotificationRead(id) {
  await api.put(`/notifications/${id}/read`);
}

export async function markAllNotificationsRead() {
  await api.put("/notifications/read-all");
}

// resetDemoData is only meaningful in mock mode. In real API mode this is a no-op.
// The Settings page checks the return value and shows an appropriate message.
export async function resetDemoData() {
  return false; // signals "not applicable in real API mode"
}


// ─── Normalize helpers ────────────────────────────────────────────────────
// Ensure components get consistent { id, authorId } shapes whether the
// server returns populated objects or plain ObjectId strings.

function normalizeUser(u) {
  if (!u) return null;
  return { ...u, id: u._id || u.id };
}

function normalizePost(post) {
  if (!post) return null;
  return {
    ...post,
    id: post._id || post.id,
    authorId: post.author?._id || post.author?.id || post.author,
    likes: (post.likes || []).map((l) => String(l._id || l)),
    comments: (post.comments || []).map((c) => ({
      ...c,
      id: c._id || c.id,
      authorId: c.author?._id || c.author?.id || c.author,
    })),
  };
}
