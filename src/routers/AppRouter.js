// src/router/AppRouter.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../components/Login";
import Dashboard from "../components/Dashboard";
import AgregarProducto from "../components/AgregarProducto"
import Responsable from "../components/Responsable"
import Asignacion from "../components/Asignacion"  
const AppRouter = () => {
  return (
    <Router>
 <Routes>
  <Route path="/" element={<Login />} />
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/agregar-producto" element={<AgregarProducto />} />
   <Route path="/responsable" element={<Responsable />} />
   <Route path="/asignacion" element={<Asignacion />} />
</Routes>
    </Router>
  );
};

export default AppRouter;
