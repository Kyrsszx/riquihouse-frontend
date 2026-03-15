import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { obtenerProductos } from "../services/productoService";
import { obtenerInsumos } from "../services/insumoService";
import { obtenerVentas } from "../services/ventaService";
import { obtenerProduccion } from "../services/produccionService";
import "../styles/dashboard.css";

function Dashboard() {

  const usuarioGuardado = localStorage.getItem("usuarioLogueado");
  const usuario = usuarioGuardado ? JSON.parse(usuarioGuardado) : null;
  const [totalProductos, setTotalProductos] = useState(0);
  const [totalInsumos, setTotalInsumos] = useState(0);
  const [totalVentas, setTotalVentas] = useState(0);
  const [totalProduccion, setTotalProduccion] = useState(0);

  useEffect(() => {

    if (usuario && usuario.rol === 'administrador') {
      cargarDatos();
    }
  }, [usuario]);


  if (usuario && usuario.rol === 'vendedor') return <Navigate to="/ventas" />;
  if (usuario && usuario.rol === 'cocinero') return <Navigate to="/tablero-cocina" />;

  const cargarDatos = async () => {
    try {
      const productos = await obtenerProductos();
      setTotalProductos(productos.length);
      const insumos = await obtenerInsumos();
      setTotalInsumos(insumos.length);
      const ventas = await obtenerVentas();
      setTotalVentas(ventas.length);
      const produccion = await obtenerProduccion();
      setTotalProduccion(produccion.length);
    } catch (error) {
      console.error("Error al cargar los datos del Dashboard:", error);
    }
  };

  return (
    <div>
      <h1 className="page-title">Dashboard (Resumen)</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Productos</h3>
          <p>{totalProductos}</p>
          <span>En vitrina</span>
        </div>

        <div className="stat-card">
          <h3>Insumos</h3>
          <p>{totalInsumos}</p>
          <span>En el almacén</span>
        </div>

        <div className="stat-card">
          <h3>Ventas Totales</h3>
          <p>{totalVentas}</p>
          <span>Tickets generados</span>
        </div>

        <div className="stat-card">
          <h3>Producción</h3>
          <p>{totalProduccion}</p>
          <span>Lotes horneados</span>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;