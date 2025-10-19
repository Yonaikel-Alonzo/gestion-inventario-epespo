import React from "react";
import { FaUserCircle } from "react-icons/fa";
import "../styles/Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <h1>ESCUELA DE PESCA DEL PACIFICO ORIENTAL</h1>
      <div className="user-info">
        <FaUserCircle size={30} />
        <span>Admin</span>
      </div>
    </nav>
  );
};

export default Navbar;