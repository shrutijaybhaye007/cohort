import express from "express";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import connectionRoutes from "./routes/connections.js";
import opportunityRoutes from "./routes/opportunities.js";
import resourceRoutes from "./routes/resources.js";
import notificationRoutes from "./routes/notifications.js";
import developmentRoutes from "./routes/development.js";

dotenv.config();

const app = express();

// ─── Trust Render's reverse proxy (required for rate-limit by IP) ─────────────
app.set("trust proxy", 1);

// ─── Security ─────────────────────────────────────────────────────────────────

app.use(helmet());

// CORS — allow CLIENT_URL (supports comma-separated list for multiple origins)
const rawOrigins = process.env.CLIENT_URL || "http://localhost:5173";
const allowedOrigins = [
  ...rawOrigins.split(",").map((o) => o.trim()),
  "http://localhost:5173",
  "http://localhost:5174",
];

app.use(
  cors({
    origin: (origin, cb) => {
      // Allow same-origin / curl / Postman (no origin header) and listed origins
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      cb(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
  })
);

// General rate limit: 300 req / 15 min per IP
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many requests, please try again later." },
  })
);

// Stricter auth rate limit: 20 req / 15 min
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many auth attempts, please try again later." },
});

// ─── Body parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: false, limit: "2mb" }));

// ─── Health check ─────────────────────────────────────────────────────────────
app.get("/api/health", (_req, res) =>
  res.json({ status: "ok", ts: Date.now(), env: process.env.NODE_ENV || "development" })
);

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/connections", connectionRoutes);
app.use("/api/opportunities", opportunityRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/development", developmentRoutes);

// ─── 404 ─────────────────────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ message: "Route not found" }));

// ─── Global error handler ─────────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error("[Error]", err.message);
  const status = err.status || 500;
  const message =
    process.env.NODE_ENV === "production" && status >= 500
      ? "Internal server error"
      : err.message;
  res.status(status).json({ message });
});

// ─── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () =>
    console.log(
      `[Cohort] API running on port ${PORT} (${process.env.NODE_ENV || "development"})`
    )
  );
});
