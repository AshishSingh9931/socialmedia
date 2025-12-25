import React, { useState } from "react";
import { api } from "../api";

const AuthForm = ({ setCurrentUser }) => {
  const [tab, setTab] = useState("register");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await api.post("/users/register", {
        username,
        name,
        bio,
        password,
      });

      setCurrentUser(res.data);
      setMessage("Registered & logged in!");
    } catch (err) {
      setMessage(err.response?.data?.message || "Register error");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await api.post("/users/login", {
        username,
        password,
      });

      setCurrentUser(res.data);
      setMessage("Logged in!");
    } catch (err) {
      setMessage(err.response?.data?.message || "Login error");
    }
  };

  return (
    <div className="bg-[#11141C]/70 p-6 rounded-xl shadow-xl border border-white/5 text-gray-200">

      {/* Tabs */}
      <div className="flex mb-6 border-b border-white/10">
        <button
          className={`flex-1 py-2 text-sm ${
            tab === "register"
              ? "font-bold text-white border-b-2 border-pink-500"
              : "text-gray-400"
          }`}
          onClick={() => setTab("register")}
        >
          Register
        </button>

        <button
          className={`flex-1 py-2 text-sm ${
            tab === "login"
              ? "font-bold text-white border-b-2 border-orange-400"
              : "text-gray-400"
          }`}
          onClick={() => setTab("login")}
        >
          Login
        </button>
      </div>

      {/* REGISTER */}
      {tab === "register" ? (
        <form onSubmit={handleRegister} className="space-y-3">

          <input
            className="w-full bg-[#1A1E29] border border-white/10 rounded px-3 py-2 text-sm"
            placeholder="Username (unique)"
            value={username}
            autoComplete="off"
            autoCorrect="off"
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            className="w-full bg-[#1A1E29] border border-white/10 rounded px-3 py-2 text-sm"
            placeholder="Full Name"
            value={name}
            autoComplete="off"
            autoCorrect="off"
            onChange={(e) => setName(e.target.value)}
          />

          <textarea
            className="w-full bg-[#1A1E29] border border-white/10 rounded px-3 py-2 text-sm"
            placeholder="Bio"
            value={bio}
            autoComplete="off"
            autoCorrect="off"
            onChange={(e) => setBio(e.target.value)}
          />

          {/* Password */}
          <input
            type="password"
            className="w-full bg-[#1A1E29] border border-white/10 rounded px-3 py-2 text-sm"
            placeholder="Password"
            value={password}
            autoComplete="new-password"
            autoCorrect="off"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="w-full py-2 rounded bg-gradient-to-r from-pink-500 to-orange-400 text-white font-semibold hover:opacity-90 transition">
            Register
          </button>
        </form>
      ) : (

        /* LOGIN */
        <form onSubmit={handleLogin} className="space-y-3">

          <input
            className="w-full bg-[#1A1E29] border border-white/10 rounded px-3 py-2 text-sm"
            placeholder="Username"
            value={username}
            autoComplete="off"
            autoCorrect="off"
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            className="w-full bg-[#1A1E29] border border-white/10 rounded px-3 py-2 text-sm"
            placeholder="Password"
            value={password}
            autoComplete="new-password"
            autoCorrect="off"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="w-full py-2 rounded bg-gradient-to-r from-orange-400 to-pink-500 text-white font-semibold hover:opacity-90 transition">
            Login
          </button>
        </form>
      )}

      {message && <p className="mt-3 text-xs text-pink-400">{message}</p>}
    </div>
  );
};

export default AuthForm;
