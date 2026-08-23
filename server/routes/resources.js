import { Router } from "express";
import Resource from "../models/Resource.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", requireAuth, async (req, res) => {
  try {
    const { category, q, difficulty, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (category && category !== "All") filter.category = category;
    if (difficulty && difficulty !== "All") filter.difficulty = difficulty;
    if (q && q.trim()) {
      const re = new RegExp(q.trim(), "i");
      filter.$or = [
        { title: re },
        { description: re },
        { tags: { $in: [re] } },
      ];
    }
    const [resources, total] = await Promise.all([
      Resource.find(filter)
        .sort({ createdAt: -1 })
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit)),
      Resource.countDocuments(filter),
    ]);
    res.json({ resources, total, page: Number(page) });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch resources", error: err.message });
  }
});

export default router;
