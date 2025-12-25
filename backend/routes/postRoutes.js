import express from "express";
import { Post } from "../models/Post.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

// create post
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { userId, content } = req.body;

    const post = await Post.create({
      user: userId,
      content,
      image: req.file ? `/uploads/${req.file.filename}` : null
    });

    const populated = await post.populate("user", "username name");
    res.status(201).json(populated);
  } catch (err) {
    console.error("Create post error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET all posts in home feed
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("user", "username name")
      .populate("likes", "username name");

    res.json(posts);
  } catch (err) {
    console.error("Get posts error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET posts of a specific user
router.get("/user/:userId", async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.userId })
      .sort({ createdAt: -1 })
      .populate("user", "username name")
      .populate("likes", "username name");

    res.json(posts);
  } catch (err) {
    console.error("Get user posts error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// delete post
router.delete("/:id", async (req, res) => {
  try {
    const { userId } = req.body; 

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // simple check: sirf apna post delete
    if (post.user.toString() !== userId) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await post.deleteOne();
    res.json({ message: "Post deleted" });
  } catch (err) {
    console.error("Delete post error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// LIKE
router.post("/:id/like", async (req, res) => {
  try {
    const { userId } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (!post.likes.includes(userId)) {
      post.likes.push(userId);
      await post.save();
    }

    res.json({ message: "Post liked" });
  } catch (err) {
    console.error("Like error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// UNLIKE
router.post("/:id/unlike", async (req, res) => {
  try {
    const { userId } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.likes = post.likes.filter((id) => id.toString() !== userId);
    await post.save();

    res.json({ message: "Post unliked" });
  } catch (err) {
    console.error("Unlike error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
