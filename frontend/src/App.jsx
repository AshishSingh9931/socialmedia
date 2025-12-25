import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Landing from "./pages/Landing.jsx";

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  return (
    <Router>
      <div className="min-h-screen flex flex-col">

        <Navbar currentUser={currentUser} setCurrentUser={setCurrentUser} />

        <main className="flex-1 container mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<Landing />} />

            <Route
              path="/home"
              element={
                <Home
                  currentUser={currentUser}
                  setCurrentUser={setCurrentUser}
                />
              }
            />
          </Routes>
        </main>

      </div>
    </Router>
  );
}

export default App;
