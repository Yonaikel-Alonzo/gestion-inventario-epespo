import React, { useState, useRef } from "react";
import "../styles/AgregarProducto.css";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import {
  FaBoxOpen, FaLaptop, FaUsers, FaCouch, FaTools,
  FaEdit, FaTrash, FaTag, FaAlignLeft, FaRulerCombined,
  FaPalette, FaMicrochip, FaIndustry, FaBolt, FaQrcode, FaDownload
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { QRCodeCanvas } from "qrcode.react";


const AgregarProducto = () => {
  const [categoria, setCategoria] = useState("");
  const [producto, setProducto] = useState({});
  const [productos, setProductos] = useState([]);
  const [mostrarModalProducto, setMostrarModalProducto] = useState(false);
  const [mostrarModalTabla, setMostrarModalTabla] = useState(false);
  const [mostrarQRModal, setMostrarQRModal] = useState(false);
  const [productoQR, setProductoQR] = useState(null);
  const qrRef = useRef();

  const [tablaDatos, setTablaDatos] = useState([]);
  const [categoriaTabla, setCategoriaTabla] = useState("");
  const [editarCodigo, setEditarCodigo] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const productosPorPagina = 5;

  const prefijos = {
    "Equipo de Computo": "EC",
    "Equipo de Oficina": "EO",
    "Muebles y Enseres": "ME",
    "Instalaciones, Maquinarias y Herramientas": "IM",
  };

  const columnasPorCategoria = {
    "Equipo de Computo": ["codigo", "nombre", "descripcion", "marca", "modelo", "procesador"],
    "Equipo de Oficina": ["codigo", "nombre", "descripcion", "tipo"],
    "Muebles y Enseres": ["codigo", "nombre", "descripcion", "dimensiones", "color"],
    "Instalaciones, Maquinarias y Herramientas": ["codigo", "nombre", "descripcion", "tipoMaquina", "potencia"],
  };

  const handleCategoria = (e) => {
    setCategoria(e.target.value);
    setProducto({});
    setEditarCodigo(null);
  };

  const handleChange = (e) =>
    setProducto({ ...producto, [e.target.name]: e.target.value });

  const generarCodigo = (cat) =>
    `${prefijos[cat]}-${String(
      productos.filter((p) => p.categoria === cat).length + 1
    ).padStart(3, "0")}`;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editarCodigo) {
      setProductos(
        productos.map((p) =>
          p.codigo === editarCodigo
            ? { ...producto, categoria, codigo: editarCodigo }
            : p
        )
      );
      toast.success("Producto editado con éxito");
    } else {
      const nuevoProducto = {
        ...producto,
        categoria,
        codigo: generarCodigo(categoria),
      };
      setProductos([...productos, nuevoProducto]);
      toast.success("Producto agregado con éxito");
    }
    setProducto({});
    setCategoria("");
    setMostrarModalProducto(false);
    setEditarCodigo(null);
  };

  const eliminarProducto = (codigo) => {
    if (window.confirm("¿Desea eliminar este producto?")) {
      setProductos(productos.filter((p) => p.codigo !== codigo));
      toast.info("Producto eliminado");
      setMostrarModalTabla(false);
    }
  };

  const abrirModalTabla = (cat) => {
    setCategoriaTabla(cat);
    setTablaDatos(productos.filter((p) => p.categoria === cat));
    setPaginaActual(1);
    setMostrarModalTabla(true);
  };

  const editarProducto = (item) => {
    setProducto(item);
    setCategoria(item.categoria);
    setEditarCodigo(item.codigo);
    setMostrarModalProducto(true);
    setMostrarModalTabla(false);
  };

  const mostrarQR = (producto) => {
    setProductoQR(producto);
    setMostrarQRModal(true);
  };

  const descargarQR = () => {
    const canvas = qrRef.current.querySelector("canvas");
    const enlace = document.createElement("a");
    enlace.href = canvas.toDataURL("image/png");
    enlace.download = `${productoQR.codigo}_QR.png`;
    enlace.click();
  };

  const camposCategoria = {
    "Equipo de Computo": [
      { label: "Marca", name: "marca", icon: <FaIndustry />, placeholder: "Ingrese la marca", required: true },
      { label: "Modelo", name: "modelo", icon: <FaBoxOpen />, placeholder: "Ingrese el modelo", required: true },
      { label: "Procesador", name: "procesador", icon: <FaMicrochip />, placeholder: "Ingrese el procesador", required: true },
    ],
    "Equipo de Oficina": [{ label: "Tipo", name: "tipo", placeholder: "Ingrese el tipo", required: true }],
    "Muebles y Enseres": [
      { label: "Dimensiones", name: "dimensiones", icon: <FaRulerCombined />, placeholder: "Ingrese las dimensiones" },
      { label: "Color", name: "color", icon: <FaPalette />, placeholder: "Ingrese el color" },
    ],
    "Instalaciones, Maquinarias y Herramientas": [
      { label: "Tipo de Máquina", name: "tipoMaquina", icon: <FaTools />, placeholder: "Ingrese el tipo de máquina" },
      { label: "Potencia", name: "potencia", icon: <FaBolt />, placeholder: "Ejemplo: 110v, 220v" },
    ],
  };

  const renderCamposCategoria = () =>
    camposCategoria[categoria]?.map((campo, i) => (
      <div className="form-group" key={i}>
        <label>{campo.label}</label>
        <div className="input-icon">
          {campo.icon && <span className="icon-input">{campo.icon}</span>}
          <input
            type="text"
            name={campo.name}
            value={producto[campo.name] || ""}
            onChange={handleChange}
            placeholder={campo.placeholder}
            required={campo.required || false}
          />
        </div>
      </div>
    ));

  // Filtrado y paginación
  const productosFiltrados = tablaDatos.filter(
    (p) =>
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.codigo.toLowerCase().includes(busqueda.toLowerCase())
  );
  const indiceUltimo = paginaActual * productosPorPagina;
  const indicePrimero = indiceUltimo - productosPorPagina;
  const productosPagina = productosFiltrados.slice(
    indicePrimero,
    indiceUltimo
  );
  const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="content">
          <div className="cards-grid">
            <div
              className="card clickable"
              onClick={() => setMostrarModalProducto(true)}
            >
              <FaBoxOpen className="card-icon" />
              <h2 className="card-title">Agregar Producto</h2>
              <p className="card-subtitle">Registrar un nuevo producto</p>
            </div>
            {Object.entries({
              "Equipo de Computo": FaLaptop,
              "Equipo de Oficina": FaUsers,
              "Muebles y Enseres": FaCouch,
              "Instalaciones, Maquinarias y Herramientas": FaTools,
            }).map(([cat, Icon], i) => (
              <div
                key={i}
                className="card clickable"
                onClick={() => abrirModalTabla(cat)}
              >
                <Icon className="card-icon" />
                <h2 className="card-title">{cat}</h2>
                <p className="card-subtitle">Ver productos</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal Formulario */}
      {mostrarModalProducto && (
        <div className="modal-overlay" onClick={() => setMostrarModalProducto(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">
              {editarCodigo ? "Editar Producto" : "Formulario de Producto"}
            </h2>
            <form className="form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Categoría</label>
                <select value={categoria} onChange={handleCategoria} required>
                  <option value="">Seleccione una categoría</option>
                  {Object.keys(prefijos).map((cat, i) => (
                    <option key={i} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              {categoria && (
                <>
                  <div className="form-group">
                    <label>Nombre del Producto</label>
                    <div className="input-icon">
                      <FaTag className="icon-input" />
                      <input
                        type="text"
                        name="nombre"
                        value={producto.nombre || ""}
                        onChange={handleChange}
                        placeholder="Ingrese el nombre del producto"
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Descripción</label>
                    <div className="input-icon">
                      <FaAlignLeft className="icon-input" />
                      <input
                        type="text"
                        name="descripcion"
                        value={producto.descripcion || ""}
                        onChange={handleChange}
                        placeholder="Ingrese una breve descripción"
                        required
                      />
                    </div>
                  </div>
                  {renderCamposCategoria()}
                </>
              )}
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setMostrarModalProducto(false)}>
                  Cancelar
                </button>
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
            <h2 className="modal-title">Inventario - {categoriaTabla}</h2>
            <input
              type="text"
              placeholder="Buscar por nombre o código..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            <div className="tabla-contenedor">
              <table className="tabla-inventario">
                <thead>
                  <tr>
                    {columnasPorCategoria[categoriaTabla].map((col, i) => (
                      <th key={i}>{col.charAt(0).toUpperCase() + col.slice(1)}</th>
                    ))}
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productosPagina.map((item, i) => (
                    <tr key={i}>
                      {columnasPorCategoria[categoriaTabla].map((col, j) => (
                        <td key={j}>{item[col]}</td>
                      ))}
                      <td>
                        <button className="btn-edit" onClick={() => editarProducto(item)}><FaEdit /></button>
                        <button className="btn-delete" onClick={() => eliminarProducto(item.codigo)}><FaTrash /></button>
                        <button className="btn-qr" onClick={() => mostrarQR(item)}><FaQrcode /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="pagination">
              <button disabled={paginaActual === 1} onClick={() => setPaginaActual(paginaActual - 1)}>&laquo;</button>
              <span>{paginaActual} / {totalPaginas}</span>
              <button disabled={paginaActual === totalPaginas} onClick={() => setPaginaActual(paginaActual + 1)}>&raquo;</button>
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setMostrarModalTabla(false)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal QR */}
      {mostrarQRModal && productoQR && (
        <div className="modal-overlay" onClick={() => setMostrarQRModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Código QR del Producto</h2>
            <div ref={qrRef} style={{ textAlign: "center", margin: "20px 0" }}>
<QRCodeCanvas
  value={`Producto: ${productoQR.nombre}
Código: ${productoQR.codigo}
Categoría: ${productoQR.categoria}
Descripción: ${productoQR.descripcion || "Sin descripción"}`}
  size={200}
/>

              <p><strong>{productoQR.codigo}</strong></p>
            </div>
            <div className="modal-actions">
              <button className="btn-submit" onClick={descargarQR}>
                <FaDownload /> Descargar QR
              </button>
              <button className="btn-cancel" onClick={() => setMostrarQRModal(false)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
    </div>
  );
};

export default AgregarProducto;
