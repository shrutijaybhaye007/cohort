import { Router } from "express";
import Opportunity from "../models/Opportunity.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", requireAuth, async (req, res) => {
  try {
    const { type, q, page = 1, limit = 20 } = req.query;
    const filter = { isActive: true };
    if (type && type !== "All") filter.type = type;
    if (q && q.trim()) {
      const re = new RegExp(q.trim(), "i");
      filter.$or = [
        { title: re },
        { organization: re },
        { description: re },
      ];
    }
    const [opportunities, total] = await Promise.all([
      Opportunity.find(filter)
        .sort({ deadline: 1, createdAt: -1 })
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit)),
      Opportunity.countDocuments(filter),
    ]);
    res.json({ opportunities, total, page: Number(page) });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch opportunities", error: err.message });
  }
});

export default router;
