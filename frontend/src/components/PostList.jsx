import React, { useEffect, useState } from "react";
import { api } from "../api";
import CommentList from "./CommentList.jsx";

const PostList = ({ currentUser, newPost }) => {
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    try {
      const res = await api.get("/posts");
      setPosts(res.data);
    } catch (err) {
      console.error("Get posts error", err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    if (newPost) {
      setPosts((prev) => [newPost, ...prev]);
    }
  }, [newPost]);

  const toggleLike = async (post) => {
    if (!currentUser) return;

    const liked = post.likes.some((u) => u._id === currentUser._id);

    try {
      if (liked) {
        await api.post(`/posts/${post._id}/unlike`, {
          userId: currentUser._id
        });

        setPosts((prev) =>
          prev.map((p) =>
            p._id === post._id
              ? { ...p, likes: p.likes.filter((u) => u._id !== currentUser._id) }
              : p
          )
        );
      } else {
        await api.post(`/posts/${post._id}/like`, {
          userId: currentUser._id
        });

        setPosts((prev) =>
          prev.map((p) =>
            p._id === post._id
              ? { ...p, likes: [...p.likes, currentUser] }
              : p
          )
        );
      }
    } catch (err) {
      console.error("Like/unlike error", err);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!currentUser) return;

    try {
      await api.delete(`/posts/${postId}`, {
        data: { userId: currentUser._id }
      });

      setPosts((prev) => prev.filter((p) => p._id !== postId));
    } catch (err) {
      console.error("Delete post error", err);
    }
  };

  return (
    <div className="space-y-6">
      {posts.map((post) => {
        const liked =
          currentUser &&
          post.likes.some((u) => u._id === currentUser._id);

        const isOwner = currentUser && post.user && post.user._id === currentUser._id;

        return (
          <div
            key={post._id}
            className="bg-[#11141C]/70 p-6 rounded-xl shadow-xl border border-white/5 text-gray-200"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-semibold bg-gradient-to-r from-pink-500 to-orange-400 bg-clip-text text-transparent">
                  {post.user?.name || post.user?.username}
                </h3>
                <p className="text-xs text-gray-400">@{post.user?.username}</p>
              </div>

              <div className="flex items-center gap-3">
                <p className="text-xs text-gray-500">
                  {new Date(post.createdAt).toLocaleString()}
                </p>

                {isOwner && (
                  <button
                    onClick={() => handleDeletePost(post._id)}
                    className="text-xs text-red-400 hover:text-red-300"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>

            {/* Post Image */}
            {post.image && (
              <img
                src={`http://localhost:5000${post.image}`}
                className="w-full max-h-96 object-cover rounded-lg mb-4 border border-white/10"
                alt="post"
              />
            )}

            {/* Text */}
            <p className="text-gray-300 mb-4">{post.content}</p>

            {/* Like Button */}
            <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
              <button
                onClick={() => toggleLike(post)}
                className="flex items-center gap-2 hover:text-white transition"
              >
                <span className="text-xl">
                  {liked ? "💖" : "🤍"}
                </span>
                <span>{post.likes.length} Likes</span>
              </button>
            </div>

            {/* Comments */}
            <CommentList postId={post._id} currentUser={currentUser} />
          </div>
        );
      })}
    </div>
  );
};

export default PostList;
