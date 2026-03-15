import { useEffect, useState } from "react";
import { obtenerProductos } from "../services/productoService";

function TableroCocina() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const cargarDatos = async () => {
      const data = await obtenerProductos();
      // Ordenamos automáticamente de menor stock a mayor stock
      const dataOrdenada = data.sort((a, b) => a.stock_actual - b.stock_actual);
      setProductos(dataOrdenada);
    };
    cargarDatos();
  }, []);

  return (
    <div>
      <h1 className="page-title">Tablero de Cocina 👨‍🍳</h1>
      <p style={{ color: "#666", marginBottom: "20px" }}>Revisa qué productos se están agotando en la vitrina para hornear más.</p>

      <div style={{ display: "grid", gap: "15px", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))" }}>
        {productos.map((prod) => {
          // Si el stock es menor a 10, lo pintamos de rojo como alerta
          const esUrgente = prod.stock_actual < 10;
          
          return (
            <div key={prod.id_producto} style={{ background: esUrgente ? "#ffebee" : "white", border: `2px solid ${esUrgente ? "red" : "#ddd"}`, padding: "20px", borderRadius: "8px", textAlign: "center", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
              <h3 style={{ margin: "0 0 10px 0" }}>{prod.nombre}</h3>
              <p style={{ margin: 0, fontSize: "14px", color: "#555" }}>Stock en Vitrina:</p>
              <h1 style={{ margin: "5px 0 0 0", color: esUrgente ? "red" : "green", fontSize: "40px" }}>
                {prod.stock_actual}
              </h1>
              {esUrgente && <p style={{ color: "red", fontWeight: "bold", margin: "10px 0 0 0" }}>⚠️ ¡Hornear Urgente!</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TableroCocina;