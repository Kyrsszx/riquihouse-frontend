import { Link } from "react-router-dom";

function Sidebar() {
  const usuarioGuardado = localStorage.getItem("usuarioLogueado");
  const usuario = usuarioGuardado ? JSON.parse(usuarioGuardado) : null;

  if (!usuario) return null;

  // Aseguramos que el rol siempre se compare en minúsculas
  const rol = usuario.rol.toLowerCase();

  const cerrarSesion = () => {
    localStorage.removeItem("usuarioLogueado");
    window.location.href = "/login"; 
  };

  return (
    <div className="sidebar" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      
      {/* PERFIL DEL USUARIO */}
      <div style={{ padding: "20px", textAlign: "center", borderBottom: "1px solid #444", marginBottom: "20px" }}>
        <h2 style={{ margin: "0 0 10px 0", color: "white" }}>RiquiHouse</h2>
        <p style={{ margin: 0, color: "#ccc", fontSize: "14px" }}>👤 Hola, {usuario.nombre}</p>
        <span style={{ fontSize: "11px", background: "#0d6efd", color: "white", padding: "3px 8px", borderRadius: "12px", textTransform: "uppercase", display: "inline-block", marginTop: "5px" }}>
          {usuario.rol}
        </span>
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        
        {/* VISTAS DEL ADMINISTRADOR (Limpio) */}
        {rol === 'administrador' && (
          <div style={{ marginBottom: "20px" }}>
            <p style={{ color: "#888", fontSize: "12px", textTransform: "uppercase", marginLeft: "15px", marginBottom: "5px", fontWeight: "bold" }}>👨‍💼 Panel Admin</p>
            <ul>
              <li><Link to="/">Dashboard</Link></li>
              <li><Link to="/productos">Vitrina (Productos)</Link></li>
              <li><Link to="/insumos">Almacén (Insumos)</Link></li>
              <li><Link to="/recetas">Libro de Recetas</Link></li>
            </ul>
          </div>
        )}

        {/* VISTAS DEL VENDEDOR */}
        {rol === 'vendedor' && (
          <div style={{ marginBottom: "20px" }}>
            <p style={{ color: "#888", fontSize: "12px", textTransform: "uppercase", marginLeft: "15px", marginBottom: "5px", fontWeight: "bold" }}>🛒 Área de Ventas</p>
            <ul>
              <li><Link to="/ventas">Punto de Venta</Link></li>
            </ul>
          </div>
        )}

        {/* VISTAS DEL COCINERO (Con Mermas) */}
        {rol === 'cocinero' && (
          <div style={{ marginBottom: "20px" }}>
            <p style={{ color: "#888", fontSize: "12px", textTransform: "uppercase", marginLeft: "15px", marginBottom: "5px", fontWeight: "bold" }}>🍳 Cocina</p>
            <ul>
              <li><Link to="/tablero-cocina">Tablero de Pedidos</Link></li>
              <li><Link to="/produccion">Registrar Horneado</Link></li>
              <li><Link to="/mermas" style={{ color: "#ff6b6b" }}>⚠️ Reportar Mermas</Link></li>
            </ul>
          </div>
        )}

      </div>

      {/* BOTÓN DE SALIDA */}
      <div style={{ padding: "20px", borderTop: "1px solid #444" }}>
        <button onClick={cerrarSesion} style={{ width: "100%", padding: "10px", background: "#dc3545", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>
          🚪 Cerrar Sesión
        </button>
      </div>

    </div>
  );
}

export default Sidebar;