import React, { useState } from "react";
import { api } from "../api";

const PostForm = ({ currentUser, onPostCreated }) => {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!content.trim() && !image) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("userId", currentUser._id);
      formData.append("content", content);
      if (image) formData.append("image", image);

      const res = await api.post("/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setContent("");
      setImage(null);
      onPostCreated(res.data);
    } catch (err) {
      console.error("Create post error", err);
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) return null;

  return (
    <form
      onSubmit={handleCreatePost}
      className="bg-[#11141C]/70 p-6 rounded-xl shadow-xl border border-white/5 text-gray-200"
    >
      <h2 className="text-lg font-semibold mb-4 bg-gradient-to-r from-pink-500 to-orange-400 bg-clip-text text-transparent">
        Create Post
      </h2>

      {/* Textarea */}
      <textarea
        className="w-full bg-[#1A1E29] border border-white/10 rounded-lg px-3 py-3 text-sm text-gray-200 focus:outline-none"
        placeholder="What's on your mind?"
        rows="3"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      {/* Image upload */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
        className="text-xs mt-3 text-gray-300"
      />

      {/* Post button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full mt-4 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-orange-400 
                   text-white font-semibold hover:opacity-90 transition"
      >
        {loading ? "Posting..." : "Post"}
      </button>
    </form>
  );
};

export default PostForm;
