import { Router } from "express";
import Connection from "../models/Connection.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// Returns the caller's network split into connected / pending (sent) / incoming (received).
router.get("/", requireAuth, async (req, res) => {
  const all = await Connection.find({
    $or: [{ requester: req.userId }, { recipient: req.userId }],
  });

  const connected = [];
  const pending = [];
  const incoming = [];

  for (const c of all) {
    const isRequester = c.requester.equals(req.userId);
    const otherId = isRequester ? c.recipient : c.requester;
    if (c.status === "accepted") connected.push(otherId);
    else if (isRequester) pending.push(otherId);
    else incoming.push(otherId);
  }

  res.json({ connected, pending, incoming });
});

router.post("/:targetId/request", requireAuth, async (req, res) => {
  const { targetId } = req.params;
  if (targetId === req.userId) return res.status(400).json({ message: "Can't connect with yourself" });

  try {
    const connection = await Connection.create({ requester: req.userId, recipient: targetId });
    res.status(201).json(connection);
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: "Request already exists" });
    res.status(500).json({ message: "Could not send request", error: err.message });
  }
});

router.post("/:targetId/accept", requireAuth, async (req, res) => {
  const connection = await Connection.findOneAndUpdate(
    { requester: req.params.targetId, recipient: req.userId, status: "pending" },
    { status: "accepted" },
    { new: true }
  );
  if (!connection) return res.status(404).json({ message: "Request not found" });
  res.json(connection);
});

router.delete("/:targetId/ignore", requireAuth, async (req, res) => {
  await Connection.findOneAndDelete({
    requester: req.params.targetId,
    recipient: req.userId,
    status: "pending",
  });
  res.status(204).end();
});

export default router;
