import React, { useEffect, useRef, useState } from "react";
import { api } from "../api";

const Profile = ({ currentUser }) => {
  const [profile, setProfile] = useState(null);
  const [userPosts, setUserPosts] = useState([]);

  const fileInputRef = useRef(null);

  const fetchProfile = async () => {
    try {
      const res = await api.get(`/users/${currentUser._id}`);
      setProfile(res.data);
    } catch (err) {
      console.error("Get profile error", err);
    }
  };

  const fetchUserPosts = async () => {
    try {
      const res = await api.get(`/posts/user/${currentUser._id}`);
      setUserPosts(res.data);
    } catch (err) {
      console.error("Get user posts error", err);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchProfile();
      fetchUserPosts();
    }
  }, [currentUser]);

  // Update avatar
  const updateAvatar = async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    const res = await api.post(
      `/users/${currentUser._id}/avatar`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    setProfile({ ...profile, avatar: res.data.avatar });
  };

  if (!currentUser || !profile) return null;

  return (
    <div className="bg-[#181B25]/80 p-6 rounded-xl shadow-xl border border-white/5 text-gray-200 flex flex-col items-center text-center">

      {/* Title */}
      <h2 className="text-xl font-semibold mb-4 bg-gradient-to-r from-pink-500 to-orange-400 bg-clip-text text-transparent">
        Your Profile
      </h2>

      {/* Avatar */}
      <div
        className="w-32 h-32 rounded-full bg-gradient-to-r from-pink-500 to-orange-400 
        p-[3px] shadow-xl cursor-pointer hover:opacity-90 transition mb-4"
        onClick={() => fileInputRef.current.click()}
      >
        <div className="w-full h-full rounded-full bg-[#0B0E15] overflow-hidden flex items-center justify-center">
          {profile.avatar ? (
            <img
              src={`http://localhost:5000${profile.avatar}`}
              className="w-full h-full object-cover"
              alt="avatar"
            />
          ) : (
            <span className="text-gray-400 text-5xl">{profile.name[0]}</span>
          )}
        </div>
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className="hidden"
        onChange={(e) => updateAvatar(e.target.files[0])}
      />

      {/* Name */}
      <h3 className="text-2xl font-bold text-white tracking-wide">
        {profile.name}
      </h3>

      {/* Username */}
      <p className="text-sm text-gray-400 mt-1 mb-3">
        @{profile.username}
      </p>

      {/* Bio */}
      <p className="text-gray-300 text-sm leading-relaxed max-w-xs">
        {profile.bio || "No bio added yet."}
      </p>

      {/* Stats */}
      <div className="flex justify-between items-center gap-10 mt-6 text-sm">
        <div className="flex flex-col items-center">
          <span className="text-lg font-bold text-white">{profile.followers.length}</span>
          <span className="text-gray-400">Followers</span>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-lg font-bold text-white">{profile.following.length}</span>
          <span className="text-gray-400">Following</span>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-lg font-bold text-white">{userPosts.length}</span>
          <span className="text-gray-400">Posts</span>
        </div>
      </div>

    </div>
  );
};

export default Profile;
