import { useEffect, useState } from "react";
import { obtenerInsumos, eliminarInsumo, crearInsumo, actualizarInsumo } from "../services/insumoService";
import "../styles/globals.css";
import "../styles/table.css";
import "../styles/modal.css";

const STOCK_MINIMO = 20;

function Insumos() {
  const [insumos, setInsumos]           = useState([]);
  const [alertas, setAlertas]           = useState([]);
  const [modoFormulario, setModoFormulario] = useState("cerrado");
  const [nombre, setNombre]   = useState("");
  const [costo, setCosto]     = useState("");
  const [stock, setStock]     = useState("");
  const [idSeleccionado, setIdSeleccionado]   = useState("");
  const [cantidadExtra, setCantidadExtra]     = useState("");
  const [insumoEditando, setInsumoEditando]   = useState(null);
  const [nombreEdit, setNombreEdit]           = useState("");
  const [costoEdit, setCostoEdit]             = useState("");
  const [insumoAEliminar, setInsumoAEliminar] = useState(null);

  useEffect(() => { cargarInsumos(); }, []);
  const cargarInsumos = async () => {
    const data = await obtenerInsumos();
    setInsumos(data);
    if (data.length > 0) setIdSeleccionado(data[0].id_insumo);
    const bajoStock = data.filter(i => parseFloat(i.stock_actual) < STOCK_MINIMO);
    setAlertas(bajoStock);
  };

  const borrarInsumo = async () => {
    if (!insumoAEliminar) return;
    await eliminarInsumo(insumoAEliminar.id_insumo);
    setInsumoAEliminar(null);
    cargarInsumos();
  };

  const guardarNuevoInsumo = async (e) => {
    e.preventDefault();
    try {
      await crearInsumo({
        nombre,
        costo_unitario: parseFloat(costo),
        stock_actual: parseFloat(stock) || 0,
      });
      setNombre(""); setCosto(""); setStock("");
      setModoFormulario("cerrado");
      cargarInsumos();
    } catch {
      alert("Error al guardar el insumo");
    }
  };
  const agregarStockExistente = async (e) => {
    e.preventDefault();
    try {
      const insumoOriginal = insumos.find(i => i.id_insumo === parseInt(idSeleccionado));
      const nuevoStock = parseFloat(insumoOriginal.stock_actual) + parseFloat(cantidadExtra);
      await actualizarInsumo(idSeleccionado, {
        nombre: insumoOriginal.nombre,
        costo_unitario: insumoOriginal.costo_unitario,
        stock_actual: nuevoStock,
      });
      setCantidadExtra("");
      setModoFormulario("cerrado");
      cargarInsumos();
    } catch {
      alert("Error al actualizar el stock");
    }
  };

  const abrirEdicion = (insumo) => {
    setInsumoEditando(insumo);
    setNombreEdit(insumo.nombre);
    setCostoEdit(insumo.costo_unitario);
    setModoFormulario("editar");
  };

  const guardarEdicion = async (e) => {
    e.preventDefault();
    try {
      await actualizarInsumo(insumoEditando.id_insumo, {
        nombre: nombreEdit,
        costo_unitario: parseFloat(costoEdit),
        stock_actual: insumoEditando.stock_actual,
      });
      setModoFormulario("cerrado");
      setInsumoEditando(null);
      cargarInsumos();
    } catch {
      alert("Error al editar el insumo");
    }
  };

  const insumosOrdenados = [...insumos].sort((a, b) => a.stock_actual - b.stock_actual);

  return (
    <div className="animate-in">
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Almacén de <span>Insumos</span></h1>
          <p className="section-label">{insumos.length} ingredientes registrados</p>
        </div>
        <div className="page-header-actions">
          <button
            className="btn btn-secondary"
            onClick={() => setModoFormulario(modoFormulario === "existente" ? "cerrado" : "existente")}
          >
            📦 Ingresar más Stock
          </button>
          <button
            className="btn btn-primary"
            onClick={() => setModoFormulario(modoFormulario === "nuevo" ? "cerrado" : "nuevo")}
          >
            + Nuevo Insumo
          </button>
        </div>
      </div>
      {alertas.length > 0 && (
        <div style={{
          background: "rgba(192, 57, 43, 0.08)",
          border: "1px solid rgba(192, 57, 43, 0.25)",
          borderLeft: "4px solid var(--danger)",
          borderRadius: "var(--radius-lg)",
          padding: "var(--space-md) var(--space-lg)",
          marginBottom: "var(--space-lg)",
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-sm)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
            <span style={{ fontSize: "1.1rem" }}>⚠️</span>
            <strong style={{ color: "var(--danger)", fontFamily: "var(--font-display)", fontSize: "1rem" }}>
              {alertas.length} insumo{alertas.length > 1 ? "s" : ""} con stock bajo el mínimo ({STOCK_MINIMO} unidades)
            </strong>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-xs)" }}>
            {alertas.map(a => (
              <span key={a.id_insumo} style={{
                padding: "3px 10px",
                borderRadius: "var(--radius-pill)",
                background: "var(--danger-bg)",
                border: "1px solid rgba(192,57,43,0.2)",
                fontSize: "0.78rem",
                fontWeight: 600,
                color: "var(--danger)",
              }}>
                {a.nombre} — {parseFloat(a.stock_actual).toFixed(2)} unid.
              </span>
            ))}
          </div>
          <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", margin: 0 }}>
            Usa <strong>"Ingresar más Stock"</strong> para reponer. La alerta desaparecerá automáticamente. {/* CA3 */}
          </p>
        </div>
      )}
      {modoFormulario === "existente" && (
        <div className="card" style={{ marginBottom: "var(--space-lg)" }}>
          <div className="card-header">
            <span className="card-title">📦 Ingresar Stock a Insumo Existente</span>
            <button className="modal-close" onClick={() => setModoFormulario("cerrado")}>✕</button>
          </div>
          <div className="card-body">
            <form onSubmit={agregarStockExistente}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 180px auto", gap: "var(--space-md)", alignItems: "flex-end" }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Insumo</label>
                  <select value={idSeleccionado} onChange={(e) => setIdSeleccionado(e.target.value)}>
                    {insumos.map(i => (
                      <option key={i.id_insumo} value={i.id_insumo}>
                        {i.nombre} (Stock actual: {parseFloat(i.stock_actual).toFixed(2)})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Cantidad a sumar</label>
                  <input
                    type="number" step="0.01" min="0.01"
                    value={cantidadExtra}
                    onChange={(e) => setCantidadExtra(e.target.value)}
                    placeholder="0.00"
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ height: "40px" }}>
                  Sumar Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {modoFormulario === "nuevo" && (
        <div className="card" style={{ marginBottom: "var(--space-lg)" }}>
          <div className="card-header">
            <span className="card-title">✨ Registrar Nuevo Insumo</span>
            <button className="modal-close" onClick={() => setModoFormulario("cerrado")}>✕</button>
          </div>
          <div className="card-body">
            <form onSubmit={guardarNuevoInsumo}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 160px 160px auto", gap: "var(--space-md)", alignItems: "flex-end" }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Nombre</label>
                  <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej: Harina de trigo" required />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Costo unitario (S/.)</label>
                  <input type="number" step="0.01" value={costo} onChange={(e) => setCosto(e.target.value)} placeholder="0.00" required />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Stock inicial</label>
                  <input type="number" step="0.01" value={stock} onChange={(e) => setStock(e.target.value)} placeholder="0.00" required />
                </div>
                <button type="submit" className="btn btn-primary" style={{ height: "40px" }}>
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {modoFormulario === "editar" && insumoEditando && (
        <div className="card" style={{ marginBottom: "var(--space-lg)" }}>
          <div className="card-header">
            <span className="card-title">✏️ Editar Insumo — {insumoEditando.nombre}</span>
            <button className="modal-close" onClick={() => setModoFormulario("cerrado")}>✕</button>
          </div>
          <div className="card-body">
            <form onSubmit={guardarEdicion}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 200px auto", gap: "var(--space-md)", alignItems: "flex-end" }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Nombre</label>
                  <input type="text" value={nombreEdit} onChange={(e) => setNombreEdit(e.target.value)} required />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Costo unitario (S/.)</label>
                  <input type="number" step="0.01" value={costoEdit} onChange={(e) => setCostoEdit(e.target.value)} required />
                </div>
                <div style={{ display: "flex", gap: "var(--space-sm)" }}>
                  <button type="submit" className="btn btn-primary" style={{ height: "40px" }}>Guardar</button>
                  <button type="button" className="btn btn-secondary" style={{ height: "40px" }} onClick={() => setModoFormulario("cerrado")}>Cancelar</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="table-container">
        <div className="table-toolbar">
          <div className="table-toolbar-left">
            <span className="card-title">Inventario de Insumos</span>
          </div>
          <div className="table-toolbar-right">
            {alertas.length > 0 && (
              <span className="badge badge-danger">
                ⚠️ {alertas.length} bajo mínimo
              </span>
            )}
            <span className="section-label">{insumos.length} registros</span>
          </div>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre del Insumo</th>
              <th>Costo Unitario</th>
              <th>Stock Actual</th>
              <th>Estado</th>
              <th style={{ textAlign: "right" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {insumosOrdenados.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <div className="empty-state">
                    <span className="empty-state-icon">📦</span>
                    <p className="empty-state-title">El almacén está vacío</p>
                    <p>Registra tu primer insumo para comenzar</p>
                  </div>
                </td>
              </tr>
            ) : (
              insumosOrdenados.map((insumo) => {
                const esPocoStock = parseFloat(insumo.stock_actual) < STOCK_MINIMO;
                return (
                  <tr key={insumo.id_insumo} style={esPocoStock ? { background: "rgba(192,57,43,0.06)" } : {}}>
                    <td className="col-id">{insumo.id_insumo}</td>
                    <td className="col-name">{insumo.nombre}</td>
                    <td style={{ color: "var(--text-secondary)" }}>
                      S/ {parseFloat(insumo.costo_unitario).toFixed(2)}
                    </td>
                    <td>
                      <span className={`col-stock ${esPocoStock ? "low" : "ok"}`}>
                        {parseFloat(insumo.stock_actual).toFixed(2)}
                      </span>
                    </td>
                    <td>
                      {esPocoStock ? (
                        <span className="badge badge-danger">⚠️ Stock bajo</span>
                      ) : (
                        <span className="badge badge-success">✓ Óptimo</span>
                      )}
                    </td>
                    <td>
                      <div className="col-actions">
                        <button className="action-btn edit" title="Editar" onClick={() => abrirEdicion(insumo)}>✏️</button>
                        <button className="action-btn delete" title="Eliminar" onClick={() => setInsumoAEliminar(insumo)}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      {insumoAEliminar && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setInsumoAEliminar(null)}>
          <div className="modal modal-sm">
            <div className="modal-header">
              <h3 className="modal-title">Eliminar Insumo</h3>
              <button className="modal-close" onClick={() => setInsumoAEliminar(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="confirm-modal" style={{ textAlign: "center", padding: "var(--space-md) 0" }}>
                <div className="confirm-icon danger" style={{ margin: "0 auto var(--space-md)" }}>🗑️</div>
                <p className="confirm-title" style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", color: "var(--text-primary)", marginBottom: "var(--space-sm)" }}>
                  ¿Eliminar <strong>{insumoAEliminar.nombre}</strong>?
                </p>
                <p className="confirm-message" style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                  Esta acción no se puede deshacer. Se eliminará permanentemente del almacén.
                </p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setInsumoAEliminar(null)}>Cancelar</button>
              <button className="btn btn-danger" onClick={borrarInsumo}>Sí, eliminar</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Insumos;