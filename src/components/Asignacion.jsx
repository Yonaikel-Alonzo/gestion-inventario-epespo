import React, { useState } from "react";
import "../styles/Asignacion.css";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import {
  FaUsers,
  FaBoxOpen,
  FaUser,
  FaBriefcase,
  FaInfoCircle,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const fechaHoy = () => {
  const hoy = new Date();
  const yyyy = hoy.getFullYear();
  const mm = String(hoy.getMonth() + 1).padStart(2, "0");
  const dd = String(hoy.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const Asignacion = () => {
  const [responsable, setResponsable] = useState({});
  const [responsables, setResponsables] = useState([]);
  const [mostrarModalFormulario, setMostrarModalFormulario] = useState(false);
  const [mostrarModalTabla, setMostrarModalTabla] = useState(false);
  const [mostrarSubModal, setMostrarSubModal] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [editarIndex, setEditarIndex] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [mostrarDetalles, setMostrarDetalles] = useState(false);
  const [productoDetalle, setProductoDetalle] = useState(null);
  const [bienesSeleccionadosCategoria, setBienesSeleccionadosCategoria] = useState({});

  const responsablesPorPagina = 5;

  const bienesPorCategoria = {
    "Equipo de Cómputo": [
      { nombre: "Laptop Dell", codigo: "EC001", marca: "Dell", modelo: "Inspiron 15", descripcion: "Laptop con procesador Intel i7 y 16GB RAM" },
      { nombre: "PC HP", codigo: "EC002", marca: "HP", modelo: "ProDesk 600", descripcion: "Computadora de escritorio de alto rendimiento" },
      { nombre: "Servidor Lenovo", codigo: "EC003", marca: "Lenovo", modelo: "ThinkServer T140", descripcion: "Servidor de red para infraestructura interna" },
    ],
    "Equipo de Oficina": [
      { nombre: "Impresora Canon", codigo: "EO001", marca: "Canon", modelo: "PIXMA G3110", descripcion: "Impresora multifuncional con sistema de tinta continua" },
      { nombre: "Teléfono IP", codigo: "EO002", marca: "Cisco", modelo: "SPA504G", descripcion: "Teléfono IP empresarial con 4 líneas" },
      { nombre: "Proyector Epson", codigo: "EO003", marca: "Epson", modelo: "X41+", descripcion: "Proyector con 3600 lúmenes y resolución XGA" },
    ],
    "Muebles y Enseres": [
      { nombre: "Silla ejecutiva", codigo: "ME001", marca: "IKEA", modelo: "Executive X1", descripcion: "Silla ergonómica para oficina" },
      { nombre: "Escritorio de madera", codigo: "ME002", marca: "IKEA", modelo: "Desk Pro", descripcion: "Escritorio amplio de madera maciza" },
      { nombre: "Archivador metálico", codigo: "ME003", marca: "MetalCorp", modelo: "FileMax", descripcion: "Archivador metálico de 4 niveles" },
    ],
    "Instalaciones, Maquinarias y Herramientas": [
      { nombre: "Taladro industrial", codigo: "IMH001", marca: "Bosch", modelo: "T-500", descripcion: "Taladro potente para uso industrial" },
      { nombre: "Aire acondicionado", codigo: "IMH002", marca: "LG", modelo: "AC-9000", descripcion: "Sistema de aire acondicionado split" },
      { nombre: "Compresor de aire", codigo: "IMH003", marca: "DeWalt", modelo: "Compressor X2", descripcion: "Compresor de aire portátil" },
    ],
  };

  const handleChange = (e) => {
    setResponsable({
      ...responsable,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!categoriaSeleccionada) {
      toast.error("Debe seleccionar una categoría");
      return;
    }

    const seleccionados = bienesSeleccionadosCategoria[categoriaSeleccionada] || [];
    if (seleccionados.length === 0) {
      toast.error("Debe seleccionar al menos un producto");
      return;
    }

    const fechaAsignacion = responsable.fechaAsignacion || fechaHoy();

    const indexExistente = responsables.findIndex(
      (r) =>
        r.responsable === responsable.responsable &&
        r.categoria === categoriaSeleccionada &&
        r.fechaAsignacion === fechaAsignacion
    );

    if (indexExistente !== -1) {
      const nuevosResponsables = [...responsables];
      const actualesBienes = nuevosResponsables[indexExistente].bienes || [];
      nuevosResponsables[indexExistente].bienes = [
        ...actualesBienes,
        ...seleccionados.filter((b) => !actualesBienes.includes(b)),
      ];
      setResponsables(nuevosResponsables);
      toast.success("Productos agregados al registro existente");
    } else {
      const nuevoRegistro = {
        ...responsable,
        categoria: categoriaSeleccionada,
        fechaAsignacion,
        bienes: seleccionados,
      };
      setResponsables([...responsables, nuevoRegistro]);
      toast.success("Asignación registrada con éxito");
    }

    setResponsable({});
    setEditarIndex(null);
    setMostrarModalFormulario(false);
    setCategoriaSeleccionada(null);
    setBienesSeleccionadosCategoria({});
  };

  const eliminarResponsable = (index) => {
    if (window.confirm("¿Desea eliminar esta asignación?")) {
      setResponsables(responsables.filter((_, i) => i !== index));
      toast.info("Asignación eliminada");
    }
  };

  const editarResponsable = (item, index) => {
    setResponsable(item);
    setEditarIndex(index);
    setCategoriaSeleccionada(item.categoria);
    setBienesSeleccionadosCategoria({ [item.categoria]: item.bienes || [] });
    setMostrarModalFormulario(true);
  };

  const responsablesFiltrados = responsables.filter(
    (r) =>
      r.responsable?.toLowerCase().includes(busqueda.toLowerCase()) ||
      r.categoria?.toLowerCase().includes(busqueda.toLowerCase()) ||
      (r.bienes || []).join(", ").toLowerCase().includes(busqueda.toLowerCase())
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
              <h2 className="card-title">Asignación de Responsable</h2>
              <p className="card-subtitle">Asignación de un producto a un responsable</p>
            </div>

            <div className="card clickable" onClick={() => setMostrarModalTabla(true)}>
              <FaBoxOpen className="card-icon" />
              <h2 className="card-title">Responsables</h2>
              <p className="card-subtitle">Listado de responsables asignados</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Formulario */}
      {mostrarModalFormulario && (
        <div className="modal-overlay" onClick={() => setMostrarModalFormulario(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">{editarIndex !== null ? "Editar Asignación" : "Nueva Asignación"}</h2>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Seleccionar Responsable</label>
                <div className="input-icon">
                  <FaUser className="icon-input" />
                  <select name="responsable" value={responsable.responsable || ""} onChange={handleChange} required>
                    <option value="">-- Seleccione un responsable --</option>
                    <option value="Juan Pérez">Juan Pérez</option>
                    <option value="María López">María López</option>
                    <option value="Carlos Díaz">Carlos Díaz</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Fecha de Asignación</label>
                <div className="input-icon">
                  <input type="date" name="fechaAsignacion" value={responsable.fechaAsignacion || fechaHoy()} onChange={handleChange} required />
                </div>
              </div>

              <div className="form-group">
                <label>Escoger una Categoría</label>
                {Object.keys(bienesPorCategoria).map((categoria, index) => (
                  <div key={index} className="categoria-item">
                    <label>{categoria}</label>
                    <div className="input-icon">
                      <FaBriefcase className="icon-input" />
                      <input
                        readOnly
                        placeholder="-- Seleccione productos --"
                        value={bienesSeleccionadosCategoria[categoria]?.join(", ") || ""}
                        onClick={() => {
                          setCategoriaSeleccionada(categoria);
                          setMostrarSubModal(true);
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setMostrarModalFormulario(false)}>Cancelar</button>
                <button type="submit" className="btn-submit">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
{/* Modal Tabla de Responsables */}
{mostrarModalTabla && (
  <div className="modal-overlay" onClick={() => setMostrarModalTabla(false)}>
    <div className="modal large" onClick={(e) => e.stopPropagation()}>
      <h2 className="modal-title">Responsables Asignados</h2>
      <input
        type="text"
        placeholder="Buscar..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="input-busqueda"
      />
      <table className="tabla-inventario">
        <thead>
          <tr>
            <th>Responsable</th>
            <th>Fecha de Asignación</th>
            <th>Categoría</th>
            <th>Productos Asignados</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {responsablesPagina.map((r, i) => (
            <tr key={i}>
              <td>{r.responsable}</td>
              <td>{r.fechaAsignacion}</td>
              <td>{r.categoria}</td>
              <td>
                {r.bienes?.map((b, j) => (
                  <div key={j}>{b.codigo} - {b.nombre}</div>
                ))}
              </td>
              <td>
                <button className="btn-editar" onClick={() => editarResponsable(r, indicePrimero + i)}>Editar</button>
                <button className="btn-eliminar" onClick={() => eliminarResponsable(indicePrimero + i)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paginación */}
      <div className="paginacion">
        {Array.from({ length: totalPaginas }, (_, i) => (
          <button
            key={i}
            className={paginaActual === i + 1 ? "activo" : ""}
            onClick={() => setPaginaActual(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <div className="modal-actions">
        <button className="btn-cancel" onClick={() => setMostrarModalTabla(false)}>Cerrar</button>
      </div>
    </div>
  </div>
)}

      {/* Submodal de productos */}
      {mostrarSubModal && (
        <div className="modal-overlay" onClick={() => setMostrarSubModal(false)}>
          <div className="modal small" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">{categoriaSeleccionada}</h3>
            <table className="tabla-inventario">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Producto</th>
                  <th>Detalles</th>
                  <th>Seleccionar</th>
                </tr>
              </thead>
              <tbody>
                {bienesPorCategoria[categoriaSeleccionada].map((b, i) => {
                  const seleccionados = bienesSeleccionadosCategoria[categoriaSeleccionada] || [];
                  const estaSeleccionado = seleccionados.some((item) => item.nombre === b.nombre);

                  return (
                    <tr key={i}>
                       <td>{b.codigo}</td>
                      <td>{b.nombre}</td>
                      <td style={{ textAlign: "center" }}>
                        <FaInfoCircle className="info-icon" onClick={() => { setProductoDetalle(b); setMostrarDetalles(true); }} />
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <input
                          type="checkbox"
                          checked={estaSeleccionado}
                          onChange={() => {
                            let nuevos = [...seleccionados];
                            if (estaSeleccionado) {
                              nuevos = nuevos.filter((p) => p.nombre !== b.nombre);
                            } else {
                              nuevos.push(b);
                            }
                            setBienesSeleccionadosCategoria({ ...bienesSeleccionadosCategoria, [categoriaSeleccionada]: nuevos });
                          }}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setMostrarSubModal(false)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Detalle de producto */}
      {mostrarDetalles && productoDetalle && (
        <div className="modal-overlay" onClick={() => setMostrarDetalles(false)}>
          <div className="modal small" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Detalle del Producto</h2>
            <p><strong>Nombre:</strong> {productoDetalle.nombre}</p>
            <p><strong>Código:</strong> {productoDetalle.codigo}</p>
            <p><strong>Marca:</strong> {productoDetalle.marca}</p>
            <p><strong>Modelo:</strong> {productoDetalle.modelo}</p>
            <p><strong>Descripción:</strong> {productoDetalle.descripcion}</p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setMostrarDetalles(false)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
    </div>
  );
};

export default Asignacion;
