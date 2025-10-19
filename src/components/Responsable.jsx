import React, { useState } from "react";
import "../styles/Responsable.css";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { 
  FaUsers, 
  FaBoxOpen, 
  FaEdit, 
  FaTrash, 
  FaUser, 
  FaEnvelope, 
  FaIdCard, 
  FaBriefcase 
} from "react-icons/fa";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Responsable = () => {
  const [responsable, setResponsable] = useState({});
  const [responsables, setResponsables] = useState([]);
  const [mostrarModalFormulario, setMostrarModalFormulario] = useState(false);
  const [mostrarModalTabla, setMostrarModalTabla] = useState(false);
  const [editarIndex, setEditarIndex] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const responsablesPorPagina = 5;

  const handleChange = (e) => {
    setResponsable({
      ...responsable,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editarIndex !== null) {
      const nuevosResponsables = [...responsables];
      nuevosResponsables[editarIndex] = responsable;
      setResponsables(nuevosResponsables);
      toast.success("Responsable editado con éxito");
    } else {
      setResponsables([...responsables, responsable]);
      toast.success("Responsable agregado con éxito");
    }
    setResponsable({});
    setEditarIndex(null);
    setMostrarModalFormulario(false);
  };

 const eliminarResponsable = (index) => {
  if (window.confirm("¿Desea eliminar este responsable?")) {
    setResponsables(responsables.filter((_, i) => i !== index));
    toast.info("Responsable eliminado");
    setMostrarModalTabla(false); 
  }
};

const editarResponsable = (item, index) => {
  setResponsable(item);
  setEditarIndex(index);
  setMostrarModalFormulario(true);
  setMostrarModalTabla(false);
};


  // Filtrado y paginación
  const responsablesFiltrados = responsables.filter(
    (r) =>
      r.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
      r.apellido?.toLowerCase().includes(busqueda.toLowerCase()) ||
      r.cedula?.toLowerCase().includes(busqueda.toLowerCase()) ||
      r.correo?.toLowerCase().includes(busqueda.toLowerCase())
  );

  const indiceUltimo = paginaActual * responsablesPorPagina;
  const indicePrimero = indiceUltimo - responsablesPorPagina;
  const responsablesPagina = responsablesFiltrados.slice(indicePrimero, indiceUltimo);
  const totalPaginas = Math.ceil(responsablesFiltrados.length / responsablesPorPagina);

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="content">
          <div className="cards-grid">
            <div className="card clickable" onClick={() => setMostrarModalFormulario(true)}>
              <FaUsers className="card-icon" />
              <h2 className="card-title">Agregar Responsable</h2>
              <p className="card-subtitle">Registrar un nuevo Responsable</p>
            </div>

            <div className="card clickable" onClick={() => setMostrarModalTabla(true)}>
              <FaBoxOpen className="card-icon" />
              <h2 className="card-title">Responsables</h2>
              <p className="card-subtitle">Listado de responsables registrados</p>
            </div>
          </div>
        </div>
      </div>



{/* Modal Formulario */}
{mostrarModalFormulario && (
  <div className="modal-overlay" onClick={() => setMostrarModalFormulario(false)}>
    <div className="modal" onClick={(e) => e.stopPropagation()}>
      <h2 className="modal-title">{editarIndex !== null ? "Editar Responsable" : "Agregar Responsable"}</h2>
      <form onSubmit={handleSubmit}>

        {/* Nombre */}
        <div className="form-group">
          <label>Nombre</label>
          <div className="input-icon">
            <FaUser className="icon-input" />
            <input 
 type="text"
              name="nombre" 
              value={responsable.nombre || ""} 
              onChange={handleChange}  
              placeholder="Ingrese el nombre" 
              required 
            />
          </div>
        </div>

        {/* Apellido */}
        <div className="form-group">
          <label>Apellido</label>
          <div className="input-icon">
            <FaUser className="icon-input" />
            <input 
        type="text"
              name="apellido" 
              value={responsable.apellido || ""} 
              onChange={handleChange}  
              placeholder="Ingrese el apellido" 
              required 
            />
          </div>
        </div>

        {/* Correo */}
        <div className="form-group">
          <label>Correo</label>
          <div className="input-icon">
            <FaEnvelope className="icon-input" />
            <input 
    type="email"
              name="correo" 
              value={responsable.correo || ""} 
              onChange={handleChange}  
              placeholder="Ingrese el correo" 
              required 
            />
          </div>
        </div>

        {/* Cédula */}
        <div className="form-group">
          <label>Cédula</label>
          <div className="input-icon">
            <FaIdCard className="icon-input" />
            <input 
     type="number"
              name="cedula" 
              value={responsable.cedula || ""} 
              onChange={handleChange}  
              placeholder="Ingrese la cédula" 
              required 
            />
          </div>
        </div>

        {/* Cargo */}
        <div className="form-group">
          <label>Cargo</label>
          <div className="input-icon">
            <FaBriefcase className="icon-input" />
            <input 
             type="text"
              name="cargo" 
              value={responsable.cargo || ""} 
              onChange={handleChange}  
              placeholder="Ingrese el cargo" 
              required 
            />
          </div>
        </div>

        <div className="modal-actions">
          <button type="button" className="btn-cancel" onClick={() => setMostrarModalFormulario(false)}>Cancelar</button>
          <button type="submit" className="btn-submit">Guardar</button>
        </div>
      </form>
    </div>
  </div>
)}

      {/* Modal Tabla */}
      {mostrarModalTabla && (
        <div className="modal-overlay" onClick={() => setMostrarModalTabla(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
       
  <h2 className="modal-title">Listado de Responsables</h2>

  <input
    type="text"
    placeholder="Buscar por nombre, correo o cédula..."
    value={busqueda}
    onChange={(e) => setBusqueda(e.target.value)}
    style={{ marginBottom: "10px", width: "100%", padding: "5px" }}
  />

  <div className="tabla-container">
    <table className="tabla-inventario">
      <thead>
        <tr>
          {["Nombre", "Apellido", "Correo", "Cédula", "Cargo"].map((col, i) => (
            <th key={i}>{col}</th>
          ))}
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {responsablesPagina.map((item, index) => (
          <tr key={index}>
            <td>{item.nombre}</td>
            <td>{item.apellido}</td>
            <td>{item.correo}</td>
            <td>{item.cedula}</td>
            <td>{item.cargo}</td>
            <td>
              <button className="btn-edit" onClick={() => editarResponsable(item)}><FaEdit /></button>
              <button className="btn-delete" onClick={() => eliminarResponsable(item.cedula)}><FaTrash /></button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>


            {/* Paginación */}
            <div className="pagination">
              <button disabled={paginaActual === 1} onClick={() => setPaginaActual(paginaActual - 1)} className="page-btn">&laquo;</button>
              <span className="page-info">{paginaActual} / {totalPaginas}</span>
              <button disabled={paginaActual === totalPaginas} onClick={() => setPaginaActual(paginaActual + 1)} className="page-btn">&raquo;</button>
            </div>

            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setMostrarModalTabla(false)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
    </div>
  );
};

export default Responsable;
