import React, { useEffect, useState } from "react";
import { api } from "../api";

const CommentList = ({ postId, currentUser }) => {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");

  const fetchComments = async () => {
    try {
      const res = await api.get(`/comments/post/${postId}`);
      setComments(res.data);
    } catch (err) {
      console.error("Get comments error", err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      const res = await api.post("/comments", {
        postId,
        userId: currentUser._id,
        text
      });

      setComments((prev) => [...prev, res.data]);
      setText("");
    } catch (err) {
      console.error("Create comment error", err);
    }
  };

  return (
    <div className="mt-4">

      {/* Comments List */}
      <div className="space-y-3">
        {comments.map((c) => (
          <div
            key={c._id}
            className="bg-[#1A1E29]/60 p-3 rounded-lg border border-white/10"
          >
            <p className="text-pink-400 font-semibold text-sm">
              @{c.user?.username}
            </p>
            <p className="text-gray-300 text-sm mt-1">{c.text}</p>
          </div>
        ))}
      </div>

      {/* Add New Comment */}
      {currentUser && (
        <form onSubmit={handleAddComment} className="flex mt-4 gap-2">

          <input
            className="flex-1 bg-[#1A1E29] border border-white/10 text-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
            placeholder="Write a comment..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <button
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-orange-400 text-white text-sm font-semibold hover:opacity-90 transition"
          >
            Send
          </button>

        </form>
      )}
    </div>
  );
};

export default CommentList;
