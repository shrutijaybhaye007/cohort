import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

function signToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

// Sanitize errors in production — never leak internal messages to client
function sanitize(err, defaultMsg) {
  if (process.env.NODE_ENV === "production") return { message: defaultMsg };
  return { message: defaultMsg, _dev: err.message };
}

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, university, program, year } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: "An account with this email already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, university, program, year });

    const token = signToken(user._id);
    const { password: _pw, ...safeUser } = user.toObject();
    res.status(201).json({ user: safeUser, token });
  } catch (err) {
    res.status(500).json(sanitize(err, "Registration failed"));
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid email or password" });

    const token = signToken(user._id);
    const { password: _pw, ...safeUser } = user.toObject();
    res.json({ user: safeUser, token });
  } catch (err) {
    res.status(500).json(sanitize(err, "Login failed"));
  }
});

// GET /api/auth/session — returns the current user from JWT (no password)
router.get("/session", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (err) {
    res.status(500).json(sanitize(err, "Session fetch failed"));
  }
});

export default router;
