import { useEffect, useState } from "react";
import { obtenerProductos, eliminarProducto } from "../services/productoService";
import ProductTable from "../components/ProductTable";
import ProductModal from "../components/ProductModal";
import FormProducto from "../components/FormProducto";
import "../styles/productos.css";
import "../styles/table.css";
import "../styles/modal.css";

const STOCK_MINIMO_PRODUCTO = 5;

function Productos() {
  const [productos, setProductos]       = useState([]);
  const [alertas, setAlertas]           = useState([]);
  const [modalCrear, setModalCrear]     = useState(false);
  const [productoEditar, setProductoEditar] = useState(null);
  const [productoAEliminar, setProductoAEliminar] = useState(null);

  useEffect(() => { cargarProductos(); }, []);
  const cargarProductos = async () => {
    const data = await obtenerProductos();
    setProductos(data);
    const bajoStock = data.filter(p => parseInt(p.stock_actual) < STOCK_MINIMO_PRODUCTO);
    setAlertas(bajoStock);
  };

  const borrarProducto = async () => {
    if (!productoAEliminar) return;
    await eliminarProducto(productoAEliminar.id_producto);
    setProductoAEliminar(null);
    cargarProductos();
  };

  return (
    <div className="animate-in">
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Vitrina de <span>Productos</span></h1>
          <p className="section-label">{productos.length} productos registrados</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={() => setModalCrear(true)}>
            + Nuevo Producto
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
              {alertas.length} producto{alertas.length > 1 ? "s" : ""} con stock bajo el mínimo ({STOCK_MINIMO_PRODUCTO} unidades)
            </strong>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-xs)" }}>
            {alertas.map(p => (
              <span key={p.id_producto} style={{
                padding: "3px 10px",
                borderRadius: "var(--radius-pill)",
                background: "var(--danger-bg)",
                border: "1px solid rgba(192,57,43,0.2)",
                fontSize: "0.78rem",
                fontWeight: 600,
                color: "var(--danger)",
              }}>
                {p.nombre} — {p.stock_actual} unid.
              </span>
            ))}
          </div>
          <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", margin: 0 }}>
            Registra producción en <strong>"Registrar Horneado"</strong> para reponer. La alerta desaparecerá automáticamente.
          </p>
        </div>
      )}
      <div className="table-container">
        <div className="table-toolbar">
          <div className="table-toolbar-left">
            <span className="card-title">Inventario de Productos</span>
          </div>
          <div className="table-toolbar-right">
            {alertas.length > 0 && (
              <span className="badge badge-danger">⚠️ {alertas.length} bajo mínimo</span>
            )}
            <span className="section-label">{productos.length} registros</span>
          </div>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Precio Venta</th>
              <th>Stock</th>
              <th>Estado</th>
              <th style={{ textAlign: "right" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <div className="empty-state">
                    <span className="empty-state-icon">🧁</span>
                    <p className="empty-state-title">Sin productos</p>
                    <p>Agrega tu primer producto para comenzar</p>
                  </div>
                </td>
              </tr>
            ) : (
              [...productos]
                .sort((a, b) => a.stock_actual - b.stock_actual)
                .map((p) => {
                  const bajoStock = parseInt(p.stock_actual) < STOCK_MINIMO_PRODUCTO;
                  return (
                    <tr key={p.id_producto} style={bajoStock ? { background: "rgba(192,57,43,0.06)" } : {}}>
                      <td className="col-id">{p.id_producto}</td>
                      <td className="col-name">{p.nombre}</td>
                      <td className="col-price">S/ {parseFloat(p.precio_venta).toFixed(2)}</td>
                      <td>
                        <span className={`col-stock ${bajoStock ? "low" : "ok"}`}>
                          {p.stock_actual} unid.
                        </span>
                      </td>
                      <td>
                        {bajoStock
                          ? <span className="badge badge-danger">⚠️ Stock bajo</span>
                          : <span className="badge badge-success">✓ Disponible</span>
                        }
                      </td>
                      <td>
                        <div className="col-actions">
                          <button className="action-btn edit" title="Editar" onClick={() => setProductoEditar(p)}>✏️</button>
                          <button className="action-btn delete" title="Eliminar" onClick={() => setProductoAEliminar(p)}>🗑️</button>
                        </div>
                      </td>
                    </tr>
                  );
                })
            )}
          </tbody>
        </table>
      </div>
      {modalCrear && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setModalCrear(false)}>
          <div className="modal">
            <div className="modal-header">
              <div>
                <h3 className="modal-title">Nuevo Producto</h3>
                <p className="modal-subtitle">Completa los datos del producto</p>
              </div>
              <button className="modal-close" onClick={() => setModalCrear(false)}>✕</button>
            </div>
            <div className="modal-body">
              <FormProducto
                recargarProductos={() => { cargarProductos(); setModalCrear(false); }}
              />
            </div>
          </div>
        </div>
      )}
      {productoEditar && (
        <ProductModal
          producto={productoEditar}
          cerrarModal={() => setProductoEditar(null)}
          recargarProductos={cargarProductos}
        />
      )}
      {productoAEliminar && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setProductoAEliminar(null)}>
          <div className="modal modal-sm">
            <div className="modal-header">
              <h3 className="modal-title">Eliminar Producto</h3>
              <button className="modal-close" onClick={() => setProductoAEliminar(null)}>✕</button>
            </div>
            <div className="modal-body" style={{ textAlign: "center", padding: "var(--space-xl)" }}>
              <div className="confirm-icon danger" style={{ margin: "0 auto var(--space-md)", width: 56, height: 56, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", background: "var(--danger-bg)" }}>🗑️</div>
              <p style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", color: "var(--text-primary)", marginBottom: "var(--space-sm)" }}>
                ¿Eliminar <strong>{productoAEliminar.nombre}</strong>?
              </p>
              <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                Esta acción no se puede deshacer.
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setProductoAEliminar(null)}>Cancelar</button>
              <button className="btn btn-danger" onClick={borrarProducto}>Sí, eliminar</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Productos;