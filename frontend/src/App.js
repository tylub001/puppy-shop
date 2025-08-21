import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import Profile from "./components/Profile";
import Success from "./components/Success";
import Navbar from "./components/Navbar";
import Puppies from "./components/Puppies";
import About from "./components/About";
import Contact from "./components/Contact";
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    window.location.href = "/";
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  return (
    
      <div className="App">
        <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
        <Routes>
          <Route
            path="/"
            element={<LoginForm setIsLoggedIn={setIsLoggedIn} />}
          />
          <Route
            path="/register"
            element={<RegisterForm setIsLoggedIn={setIsLoggedIn} />}
          />
          <Route path="/profile" element={<Profile />} />
          <Route path="/success" element={<Success />} />
          <Route path="/puppies" element={<Puppies />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>

  );
}

export default App;
