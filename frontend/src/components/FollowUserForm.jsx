import React, { useState } from "react";
import { api } from "../api";

const FollowUserForm = ({ currentUser }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [msg, setMsg] = useState("");

  // LIVE SEARCH USERS
  const searchUsers = async (text) => {
    setQuery(text);
    setMsg("");

    if (!text.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await api.get(`/users/search/${text}`);
      setSuggestions(res.data);
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  // SELECT USER
  const selectUser = (user) => {
    setSelectedUser({
      ...user,
      followers: user.followers || []
    });

    setQuery(user.username);
    setSuggestions([]); // hide list
  };

  // FOLLOW
  const handleFollow = async () => {
    try {
      await api.post(`/users/${selectedUser._id}/follow`, {
        followerId: currentUser._id,
      });

      setSelectedUser((prev) => ({
        ...prev,
        followers: [...prev.followers, currentUser._id],
      }));

      setMsg(`You followed @${selectedUser.username}`);
    } catch (err) {
      console.error(err);
      setMsg("Follow error");
    }
  };

  // UNFOLLOW
  const handleUnfollow = async () => {
    try {
      await api.post(`/users/${selectedUser._id}/unfollow`, {
        followerId: currentUser._id,
      });

      setMsg(`You unfollowed @${selectedUser.username}`);

      // REMOVE FOLLOWER FROM LIST
      setSelectedUser((prev) => ({
        ...prev,
        followers: prev.followers.filter((id) => id !== currentUser._id),
      }));

      // Remove card after unfollow
      setTimeout(() => {
        setSelectedUser(null);
        setQuery("");
      }, 600);

    } catch (err) {
      console.error(err);
      setMsg("Unfollow error");
    }
  };

  if (!currentUser) return null;

  const isFollowing =
    selectedUser &&
    selectedUser.followers?.includes(currentUser._id);

  return (
    <div className="bg-[#11141C]/70 p-5 rounded-xl shadow-xl border border-white/5 text-gray-200 mb-4">
      <h2 className="text-sm font-semibold mb-3">Find & Follow Users</h2>

      {/* Search Input */}
      <input
        className="w-full bg-[#1A1E29] border border-white/10 rounded px-3 py-2 text-sm mb-2"
        placeholder="Search username..."
        value={query}
        onChange={(e) => searchUsers(e.target.value)}
      />

      {/* Suggestions Box */}
      {suggestions.length > 0 && (
        <div className="bg-[#1A1E29] border border-white/10 rounded p-2 text-sm max-h-40 overflow-y-auto mb-2">
          {suggestions.map((user) => (
            <div
              key={user._id}
              onClick={() => selectUser(user)}
              className="p-2 cursor-pointer hover:bg-white/10 rounded flex items-center gap-3"
            >
              <img
                src={
                  user.avatar
                    ? `http://localhost:5000${user.avatar}`
                    : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                className="w-8 h-8 rounded-full object-cover"
              />
              <span>@{user.username}</span>
            </div>
          ))}
        </div>
      )}

      {/* Selected User */}
      {selectedUser && (
        <div className="mt-3 p-4 bg-[#1A1E29] rounded-lg border border-white/10">

          <div className="flex items-center gap-4 mb-3">
            <img
              src={
                selectedUser.avatar
                  ? `http://localhost:5000${selectedUser.avatar}`
                  : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold">@{selectedUser.username}</p>
              <p className="text-xs text-gray-400">{selectedUser.name}</p>
            </div>
          </div>

          {!isFollowing ? (
            <button
              onClick={handleFollow}
              className="w-full py-2 rounded bg-blue-600 text-white font-semibold hover:opacity-90"
            >
              Follow
            </button>
          ) : (
            <button
              onClick={handleUnfollow}
              className="w-full py-2 rounded bg-red-600 text-white font-semibold hover:opacity-90"
            >
              Unfollow
            </button>
          )}
        </div>
      )}

      {msg && <p className="text-xs mt-3 text-pink-400">{msg}</p>}
    </div>
  );
};

export default FollowUserForm;
