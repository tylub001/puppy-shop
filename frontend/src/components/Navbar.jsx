import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar({ handleLogout, isLoggedIn }) {
  return (
    <nav className="puppy-navbar">
      <div className="logo">🐾 PupShop</div>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
          {isLoggedIn && (
          <li><Link to="/profile">MyProfile</Link></li>
        )}
        <li><Link to="/puppies">Puppies</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/contact">Contact</Link></li>
      
      </ul>
      {isLoggedIn && (
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      )}
    </nav>
  );
}

export default Navbar;