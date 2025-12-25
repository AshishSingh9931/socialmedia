import express from "express";
import { Comment } from "../models/Comment.js";

const router = express.Router();

// Create comment
router.post("/", async (req, res) => {
  try {
    const { postId, userId, text } = req.body;
    const comment = await Comment.create({
      post: postId,
      user: userId,
      text
    });

    const populated = await comment
      .populate("user", "username name")
      .populate("post", "content");
    res.status(201).json(populated);
  } catch (err) {
    console.error("Create comment error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get comments for a post
router.get("/post/:postId", async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .sort({ createdAt: 1 })
      .populate("user", "username name");

    res.json(comments);
  } catch (err) {
    console.error("Get comments error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
