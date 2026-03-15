import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import AdminLayout from "../layouts/AdminLayout";
import Dashboard from "../pages/Dashboard";
import Productos from "../pages/Productos";
import PuntoDeVenta from "../pages/PuntoDeVenta";
import Insumos from "../pages/Insumos";
import Recetas from "../pages/Recetas";
import Produccion from "../pages/Produccion";
import Login from "../pages/Login";
import TableroCocina from "../pages/TableroCocina";
import Mermas from "../pages/Mermas";

function AppRouter() {
  const [estaLogueado, setEstaLogueado] = useState(false);

  useEffect(() => {
    // Al cargar la app, revisamos si ya hay alguien guardado en memoria
    const usuario = localStorage.getItem("usuarioLogueado");
    if (usuario) {
      setEstaLogueado(true);
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta Pública: Cualquier persona puede ver el Login */}
        <Route 
          path="/login" 
          element={<Login onLogin={() => setEstaLogueado(true)} />} 
        />

        {/* Rutas Privadas: El "Guardia de Seguridad" */}
        <Route 
          element={estaLogueado ? <AdminLayout /> : <Navigate to="/login" />}
        >
          {/* Todas las pantallas del sistema */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/ventas" element={<PuntoDeVenta />} />
          <Route path="/insumos" element={<Insumos />} />
          <Route path="/recetas" element={<Recetas />} />
          <Route path="/produccion" element={<Produccion />} />
          <Route path="/tablero-cocina" element={<TableroCocina />} />
          <Route path="/mermas" element={<Mermas />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;