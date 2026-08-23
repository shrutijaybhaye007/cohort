import { Router } from "express";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

const UPDATABLE_FIELDS = [
  "name", "headline", "university", "program", "year", "location",
  "bio", "skills", "skillProficiencies", "interests", "projects",
  "certifications", "achievements", "links", "avatarColor", "avatarUrl",
  "onboardingComplete",
];

// List users for network discovery (excludes the requesting user)
router.get("/", requireAuth, async (req, res) => {
  try {
    const { q } = req.query;
    const filter = { _id: { $ne: req.userId } };
    if (q && q.trim()) {
      const re = new RegExp(q.trim(), "i");
      filter.$or = [
        { name: re },
        { headline: re },
        { university: re },
        { program: re },
        { skills: { $in: [re] } },
      ];
    }
    const users = await User.find(filter).select("-password").limit(50);
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

// Get current user's own profile
router.get("/me", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
});

// Get a specific user by ID
router.get("/:id", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user" });
  }
});

// Update current user's profile
router.patch("/me", requireAuth, async (req, res) => {
  try {
    const patch = {};
    for (const key of UPDATABLE_FIELDS) {
      if (req.body[key] !== undefined) patch[key] = req.body[key];
    }
    const user = await User.findByIdAndUpdate(req.userId, patch, {
      new: true,
      runValidators: true,
    }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to update profile", error: err.message });
  }
});

export default router;
