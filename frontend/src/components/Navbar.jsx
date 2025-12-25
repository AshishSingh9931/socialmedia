import React from "react";
import { Link } from "react-router-dom";

const Navbar = ({ currentUser, setCurrentUser }) => {

  const handleLogout = () => {
    setCurrentUser(null); 
  };

  return (
    <nav className="bg-[#10121A]/80 backdrop-blur-lg border-b border-white/10 shadow-xl sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">

        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-extrabold bg-gradient-to-r from-pink-500 to-orange-400 
          bg-clip-text text-transparent"
        >
          MiniSocial
        </Link>

        {/* Right Side Options */}
        <div className="flex items-center gap-6 text-gray-300">

          {/* Home Link */}
          <Link to="/home" className="hover:text-white transition">
            Home
          </Link>

          {/* If user is logged in */}
          {currentUser ? (
            <div className="flex items-center gap-4">

              {/* Username */}
              <span className="text-sm text-white font-semibold">
                @{currentUser.username}
              </span>

              {/* Logout button */}
              <button
                onClick={handleLogout}
                className="px-4 py-1 rounded-lg text-sm bg-red-500/80 hover:bg-red-600 
                text-white transition shadow"
              >
                Logout
              </button>

            </div>
          ) : (
            // If no user logged in
            <span className="text-gray-500 text-sm">Not logged in</span>
          )}

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
