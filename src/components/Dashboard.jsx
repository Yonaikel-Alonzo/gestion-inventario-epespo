import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import "../styles/Dashboard.css";
import logoEPESPO from "../assets/logo-epespo_2.png"; // Asegúrate de poner tu imagen en src/assets/

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Navbar />

        <div className="content">
            <div className="image-container">
            <img src={logoEPESPO} alt="EPESPO Logo" className="dashboard-logo" />
          </div>
          <h2>Formando</h2>
          <p>gente de pesca para el mundo</p>
        
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
