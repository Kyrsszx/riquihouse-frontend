import { useState, useEffect } from "react";
import { actualizarProducto } from "../services/productoService";

function ProductModal({ producto, cerrarModal, recargarProductos }) {

  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");

  useEffect(() => {
    if (producto) {
      setNombre(producto.nombre);
      setPrecio(producto.precio_venta);
      setStock(producto.stock_actual);
    }
  }, [producto]);

  const guardarEdicion = async (e) => {
    e.preventDefault();

    const productoActualizado = {
      nombre,
      precio_venta: parseFloat(precio),
      stock_actual: parseInt(stock)
    };

    await actualizarProducto(producto.id_producto, productoActualizado);

    recargarProductos();
    cerrarModal();
  };

  if (!producto) return null;

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>

        <h2>Editar Producto</h2>

        <form onSubmit={guardarEdicion}>

          <div>
            <label>Nombre</label>
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>

          <div>
            <label>Precio</label>
            <input
              type="number"
              step="0.01"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
            />
          </div>

          <div>
            <label>Stock</label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
          </div>

          <br />

          <button type="submit">
            Guardar
          </button>

          <button type="button" onClick={cerrarModal}>
            Cancelar
          </button>

        </form>

      </div>
    </div>
  );
}

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
};

const modalStyle = {
  background: "white",
  padding: "25px",
  borderRadius: "10px",
  minWidth: "300px"
};

export default ProductModal;