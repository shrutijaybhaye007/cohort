import axios from "axios";

// Real API client for the Express + MongoDB backend in /server.
// Not used by default — the app ships wired to ./mockApi.js so it runs
// with zero setup. To connect your backend once it's ready:
//
//   1. In each page/component, change:
//        import { listPosts } from "../api/mockApi";
//      to:
//        import { listPosts } from "../api/serverApi";
//   2. Set VITE_API_URL in client/.env (see .env.example)
//
// This file is the low-level axios instance; api/serverApi.js (a thin
// wrapper matching mockApi.js's function names) is the piece you'd write
// against your actual route names.

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("cohort_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
