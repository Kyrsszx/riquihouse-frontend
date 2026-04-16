import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { obtenerVentas, obtenerVentasConDetalle } from "../services/ventaService";
import { obtenerProductos } from "../services/productoService";
import { obtenerInsumos } from "../services/insumoService";
import { obtenerProduccion } from "../services/produccionService";
import "../styles/dashboard.css";
import "../styles/table.css";
import "../styles/modal.css";

function Dashboard() {
  const usuarioGuardado = localStorage.getItem("usuarioLogueado");
  const usuario = usuarioGuardado ? JSON.parse(usuarioGuardado) : null;

  const [totalProductos, setTotalProductos]       = useState(0);
  const [totalInsumos, setTotalInsumos]           = useState(0);
  const [totalProduccion, setTotalProduccion]     = useState(0);
  const [ventas, setVentas]                       = useState([]);
  const [montoHoy, setMontoHoy]                   = useState(0);
  const [ticketsHoy, setTicketsHoy]               = useState(0);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const [cargando, setCargando]                   = useState(true);
  if (usuario && usuario.rol === "vendedor") return <Navigate to="/ventas" />;
  if (usuario && usuario.rol === "cocinero") return <Navigate to="/tablero-cocina" />;

  useEffect(() => {
    if (usuario && usuario.rol === "administrador") cargarTodo();
  }, []);

  const cargarTodo = async () => {
    setCargando(true);
    try {
      const [productos, insumos, produccion, ventasData] = await Promise.all([
        obtenerProductos(),
        obtenerInsumos(),
        obtenerProduccion(),
        obtenerVentasConDetalle().catch(() => obtenerVentas()),
      ]);

      setTotalProductos(productos.length);
      setTotalInsumos(insumos.length);
      setTotalProduccion(produccion.length);

      const ordenadas = [...ventasData].sort(
        (a, b) => new Date(b.fecha_hora) - new Date(a.fecha_hora)
      );
      setVentas(ordenadas);

      const hoy = new Date().toDateString();
      const ventasHoy = ordenadas.filter(
        v => new Date(v.fecha_hora).toDateString() === hoy
      );
      setTicketsHoy(ventasHoy.length);
      setMontoHoy(ventasHoy.reduce((acc, v) => acc + parseFloat(v.total_venta || 0), 0));

    } catch (err) {
      console.error("Error al cargar Dashboard:", err);
    } finally {
      setCargando(false);
    }
  };

  const formatFecha = (str) => {
    if (!str) return "—";
    return new Date(str).toLocaleString("es-PE", {
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  return (
    <div className="animate-in">
      <div className="dashboard-header">
        <div>
          <p className="dashboard-greeting">Bienvenido 👋</p>
          <h1 className="dashboard-title">Panel de <em>Control</em></h1>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={cargarTodo} disabled={cargando}>
          {cargando ? "Cargando..." : "↻ Actualizar"}
        </button>
      </div>
      <div className="stats-grid">

        <div className="stat-card">
          <div className="stat-card-top">
            <span className="stat-label">Ventas hoy</span>
            <div className="stat-icon">💰</div>
          </div>
          <div className="stat-value"><sup>S/</sup>{montoHoy.toFixed(2)}</div>
          <span className="stat-change up">↑ {ticketsHoy} ticket{ticketsHoy !== 1 ? "s" : ""} hoy</span>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <span className="stat-label">Total ventas</span>
            <div className="stat-icon">🧾</div>
          </div>
          <div className="stat-value">{ventas.length}</div>
          <span className="stat-change flat">Tickets registrados</span>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <span className="stat-label">Productos</span>
            <div className="stat-icon">🧁</div>
          </div>
          <div className="stat-value">{totalProductos}</div>
          <span className="stat-change flat">En vitrina</span>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <span className="stat-label">Insumos</span>
            <div className="stat-icon">📦</div>
          </div>
          <div className="stat-value">{totalInsumos}</div>
          <span className="stat-change flat">En almacén</span>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <span className="stat-label">Producción</span>
            <div className="stat-icon">🔥</div>
          </div>
          <div className="stat-value">{totalProduccion}</div>
          <span className="stat-change flat">Lotes horneados</span>
        </div>
      </div>
      <div className="table-container" style={{ marginTop: "var(--space-xl)" }}>

        <div className="table-toolbar">
          <div className="table-toolbar-left">
            <span className="card-title">Ventas Recientes</span>
          </div>
          <div className="table-toolbar-right">
            <span className="section-label">{ventas.length} registros</span>
          </div>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>N° Ticket</th>
              <th>Vendedor</th>
              <th>Fecha y hora</th>
              <th>Ítems</th>
              <th>Total</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {cargando ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "var(--space-xl)", color: "var(--text-muted)" }}>
                  Cargando ventas...
                </td>
              </tr>
            ) : ventas.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <div className="empty-state">
                    <span className="empty-state-icon">🧾</span>
                    <p className="empty-state-title">Sin ventas registradas</p>
                    <p>Aquí aparecerán las ventas cuando el cajero registre una</p>
                  </div>
                </td>
              </tr>
            ) : (
              ventas.slice(0, 20).map((venta) => (
                <tr key={venta.id_venta}>
                  <td>
                    <span className="col-price">
                      #{String(venta.id_venta).padStart(5, "0")}
                    </span>
                  </td>
                  <td className="col-name">
                    {venta.nombre_usuario || venta.vendedor || `Usuario #${venta.id_usuario}`}
                  </td>
                  <td style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>
                    {formatFecha(venta.fecha_hora)}
                  </td>
                  <td>
                    {venta.detalles?.length > 0
                      ? <span className="badge badge-gold">{venta.detalles.length} ítem{venta.detalles.length !== 1 ? "s" : ""}</span>
                      : <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>—</span>
                    }
                  </td>
                  <td className="col-price">
                    S/ {Number(venta.total_venta).toFixed(2)}
                  </td>
                  <td>
                    <div className="col-actions">
                      <button
                        className="action-btn view"
                        title="Ver detalle"
                        onClick={() => setVentaSeleccionada(venta)}
                      >
                        👁️
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {ventaSeleccionada && (
        <div
          className="modal-overlay"
          onClick={(e) => e.target === e.currentTarget && setVentaSeleccionada(null)}
        >
          <div className="modal modal-sm">

            <div className="modal-header">
              <div>
                <h3 className="modal-title">
                  Ticket #{String(ventaSeleccionada.id_venta).padStart(5, "0")}
                </h3>
                <p className="modal-subtitle">Detalle completo de la venta</p>
              </div>
              <button className="modal-close" onClick={() => setVentaSeleccionada(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{ textAlign: "center", paddingBottom: "var(--space-md)", borderBottom: "1px dashed var(--border-default)", marginBottom: "var(--space-md)" }}>
                <div style={{ fontSize: "1.8rem", marginBottom: "4px" }}>🥐</div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", color: "var(--text-primary)", letterSpacing: "0.06em" }}>RiquiHouse</div>
                <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Panadería & Pastelería</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "var(--space-md)" }}>
                {[
                  ["N° Ticket",  `#${String(ventaSeleccionada.id_venta).padStart(5, "0")}`],
                  ["Vendedor",   ventaSeleccionada.nombre_usuario || ventaSeleccionada.vendedor || `Usuario #${ventaSeleccionada.id_usuario}`],
                  ["Fecha/hora", formatFecha(ventaSeleccionada.fecha_hora)],
                ].map(([label, valor]) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem" }}>
                    <span style={{ color: "var(--text-muted)" }}>{label}</span>
                    <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>{valor}</span>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: "1px dashed var(--border-default)", margin: "var(--space-md) 0" }} />
              {ventaSeleccionada.detalles && ventaSeleccionada.detalles.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {ventaSeleccionada.detalles.map((d, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem" }}>
                      <span style={{ color: "var(--gold)", fontWeight: 700, minWidth: "24px" }}>{d.cantidad}×</span>
                      <span style={{ flex: 1, color: "var(--text-primary)" }}>
                        {d.nombre_producto || d.nombre || `Producto #${d.id_producto}`}
                      </span>
                      <span style={{ color: "var(--gold-light)", fontWeight: 600, minWidth: "70px", textAlign: "right" }}>
                        S/ {Number(d.subtotal).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "var(--space-md) 0" }}>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>
                    Sin detalle disponible.
                  </p>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.75rem", marginTop: "4px" }}>
                    El backend debe exponer <code style={{ color: "var(--gold)" }}>GET /api/ventas/detalle</code>
                  </p>
                </div>
              )}
              <div style={{
                borderTop: "1px dashed var(--border-default)",
                paddingTop: "var(--space-md)",
                marginTop: "var(--space-md)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <span style={{ fontFamily: "var(--font-display)", fontSize: "1rem", color: "var(--text-primary)" }}>TOTAL</span>
                <span style={{ fontFamily: "var(--font-display)", fontSize: "1.7rem", color: "var(--gold-light)" }}>
                  S/ {Number(ventaSeleccionada.total_venta).toFixed(2)}
                </span>
              </div>

            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setVentaSeleccionada(null)}>Cerrar</button>
              <button className="btn btn-primary" onClick={() => window.print()}>🖨️ Imprimir</button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default Dashboard;