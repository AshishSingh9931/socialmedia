import express from "express";
import { User } from "../models/User.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

// register
router.post("/register", async (req, res) => {
  try {
    const { username, name, bio, password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const user = await User.create({
      username,
      name,
      bio,
      password,
    });

    user.password = undefined; // hide password
    res.status(201).json(user);

  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username }).select("+password");
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.password !== password) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    user.password = undefined;
    res.json(user);

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// serach user
router.get("/search/:query", async (req, res) => {
  try {
    const users = await User.find({
      username: { $regex: req.params.query, $options: "i" },
    }).select("username name avatar followers");

    res.json(users);

  } catch (err) {
    console.error("Search user error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// find user by username
router.get("/find/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select(
      "-password"
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);

  } catch (err) {
    console.error("Find user error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// get profile by id
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("followers", "username name avatar")
      .populate("following", "username name avatar");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);

  } catch (err) {
    console.error("Get user error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// upload avatar
router.post("/:id/avatar", upload.single("avatar"), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    user.avatar = `/uploads/${req.file.filename}`;
    await user.save();

    res.json({ avatar: user.avatar });

  } catch (err) {
    console.error("Avatar upload error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// follow user
router.post("/:id/follow", async (req, res) => {
  try {
    const { followerId } = req.body;

    // updateOne instead of save()
    await User.updateOne(
      { _id: req.params.id },
      { $addToSet: { followers: followerId } }
    );

    await User.updateOne(
      { _id: followerId },
      { $addToSet: { following: req.params.id } }
    );

    res.json({ message: "Followed successfully" });

  } catch (err) {
    console.error("Follow error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// unfollow user
router.post("/:id/unfollow", async (req, res) => {
  try {
    const { followerId } = req.body;

    // updateOne instead of save()
    await User.updateOne(
      { _id: req.params.id },
      { $pull: { followers: followerId } }
    );

    await User.updateOne(
      { _id: followerId },
      { $pull: { following: req.params.id } }
    );

    res.json({ message: "Unfollowed successfully" });

  } catch (err) {
    console.error("Unfollow error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
