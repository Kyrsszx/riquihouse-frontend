import { useState } from "react";
import { actualizarProducto } from "../services/productoService";
import "../styles/modal.css";

function ProductModal({ producto, cerrarModal, recargarProductos }) {
  const [nombre, setNombre] = useState(producto.nombre);
  const [precio, setPrecio] = useState(producto.precio_venta ?? producto.precio ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const guardarCambios = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await actualizarProducto(producto.id_producto, {
        nombre,
        precio_venta: parseFloat(precio),
        stock_actual: producto.stock_actual,
      });
      recargarProductos();
      cerrarModal();
    } catch (err) {
      setError("Error al actualizar el producto. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && cerrarModal()}>
      <div className="modal modal-sm">

        {/* Header */}
        <div className="modal-header">
          <div>
            <h3 className="modal-title">Editar Producto</h3>
            <p className="modal-subtitle">ID #{producto.id_producto}</p>
          </div>
          <button className="modal-close" onClick={cerrarModal}>✕</button>
        </div>

        {/* Body */}
        <div className="modal-body">

          {error && (
            <div className="login-error" style={{ marginBottom: "var(--space-md)" }}>
              <span>⚠️</span> {error}
            </div>
          )}

          <form id="form-producto" onSubmit={guardarCambios}>

            <div className="form-group">
              <label className="form-label">Nombre del Producto</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej: Croissant de mantequilla"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Precio de Venta (S/.)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                placeholder="0.00"
                required
              />
              <span className="form-hint">Ingresa el precio en soles peruanos</span>
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={cerrarModal} disabled={loading}>
            Cancelar
          </button>
          <button
            type="submit"
            form="form-producto"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>

      </div>
    </div>
  );
}

export default ProductModal;
