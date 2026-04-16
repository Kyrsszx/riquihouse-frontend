import { useEffect, useState } from "react";
import { obtenerRecetas, crearReceta, eliminarReceta, actualizarReceta } from "../services/recetaService";
import { obtenerProductos } from "../services/productoService";
import { obtenerInsumos } from "../services/insumoService";
import "../styles/globals.css";
import "../styles/modal.css";
import "../styles/table.css";

function Recetas() {
  const [recetas, setRecetas]     = useState([]);
  const [productos, setProductos] = useState([]);
  const [insumos, setInsumos]     = useState([]);
  const [panel, setPanel] = useState("cerrado");
  const [prodNuevo, setProdNuevo]         = useState("");
  const [lineaInsumo, setLineaInsumo]     = useState("");
  const [lineaCantidad, setLineaCantidad] = useState("");
  const [borradorLineas, setBorradorLineas] = useState([]);
  const [idProductoExtra, setIdProductoExtra] = useState("");
  const [idInsumoExtra, setIdInsumoExtra]     = useState("");
  const [cantidadExtra, setCantidadExtra]     = useState("");
  const [recetaEditando, setRecetaEditando]   = useState(null);
  const [idInsumoEdit, setIdInsumoEdit]       = useState("");
  const [cantidadEdit, setCantidadEdit]       = useState("");
  const [itemAEliminar, setItemAEliminar]     = useState(null);

  useEffect(() => { cargarDatos(); }, []);

  const cargarDatos = async () => {
    const [dataRecetas, dataProductos, dataInsumos] = await Promise.all([
      obtenerRecetas(),
      obtenerProductos(),
      obtenerInsumos(),
    ]);
    setRecetas(dataRecetas);
    setProductos(dataProductos);
    setInsumos(dataInsumos);
    if (dataProductos.length > 0) {
      setProdNuevo(dataProductos[0].id_producto);
      setIdProductoExtra(dataProductos[0].id_producto);
    }
    if (dataInsumos.length > 0) {
      setLineaInsumo(dataInsumos[0].id_insumo);
      setIdInsumoExtra(dataInsumos[0].id_insumo);
    }
  };

  const agregarLineaBorrador = () => {
    if (!lineaCantidad || parseFloat(lineaCantidad) <= 0) return;
    const insumoObj = insumos.find(i => i.id_insumo === parseInt(lineaInsumo));
    if (borradorLineas.find(l => l.id_insumo === parseInt(lineaInsumo))) {
      alert("Este insumo ya está en la lista. Edita la cantidad directamente.");
      return;
    }
    setBorradorLineas([...borradorLineas, {
      id_insumo:         parseInt(lineaInsumo),
      nombre_insumo:     insumoObj?.nombre || `Insumo #${lineaInsumo}`,
      cantidad_necesaria: parseFloat(lineaCantidad),
    }]);
    setLineaCantidad("");
  };

  const quitarLineaBorrador = (id_insumo) => {
    setBorradorLineas(borradorLineas.filter(l => l.id_insumo !== id_insumo));
  };
  const guardarRecetaNueva = async (e) => {
    e.preventDefault();
    if (borradorLineas.length === 0) {
      alert("Agrega al menos un ingrediente antes de guardar.");
      return;
    }
    try {
      for (const linea of borradorLineas) {
        await crearReceta({
          id_producto:       parseInt(prodNuevo),
          id_insumo:         linea.id_insumo,
          cantidad_necesaria: linea.cantidad_necesaria,
        });
      }
      setBorradorLineas([]);
      setPanel("cerrado");
      cargarDatos();
    } catch {
      alert("Error al guardar la receta");
    }
  };
  const guardarIngredienteExtra = async (e) => {
    e.preventDefault();
    try {
      await crearReceta({
        id_producto:       parseInt(idProductoExtra),
        id_insumo:         parseInt(idInsumoExtra),
        cantidad_necesaria: parseFloat(cantidadExtra),
      });
      setCantidadExtra("");
      setPanel("cerrado");
      cargarDatos();
    } catch {
      alert("Error al agregar el ingrediente");
    }
  };
  const abrirEdicion = (item) => {
    setRecetaEditando(item);
    setIdInsumoEdit(item.id_insumo);
    setCantidadEdit(item.cantidad_necesaria);
  };

  const guardarEdicion = async (e) => {
    e.preventDefault();
    try {
      await actualizarReceta(recetaEditando.id_receta, {
        id_insumo:         parseInt(idInsumoEdit),
        cantidad_necesaria: parseFloat(cantidadEdit),
      });
      setRecetaEditando(null);
      cargarDatos();
    } catch {
      alert("Error al editar el ingrediente");
    }
  };
  const confirmarEliminar = async () => {
    if (!itemAEliminar) return;
    await eliminarReceta(itemAEliminar.id_receta);
    setItemAEliminar(null);
    cargarDatos();
  };
  const recetasAgrupadas = recetas.reduce((grupos, receta) => {
    if (!grupos[receta.producto]) grupos[receta.producto] = [];
    grupos[receta.producto].push(receta);
    return grupos;
  }, {});

  const nombreInsumo = (id) => insumos.find(i => i.id_insumo === parseInt(id))?.nombre || `Insumo #${id}`;

  return (
    <div className="animate-in">
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Libro de <span>Recetas</span></h1>
          <p className="section-label">{Object.keys(recetasAgrupadas).length} recetas registradas</p>
        </div>
        <div className="page-header-actions">
          <button
            className={`btn ${panel === "ingrediente" ? "btn-secondary" : "btn-ghost"}`}
            onClick={() => setPanel(panel === "ingrediente" ? "cerrado" : "ingrediente")}
          >
            + Agregar ingrediente
          </button>
          <button
            className={`btn ${panel === "nuevo" ? "btn-secondary" : "btn-primary"}`}
            onClick={() => { setPanel(panel === "nuevo" ? "cerrado" : "nuevo"); setBorradorLineas([]); }}
          >
            📖 Nueva Receta
          </button>
        </div>
      </div>
      {panel === "nuevo" && (
        <div className="card" style={{ marginBottom: "var(--space-lg)" }}>
          <div className="card-header">
            <span className="card-title">📖 Crear Nueva Receta</span>
            <button className="modal-close" onClick={() => { setPanel("cerrado"); setBorradorLineas([]); }}>✕</button>
          </div>
          <div className="card-body">
            <div className="form-group">
              <label className="form-label">Producto que se elabora</label>
              <select value={prodNuevo} onChange={(e) => setProdNuevo(e.target.value)}>
                {productos.map(p => (
                  <option key={p.id_producto} value={p.id_producto}>{p.nombre}</option>
                ))}
              </select>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 160px auto", gap: "var(--space-md)", alignItems: "flex-end", marginBottom: "var(--space-md)" }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Insumo (ingrediente)</label>
                <select value={lineaInsumo} onChange={(e) => setLineaInsumo(e.target.value)}>
                  {insumos.map(i => (
                    <option key={i.id_insumo} value={i.id_insumo}>{i.nombre}</option>
                  ))}
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Cantidad</label>
                <input
                  type="number" step="0.01" min="0.01"
                  placeholder="0.00"
                  value={lineaCantidad}
                  onChange={(e) => setLineaCantidad(e.target.value)}
                />
              </div>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ height: "40px" }}
                onClick={agregarLineaBorrador}
              >
                + Añadir
              </button>
            </div>
            {borradorLineas.length > 0 ? (
              <div style={{ marginBottom: "var(--space-lg)" }}>
                <p className="section-label" style={{ marginBottom: "var(--space-sm)" }}>
                  Ingredientes de la receta ({borradorLineas.length})
                </p>
                <div className="ingrediente-list">
                  {borradorLineas.map((linea) => (
                    <div key={linea.id_insumo} className="ingrediente-row">
                      <span className="ingrediente-name">{linea.nombre_insumo}</span>
                      <span className="ingrediente-qty">{linea.cantidad_necesaria} unid.</span>
                      <button
                        className="action-btn delete"
                        onClick={() => quitarLineaBorrador(linea.id_insumo)}
                        title="Quitar"
                      >✕</button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{
                padding: "var(--space-lg)",
                textAlign: "center",
                background: "var(--bg-elevated)",
                borderRadius: "var(--radius-md)",
                color: "var(--text-muted)",
                fontSize: "0.85rem",
                marginBottom: "var(--space-lg)",
                border: "1px dashed var(--border-default)",
              }}>
                Aún no hay ingredientes. Selecciona un insumo y cantidad, luego pulsa <strong>"+ Añadir"</strong>.
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--space-sm)" }}>
              <button className="btn btn-secondary" onClick={() => { setPanel("cerrado"); setBorradorLineas([]); }}>
                Cancelar
              </button>
              <button
                className="btn btn-primary"
                onClick={guardarRecetaNueva}
                disabled={borradorLineas.length === 0}
              >
                💾 Guardar Receta ({borradorLineas.length} ingrediente{borradorLineas.length !== 1 ? "s" : ""})
              </button>
            </div>

          </div>
        </div>
      )}
      {panel === "ingrediente" && (
        <div className="card" style={{ marginBottom: "var(--space-lg)" }}>
          <div className="card-header">
            <span className="card-title">➕ Agregar Ingrediente a Receta Existente</span>
            <button className="modal-close" onClick={() => setPanel("cerrado")}>✕</button>
          </div>
          <div className="card-body">
            <form onSubmit={guardarIngredienteExtra}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 160px auto", gap: "var(--space-md)", alignItems: "flex-end" }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Producto (receta existente)</label>
                  <select value={idProductoExtra} onChange={(e) => setIdProductoExtra(e.target.value)}>
                    {productos.map(p => (
                      <option key={p.id_producto} value={p.id_producto}>{p.nombre}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Insumo a agregar</label>
                  <select value={idInsumoExtra} onChange={(e) => setIdInsumoExtra(e.target.value)}>
                    {insumos.map(i => (
                      <option key={i.id_insumo} value={i.id_insumo}>{i.nombre}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Cantidad</label>
                  <input
                    type="number" step="0.01" min="0.01"
                    placeholder="0.00"
                    value={cantidadExtra}
                    onChange={(e) => setCantidadExtra(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ height: "40px" }}>
                  Agregar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {Object.keys(recetasAgrupadas).length === 0 ? (
        <div className="empty-state" style={{ padding: "var(--space-3xl)" }}>
          <span className="empty-state-icon">📖</span>
          <p className="empty-state-title">No hay recetas registradas</p>
          <p>Pulsa <strong>"Nueva Receta"</strong> para crear la primera</p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "var(--space-md)", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
          {Object.keys(recetasAgrupadas).map((nombreProducto) => (
            <div key={nombreProducto} className="card">
              <div className="card-header">
                <span className="card-title">🎂 {nombreProducto}</span>
                <span className="badge badge-gold">
                  {recetasAgrupadas[nombreProducto].length} ingrediente{recetasAgrupadas[nombreProducto].length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="card-body" style={{ padding: 0 }}>
                {recetasAgrupadas[nombreProducto].map((item) => (
                  <div key={item.id_receta} style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "var(--space-sm) var(--space-lg)",
                    borderBottom: "1px solid var(--border-subtle)",
                  }}>
                    <span style={{ fontSize: "0.875rem", color: "var(--text-primary)", fontWeight: 500 }}>
                      {item.insumo}
                    </span>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
                      <span style={{
                        fontSize: "0.82rem", fontWeight: 700,
                        color: "var(--gold)", minWidth: "50px", textAlign: "right",
                      }}>
                        {item.cantidad_necesaria} unid.
                      </span>
                      <button className="action-btn edit" title="Editar" onClick={() => abrirEdicion(item)}>✏️</button>
                      <button className="action-btn delete" title="Eliminar" onClick={() => setItemAEliminar(item)}>🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      {recetaEditando && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setRecetaEditando(null)}>
          <div className="modal modal-sm">
            <div className="modal-header">
              <div>
                <h3 className="modal-title">Editar Ingrediente</h3>
                <p className="modal-subtitle">{recetaEditando.producto}</p>
              </div>
              <button className="modal-close" onClick={() => setRecetaEditando(null)}>✕</button>
            </div>
            <div className="modal-body">
              <form id="form-editar-receta" onSubmit={guardarEdicion}>
                <div className="form-group">
                  <label className="form-label">Insumo</label>
                  <select value={idInsumoEdit} onChange={(e) => setIdInsumoEdit(e.target.value)}>
                    {insumos.map(i => (
                      <option key={i.id_insumo} value={i.id_insumo}>{i.nombre}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Cantidad necesaria</label>
                  <input
                    type="number" step="0.01" min="0.01"
                    value={cantidadEdit}
                    onChange={(e) => setCantidadEdit(e.target.value)}
                    required
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setRecetaEditando(null)}>Cancelar</button>
              <button type="submit" form="form-editar-receta" className="btn btn-primary">Guardar Cambios</button>
            </div>
          </div>
        </div>
      )}
      {itemAEliminar && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setItemAEliminar(null)}>
          <div className="modal modal-sm">
            <div className="modal-header">
              <h3 className="modal-title">Eliminar Ingrediente</h3>
              <button className="modal-close" onClick={() => setItemAEliminar(null)}>✕</button>
            </div>
            <div className="modal-body" style={{ textAlign: "center", padding: "var(--space-xl)" }}>
              <div style={{ fontSize: "2rem", marginBottom: "var(--space-md)" }}>🗑️</div>
              <p style={{ fontFamily: "var(--font-display)", fontSize: "1.05rem", color: "var(--text-primary)", marginBottom: "var(--space-sm)" }}>
                ¿Quitar <strong>{itemAEliminar.insumo}</strong> de la receta de <strong>{itemAEliminar.producto}</strong>?
              </p>
              <p style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>
                Esta acción no se puede deshacer.
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setItemAEliminar(null)}>Cancelar</button>
              <button className="btn btn-danger" onClick={confirmarEliminar}>Sí, eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Recetas;