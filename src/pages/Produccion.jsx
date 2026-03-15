import { useEffect, useState } from "react";
import { obtenerProduccion, registrarProduccion } from "../services/produccionService";
import { obtenerProductos } from "../services/productoService";

function Produccion() {
  const [historial, setHistorial] = useState([]);
  const [productos, setProductos] = useState([]);
  
  const [idProducto, setIdProducto] = useState("");
  const [cantidadProducida, setCantidadProducida] = useState("");

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    const dataHistorial = await obtenerProduccion();
    const dataProductos = await obtenerProductos();
    
    setHistorial(dataHistorial);
    setProductos(dataProductos);
    
    if(dataProductos.length > 0) setIdProducto(dataProductos[0].id_producto);
  };

  const hornearProducto = async (e) => {
    e.preventDefault();
    try {
      await registrarProduccion({
        id_usuario: 1, // Nuestro cocinero Carlos
        id_producto: idProducto,
        cantidad_producida: cantidadProducida
      });
      alert("¡Producción registrada! Stock de vitrina actualizado e insumos descontados. 🎂");
      setCantidadProducida("");
      cargarDatos();
    } catch (error) {
      alert("Error al registrar producción");
    }
  };

  return (
    <div>
      <h1 className="page-title">Módulo de Producción (Cocina)</h1>

      <form onSubmit={hornearProducto} style={{ background: "#e3f2fd", padding: "20px", marginBottom: "20px" }}>
        <h3>Hornear Nuevo Lote</h3>
        
        <label>¿Qué horneaste?: </label>
        <select value={idProducto} onChange={(e) => setIdProducto(e.target.value)} style={{ marginRight: "10px" }}>
          {productos.map(p => <option key={p.id_producto} value={p.id_producto}>{p.nombre}</option>)}
        </select>

        <label>Cantidad Producida: </label>
        <input type="number" value={cantidadProducida} onChange={(e) => setCantidadProducida(e.target.value)} required style={{ width: "80px", marginRight: "10px" }} />

        <button type="submit" className="btn btn-primary" style={{ background: "#1976d2" }}>🍳 Registrar Horneado</button>
      </form>

      <h3>Historial de Producción</h3>
      <table border="1" width="100%" style={{ textAlign: "left" }}>
        <thead>
          <tr>
            <th>Cocinero</th>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {historial.length === 0 ? (
            <tr><td colSpan="4">No hay producciones registradas</td></tr>
          ) : (
            historial.map((h) => (
              <tr key={h.id_produccion}>
                <td>{h.cocinero}</td>
                <td>{h.producto}</td>
                <td>{h.cantidad_producida}</td>
                <td>{new Date(h.fecha_hora).toLocaleString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Produccion;