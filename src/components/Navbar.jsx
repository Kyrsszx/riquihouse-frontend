import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { obtenerInsumos } from "../services/insumoService";
import { obtenerProductos } from "../services/productoService";
import "../styles/layout.css";

const STOCK_MIN_INSUMO   = 20;
const STOCK_MIN_PRODUCTO = 5;

const titulos = {
  "/":               "Dashboard",
  "/productos":      "Vitrina · Productos",
  "/insumos":        "Almacén · Insumos",
  "/recetas":        "Libro de Recetas",
  "/ventas":         "Punto de Venta",
  "/tablero-cocina": "Tablero de Cocina",
  "/produccion":     "Registrar Horneado",
  "/mermas":         "Reportar Mermas",
};

function Navbar() {
  const location    = useLocation();
  const navigate    = useNavigate();
  const paginaActual = titulos[location.pathname] || "Panel";

  const [alertasInsumos,   setAlertasInsumos]   = useState([]);
  const [alertasProductos, setAlertasProductos] = useState([]);
  const [mostrarPanel, setMostrarPanel]         = useState(false);
  const panelRef = useRef(null);

  const totalAlertas = alertasInsumos.length + alertasProductos.length;

  useEffect(() => {
    verificarStock();
    const intervalo = setInterval(verificarStock, 60000);
    return () => clearInterval(intervalo);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target))
        setMostrarPanel(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const verificarStock = async () => {
    try {
      const [insumos, productos] = await Promise.all([
        obtenerInsumos(),
        obtenerProductos(),
      ]);
      setAlertasInsumos(insumos.filter(i => parseFloat(i.stock_actual) < STOCK_MIN_INSUMO));
      setAlertasProductos(productos.filter(p => parseInt(p.stock_actual) < STOCK_MIN_PRODUCTO));
    } catch {
    }
  };

  return (
    <header className="navbar">

      <div className="navbar-left">
        <nav className="navbar-breadcrumb">
          <span>RiquiHouse</span>
          <span className="separator">/</span>
          <span className="current">{paginaActual}</span>
        </nav>
      </div>

      <div className="navbar-right">
        <div style={{ position: "relative" }} ref={panelRef}>
          <button
            className="navbar-notif"
            title={totalAlertas > 0 ? `${totalAlertas} alerta(s) de stock` : "Sin alertas"}
            onClick={() => setMostrarPanel(!mostrarPanel)}
            style={totalAlertas > 0 ? { borderColor: "rgba(192,57,43,0.4)", color: "var(--danger)" } : {}}
          >
            🔔
            {totalAlertas > 0 && (
              <span style={{
                position: "absolute",
                top: "-6px", right: "-6px",
                background: "var(--danger)",
                color: "white",
                fontSize: "0.6rem",
                fontWeight: 700,
                minWidth: "16px", height: "16px",
                borderRadius: "999px",
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: "0 4px",
                border: "2px solid var(--bg-base)",
              }}>
                {totalAlertas}
              </span>
            )}
          </button>

          {mostrarPanel && (
            <div style={{
              position: "absolute",
              top: "calc(100% + 10px)", right: 0,
              width: "310px",
              background: "var(--bg-card)",
              border: "1px solid var(--border-default)",
              borderRadius: "var(--radius-lg)",
              boxShadow: "var(--shadow-lg)",
              zIndex: 500,
              overflow: "hidden",
              animation: "fadeIn 0.2s ease both",
            }}>

              <div style={{
                padding: "var(--space-md) var(--space-lg)",
                borderBottom: "1px solid var(--border-subtle)",
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}>
                <span style={{ fontFamily: "var(--font-display)", fontSize: "0.95rem", fontWeight: 600, color: "var(--text-primary)" }}>
                  Alertas de Stock
                </span>
                {totalAlertas > 0
                  ? <span className="badge badge-danger">{totalAlertas} alerta{totalAlertas > 1 ? "s" : ""}</span>
                  : <span className="badge badge-success">Todo en orden</span>
                }
              </div>

              <div style={{ maxHeight: "320px", overflowY: "auto" }}>
                {totalAlertas === 0 ? (
                  <div style={{ padding: "var(--space-xl)", textAlign: "center" }}>
                    <div style={{ fontSize: "1.5rem", marginBottom: "6px" }}>✅</div>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>
                      Todos los stocks están en niveles óptimos
                    </p>
                  </div>
                ) : (
                  <>
                    {alertasProductos.length > 0 && (
                      <>
                        <div style={{
                          padding: "6px var(--space-lg)",
                          background: "var(--bg-elevated)",
                          fontSize: "0.68rem", fontWeight: 700,
                          letterSpacing: "0.1em", textTransform: "uppercase",
                          color: "var(--text-muted)",
                          borderBottom: "1px solid var(--border-subtle)",
                        }}>
                          🧁 Productos (mín. {STOCK_MIN_PRODUCTO} unid.)
                        </div>
                        {alertasProductos.map(p => (
                          <AlertaFila
                            key={`p-${p.id_producto}`}
                            nombre={p.nombre}
                            stock={p.stock_actual}
                            onClick={() => { navigate("/productos"); setMostrarPanel(false); }}
                          />
                        ))}
                      </>
                    )}

                    {alertasInsumos.length > 0 && (
                      <>
                        <div style={{
                          padding: "6px var(--space-lg)",
                          background: "var(--bg-elevated)",
                          fontSize: "0.68rem", fontWeight: 700,
                          letterSpacing: "0.1em", textTransform: "uppercase",
                          color: "var(--text-muted)",
                          borderBottom: "1px solid var(--border-subtle)",
                        }}>
                          📦 Insumos (mín. {STOCK_MIN_INSUMO} unid.)
                        </div>
                        {alertasInsumos.map(i => (
                          <AlertaFila
                            key={`i-${i.id_insumo}`}
                            nombre={i.nombre}
                            stock={parseFloat(i.stock_actual).toFixed(2)}
                            onClick={() => { navigate("/insumos"); setMostrarPanel(false); }}
                          />
                        ))}
                      </>
                    )}
                  </>
                )}
              </div>

              {totalAlertas > 0 && (
                <div style={{
                  padding: "var(--space-sm) var(--space-lg)",
                  borderTop: "1px solid var(--border-subtle)",
                  display: "flex", gap: "var(--space-sm)", justifyContent: "center",
                }}>
                  {alertasProductos.length > 0 && (
                    <button className="btn btn-ghost btn-sm" onClick={() => { navigate("/productos"); setMostrarPanel(false); }}>
                      Ver Productos →
                    </button>
                  )}
                  {alertasInsumos.length > 0 && (
                    <button className="btn btn-ghost btn-sm" onClick={() => { navigate("/insumos"); setMostrarPanel(false); }}>
                      Ver Insumos →
                    </button>
                  )}
                </div>
              )}

            </div>
          )}
        </div>

        <div className="navbar-user">
          <div className="navbar-avatar">R</div>
          <span>Panel Administrativo</span>
        </div>
      </div>

    </header>
  );
}

function AlertaFila({ nombre, stock, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "var(--space-sm) var(--space-lg)",
        borderBottom: "1px solid var(--border-subtle)",
        cursor: "pointer",
        background: hover ? "var(--bg-hover)" : "transparent",
        transition: "background 0.15s",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
        <span style={{ fontSize: "0.85rem" }}>⚠️</span>
        <span style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--text-primary)" }}>{nombre}</span>
      </div>
      <span style={{
        fontSize: "0.78rem", fontWeight: 700, color: "var(--danger)",
        background: "var(--danger-bg)", padding: "2px 8px",
        borderRadius: "var(--radius-pill)",
      }}>
        {stock} unid.
      </span>
    </div>
  );
}

export default Navbar;