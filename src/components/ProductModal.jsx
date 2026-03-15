import { useState } from "react";
import { actualizarProducto } from "../services/productoService";

function ProductModal({ producto, cerrarModal, recargarProductos }) {
  const [nombre, setNombre] = useState(producto.nombre);
  // Asumimos que el producto trae 'precio' o 'precio_venta'
  const [precio, setPrecio] = useState(producto.precio_venta || producto.precio || "");

  const guardarCambios = async (e) => {
    e.preventDefault();
    try {
      await actualizarProducto(producto.id_producto, {
        nombre: nombre,
        precio_venta: parseFloat(precio), // <--- Coincide con tu Backend
        stock_actual: producto.stock_actual // Mantenemos el stock intacto
      });
      alert("¡Producto actualizado!");
      recargarProductos(); // Refresca la tabla por detrás
      cerrarModal(); // Cierra la ventanita
    } catch (error) {
      alert("Error al actualizar el producto");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box" style={{ background: "white", padding: "20px", borderRadius: "8px", maxWidth: "400px" }}>
        <h3 style={{ marginTop: 0 }}>✏️ Editar Producto</h3>
        
        <form onSubmit={guardarCambios}>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", fontWeight: "bold" }}>Nombre del Producto:</label>
            <input 
              type="text" 
              value={nombre} 
              onChange={(e) => setNombre(e.target.value)} 
              required 
              style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", fontWeight: "bold" }}>Precio de Venta (S/.):</label>
            <input 
              type="number" 
              step="0.01" 
              value={precio} 
              onChange={(e) => setPrecio(e.target.value)} 
              required 
              style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
            <button type="button" className="btn btn-secondary" style={{ background: "#6c757d", color: "white" }} onClick={cerrarModal}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" style={{ background: "#0d6efd" }}>
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductModal;