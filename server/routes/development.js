import { Router } from "express";
import DevelopmentGoal from "../models/DevelopmentGoal.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/goals", requireAuth, async (req, res) => {
  try {
    const goals = await DevelopmentGoal.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(goals);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch goals" });
  }
});

router.post("/goals", requireAuth, async (req, res) => {
  try {
    const { title, targetDate } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }
    const goal = await DevelopmentGoal.create({
      user: req.userId,
      title: title.trim(),
      targetDate: targetDate || undefined,
    });
    res.status(201).json(goal);
  } catch (err) {
    res.status(500).json({ message: "Failed to create goal" });
  }
});

router.put("/goals/:id", requireAuth, async (req, res) => {
  try {
    const { status, title } = req.body;
    const patch = {};
    if (status) patch.status = status;
    if (title) patch.title = title.trim();
    const goal = await DevelopmentGoal.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      patch,
      { new: true, runValidators: true }
    );
    if (!goal) return res.status(404).json({ message: "Goal not found" });
    res.json(goal);
  } catch (err) {
    res.status(500).json({ message: "Failed to update goal", error: err.message });
  }
});

router.delete("/goals/:id", requireAuth, async (req, res) => {
  try {
    const goal = await DevelopmentGoal.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });
    if (!goal) return res.status(404).json({ message: "Goal not found" });
    res.json({ message: "Goal deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete goal" });
  }
});

export default router;
