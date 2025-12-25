import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();


  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/home");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="landing-screen min-h-screen w-full flex flex-col items-center justify-center bg-[#0B0E15] overflow-hidden">
      <h1
        className="text-7xl font-extrabold mb-4 text-center 
        bg-gradient-to-r from-pink-500 to-orange-400 
        bg-clip-text text-transparent animate-fadeIn"
      >
        MiniSocial
      </h1>

      <p className="text-gray-300 text-xl mt-4 text-center opacity-0 animate-fadeInSlow">
        Connect with developers. Share your journey. Build together.
      </p>

      <div className="absolute bottom-10 text-gray-500 text-sm animate-fadeInSlow text-center tracking-wide">
        © 2025 MiniSocial
        <br />
        <span className="text-gray-400">
          Crafted with ❤️ by Ashish Singh Rathore
        </span>
        <br />
        <span className="text-gray-600 text-xs">📞 9931343026</span>
      </div>
    </div>
  );
};

export default Landing;
