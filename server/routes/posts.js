import { Router } from "express";
import Post from "../models/Post.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", requireAuth, async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .limit(100)
      .populate("author", "name headline avatarColor")
      .populate("comments.author", "name avatarColor");
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Failed to load posts" });
  }
});


router.post("/", requireAuth, async (req, res) => {
  const { content, tag } = req.body;
  if (!content?.trim()) return res.status(400).json({ message: "Post content is required" });

  const post = await Post.create({ author: req.userId, content: content.trim(), tag });
  await post.populate("author", "name headline avatarColor");
  res.status(201).json(post);
});

router.post("/:id/like", requireAuth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found" });

  const has = post.likes.some((id) => id.equals(req.userId));
  post.likes = has ? post.likes.filter((id) => !id.equals(req.userId)) : [...post.likes, req.userId];
  await post.save();
  res.json(post);
});

router.post("/:id/comments", requireAuth, async (req, res) => {
  const { content } = req.body;
  if (!content?.trim()) return res.status(400).json({ message: "Comment content is required" });

  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found" });

  post.comments.push({ author: req.userId, content: content.trim() });
  await post.save();
  await post.populate("comments.author", "name avatarColor");
  res.status(201).json(post);
});

router.delete("/:id", requireAuth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found" });
  if (!post.author.equals(req.userId)) {
    return res.status(403).json({ message: "You can only delete your own posts" });
  }
  await post.deleteOne();
  res.status(204).end();
});

export default router;

