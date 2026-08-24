/**
 * api/index.js — API mode switcher
 *
 * Single import point for the entire app. Controls which backend is used:
 *
 *   VITE_USE_REAL_API=true  → serverApi.js (Express + MongoDB)
 *   VITE_USE_REAL_API=false → mockApi.js   (localStorage, default)
 *
 * Set in client/.env:
 *   VITE_USE_REAL_API=true
 *
 * All pages should import from "../api" (this file) not from mockApi/serverApi directly.
 * This is the only file that needs to change to flip between backends.
 */

// Vite statically replaces import.meta.env.VITE_USE_REAL_API at build time.
export * from "./serverApi";
