import React, { useState } from "react";
import AuthForm from "../components/AuthForm.jsx";
import Profile from "../components/Profile.jsx";
import FollowUserForm from "../components/FollowUserForm.jsx";
import PostForm from "../components/PostForm.jsx";
import PostList from "../components/PostList.jsx";
import { api } from "../api";

const Home = ({ currentUser, setCurrentUser }) => {
  const [newPost, setNewPost] = useState(null);

  const refreshUserProfile = async () => {
    if (!currentUser) return;

    try {
      const res = await api.get(`/users/${currentUser._id}`);
      setCurrentUser(res.data);
    } catch (err) {
      console.error("Profile refresh error:", err);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

      {/* Left Column */}
      <div className="md:col-span-1">
        {!currentUser && <AuthForm setCurrentUser={setCurrentUser} />}

        {currentUser && (
          <>
            <Profile currentUser={currentUser} />
            <FollowUserForm
              currentUser={currentUser}
              refreshUserProfile={refreshUserProfile} // ⭐ IMPORTANT
            />
          </>
        )}
      </div>

      {/* Posts Section */}
      <div className="md:col-span-2">
        <PostForm
          currentUser={currentUser}
          onPostCreated={(post) => setNewPost(post)}
        />
        <PostList currentUser={currentUser} newPost={newPost} />
      </div>

    </div>
  );
};

export default Home;
