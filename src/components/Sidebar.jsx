import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaHome, 
  FaPlusCircle, 
  FaUserTie, 
  FaBoxOpen, 
  FaHistory, 
  FaChartBar, 
  FaTools,
  FaSignOutAlt,
  FaBars
} from "react-icons/fa";

import "../styles/Sidebar.css";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
  const toggleSidebar = () => setIsOpen(!isOpen);

  const menuItems = [
    { name: "Inicio", icon: <FaHome />, route: "/dashboard" },
    { name: "Agregar Producto", icon: <FaPlusCircle />, route: "/agregar-producto" },
    { name: "Responsable", icon: <FaUserTie />, route: "/responsable" },
    { name: "Asignacion", icon: <FaBoxOpen />, route: "/asignacion" },
    { name: "Historial", icon: <FaHistory />, route: "/responsable" },
    { name: "Reportes", icon: <FaChartBar />, route: "/responsable" },
    { name: "Ajuste", icon: <FaTools />, route: "/responsable" },
  ];

  const logoutItem = { name: "Cerrar Sesión", icon: <FaSignOutAlt /> };

  const handleLogout = () => {
    // Aquí puedes limpiar tokens o info del usuario si lo necesitas
    navigate("/"); // Redirige al login
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <div className="top-section">
        <h2 className="logo">{isOpen ? "EPESPO" : "E"}</h2>
        <button className="toggle-btn" onClick={toggleSidebar}>
          <FaBars />
        </button>
      </div>

      <ul className="menu">
        {menuItems.map((item, index) => (
          <li 
            key={index} 
            className="menu-item"
            onClick={() => navigate(item.route)}
          >
            <span className="icon">{item.icon}</span>
            {isOpen && <span className="text">{item.name}</span>}
          </li>
        ))}
      </ul>

      <hr className="divider" />

      <ul className="menu">
        <li className="menu-item logout" onClick={handleLogout}>
          <span className="icon">{logoutItem.icon}</span>
          {isOpen && <span className="text">{logoutItem.name}</span>}
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
