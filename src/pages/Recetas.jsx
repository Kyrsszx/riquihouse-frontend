import { useEffect, useState } from "react";
import { obtenerRecetas, crearReceta, eliminarReceta, actualizarReceta } from "../services/recetaService";
import { obtenerProductos } from "../services/productoService";
import { obtenerInsumos } from "../services/insumoService";

function Recetas() {
  const [recetas, setRecetas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [insumos, setInsumos] = useState([]);

  // Formulario superior (Agregar nuevo ingrediente extra)
  const [idProducto, setIdProducto] = useState("");
  const [idInsumo, setIdInsumo] = useState("");
  const [cantidad, setCantidad] = useState("");

  // ESTADOS PARA EL MODAL DE EDICIÓN
  const [modoFormulario, setModoFormulario] = useState("cerrado");
  const [recetaEditando, setRecetaEditando] = useState(null);
  const [idInsumoEdit, setIdInsumoEdit] = useState("");
  const [cantidadEdit, setCantidadEdit] = useState("");

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    const dataRecetas = await obtenerRecetas();
    const dataProductos = await obtenerProductos();
    const dataInsumos = await obtenerInsumos();
    
    setRecetas(dataRecetas);
    setProductos(dataProductos);
    setInsumos(dataInsumos);

    if(dataProductos.length > 0) setIdProducto(dataProductos[0].id_producto);
    if(dataInsumos.length > 0) setIdInsumo(dataInsumos[0].id_insumo);
  };

  const guardarIngredienteExtra = async (e) => {
    e.preventDefault();
    await crearReceta({ id_producto: idProducto, id_insumo: idInsumo, cantidad_necesaria: cantidad });
    alert("¡Ingrediente añadido a la receta!");
    setCantidad("");
    cargarDatos(); 
  };

  const borrarIngrediente = async (idReceta) => {
    const confirmar = window.confirm("¿Estás seguro de quitar este ingrediente de la receta?");
    if (!confirmar) return;
    await eliminarReceta(idReceta);
    cargarDatos(); 
  };

  // FUNCIONES PARA EDITAR
  const abrirEdicion = (item) => {
    setRecetaEditando(item);
    setIdInsumoEdit(item.id_insumo); // Pre-selecciona el insumo actual
    setCantidadEdit(item.cantidad_necesaria); // Pre-llena la cantidad actual
    setModoFormulario("editar");
  };

  const guardarEdicion = async (e) => {
    e.preventDefault();
    await actualizarReceta(recetaEditando.id_receta, {
      id_insumo: idInsumoEdit,
      cantidad_necesaria: parseFloat(cantidadEdit)
    });
    alert("¡Ingrediente actualizado!");
    setModoFormulario("cerrado");
    setRecetaEditando(null);
    cargarDatos();
  };

  // Agrupar las recetas por nombre de producto
  const recetasAgrupadas = recetas.reduce((grupos, receta) => {
    if (!grupos[receta.producto]) grupos[receta.producto] = [];
    grupos[receta.producto].push(receta);
    return grupos;
  }, {});

  return (
    <div>
      <h1 className="page-title">Libro de Recetas Oficial 📖</h1>

      {/* BARRA SUPERIOR PARA AGREGAR INGREDIENTE EXTRA */}
      <form onSubmit={guardarIngredienteExtra} style={{ background: "#e3f2fd", padding: "15px", marginBottom: "20px", borderRadius: "8px" }}>
        <h4 style={{ marginTop: 0, color: "#004085" }}>➕ Agregar ingrediente nuevo a una receta existente:</h4>
        <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
          <select value={idProducto} onChange={(e) => setIdProducto(e.target.value)} style={{ padding: "5px" }}>
            {productos.map(p => <option key={p.id_producto} value={p.id_producto}>{p.nombre}</option>)}
          </select>
          <span>necesita</span>
          <input type="number" step="0.01" placeholder="Cant." value={cantidad} onChange={(e) => setCantidad(e.target.value)} required style={{ width: "70px", padding: "5px" }} />
          <span>de</span>
          <select value={idInsumo} onChange={(e) => setIdInsumo(e.target.value)} style={{ padding: "5px" }}>
            {insumos.map(i => <option key={i.id_insumo} value={i.id_insumo}>{i.nombre}</option>)}
          </select>
          <button type="submit" className="btn btn-primary" style={{ background: "#0d6efd" }}>Agregar Insumo</button>
        </div>
      </form>

      {/* EL LIBRO AGRUPADO CON BOTONES DE EDITAR Y ELIMINAR */}
      <div style={{ display: "grid", gap: "20px", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
        {Object.keys(recetasAgrupadas).length === 0 ? (
          <p>Aún no hay recetas registradas.</p>
        ) : (
          Object.keys(recetasAgrupadas).map((nombreProducto) => (
            <div key={nombreProducto} style={{ background: "#f8f9fa", border: "1px solid #dee2e6", borderRadius: "8px", padding: "15px" }}>
              <h3 style={{ borderBottom: "2px solid #0d6efd", paddingBottom: "5px", marginTop: 0 }}>
                🎂 {nombreProducto}
              </h3>
              <ul style={{ listStyle: "none", padding: 0 }}>
                {recetasAgrupadas[nombreProducto].map((item) => (
                  <li key={item.id_receta} style={{ padding: "8px 0", borderBottom: "1px dashed #ccc", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>{item.insumo}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <strong style={{ color: "green" }}>{item.cantidad_necesaria}</strong>
                      
                      {/* BOTONES DE ACCIÓN */}
                      <button className="btn btn-warning" style={{ padding: "2px 6px", fontSize: "12px" }} onClick={() => abrirEdicion(item)}>
                        Editar
                      </button>
                      <button className="btn btn-danger" style={{ padding: "2px 6px", fontSize: "12px" }} onClick={() => borrarIngrediente(item.id_receta)}>
                        Eliminar
                      </button>

                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>

      {/* EL MODAL DE EDICIÓN (Igualito al de Productos) */}
      {modoFormulario === "editar" && recetaEditando && (
        <div className="modal-overlay">
          <div className="modal-box" style={{ background: "white", padding: "20px", borderRadius: "8px", maxWidth: "400px" }}>
            <h3 style={{ marginTop: 0 }}>✏️ Editar Ingrediente</h3>
            
            <form onSubmit={guardarEdicion}>
              <div className="form-group" style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Producto:</label>
                {/* El producto no se edita aquí, solo se muestra como referencia */}
                <input type="text" value={recetaEditando.producto} disabled style={{ width: "100%", padding: "8px", background: "#e9ecef" }} />
              </div>
              
              <div className="form-group" style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Insumo Correcto:</label>
                <select value={idInsumoEdit} onChange={(e) => setIdInsumoEdit(e.target.value)} style={{ width: "100%", padding: "8px" }}>
                  {insumos.map(i => <option key={i.id_insumo} value={i.id_insumo}>{i.nombre}</option>)}
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Cantidad Necesaria:</label>
                <input type="number" step="0.01" value={cantidadEdit} onChange={(e) => setCantidadEdit(e.target.value)} required style={{ width: "100%", padding: "8px" }} />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>
                <button type="button" className="btn btn-secondary" style={{ background: "#6c757d", color: "white" }} onClick={() => setModoFormulario("cerrado")}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" style={{ background: "#0d6efd" }}>
                  Guardar Cambios
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}

export default Recetas;