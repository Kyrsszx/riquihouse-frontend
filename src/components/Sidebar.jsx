import { Link, useLocation } from "react-router-dom";
import "../styles/layout.css";

function Sidebar() {
  const usuarioGuardado = localStorage.getItem("usuarioLogueado");
  const usuario = usuarioGuardado ? JSON.parse(usuarioGuardado) : null;
  const location = useLocation();

  if (!usuario) return null;

  const rol = usuario.rol.toLowerCase();

  const cerrarSesion = () => {
    localStorage.removeItem("usuarioLogueado");    
    window.location.href = "/login";
  };
  
  const isActive = (path) => location.pathname = path;

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">🍰</div>
        <div className="sidebar-brand-text">
          <span className="sidebar-brand-name">RiquiHouse</span>
          <span className="sidebar-brand-tagline">Pasteleria Artesanal</span>
        </div>
      </div>
      <div style={{ padding: "16px 12px 8px", borderBottom: "1px solid var(--border-subtle)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 12px", background: "var(--bg-elevated)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)" }}>
          <div className="navbar-avatar">
            {usuario.nombre?.charAt(0).toUpperCase()}
          </div>
          <div style={{ overflow: "hidden" }}>
            <div style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {usuario.nombre}
            </div>
            <div style={{ marginTop: "2px" }}>
              <span className="badge badge-gold">{usuario.rol}</span>
            </div>
          </div>
        </div>
      </div>
      <nav className="sidebar-nav">
        {rol === "administrador" && (
          <>
            <span className="sidebar-section-label">Panel Admin</span>
            <Link to="/" className={`sidebar-link ${isActive("/") ? "active" : ""}`}>
              <span className="sidebar-link-icon">📊</span>
              <span className="sidebar-link-text">Dashboard</span>
            </Link>
            <Link to="/productos" className={`sidebar-link ${isActive("/productos") ? "active" : ""}`}>
              <span className="sidebar-link-icon">🧁</span>
              <span className="sidebar-link-text">Vitrina (Productos)</span>
            </Link>
            <Link to="/insumos" className={`sidebar-link ${isActive("/insumos") ? "active" : ""}`}>
              <span className="sidebar-link-icon">📦</span>
              <span className="sidebar-link-text">Almacén (Insumos)</span>
            </Link>
            <Link to="/recetas" className={`sidebar-link ${isActive("/recetas") ? "active" : ""}`}>
              <span className="sidebar-link-icon">📖</span>
              <span className="sidebar-link-text">Libro de Recetas</span>
            </Link>
          </>
        )}
        {rol === "vendedor" && (
          <>
            <span className="sidebar-section-label">Área de Ventas</span>
            <Link to="/ventas" className={`sidebar-link ${isActive("/ventas") ? "active" : ""}`}>
              <span className="sidebar-link-icon">🛒</span>
              <span className="sidebar-link-text">Punto de Venta</span>
            </Link>
          </>
        )}
        {rol === "cocinero" && (
          <>
            <span className="sidebar-section-label">Cocina</span>
            <Link to="/tablero-cocina" className={`sidebar-link ${isActive("/tablero-cocina") ? "active" : ""}`}>
              <span className="sidebar-link-icon">🍳</span>
              <span className="sidebar-link-text">Tablero de Pedidos</span>
            </Link>
            <Link to="/produccion" className={`sidebar-link ${isActive("/produccion") ? "active" : ""}`}>
              <span className="sidebar-link-icon">🔥</span>
              <span className="sidebar-link-text">Registrar Horneado</span>
            </Link>
            <Link to="/mermas" className={`sidebar-link ${isActive("/mermas") ? "active" : ""}`}>
              <span className="sidebar-link-icon">⚠️</span>
              <span className="sidebar-link-text" style={{ color: "var(--danger)" }}>Reportar Mermas</span>
            </Link>
          </>
        )}

      </nav>
      <div className="sidebar-footer">
        <button className="sidebar-logout" onClick={cerrarSesion}>
          <span></span>
          <span>Cerrar Sesión</span>
        </button>
      </div>

    </aside>
  );
}

export default Sidebar;
