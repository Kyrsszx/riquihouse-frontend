import { useEffect, useState } from "react";
import { crearVenta } from "../services/ventaService";
import { obtenerProductos } from "../services/productoService";
import "../styles/globals.css";
import "../styles/productos.css";
import "../styles/modal.css";
import "../styles/table.css";

function PuntoDeVenta() {
  const [productos, setProductos]                   = useState([]);
  const [carrito, setCarrito]                       = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState("");
  const [cantidad, setCantidad]                     = useState(1);
  const [procesando, setProcesando]                 = useState(false);
  const [ticket, setTicket]                         = useState(null); // null = sin ticket, objeto = mostrar ticket

  // Usuario logueado
  const usuarioGuardado = localStorage.getItem("usuarioLogueado");
  const usuario = usuarioGuardado ? JSON.parse(usuarioGuardado) : null;

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      const data = await obtenerProductos();
      setProductos(data);
      if (data.length > 0) setProductoSeleccionado(data[0].id_producto);
    } catch {
      console.error("Error al cargar productos");
    }
  };

  const agregarAlCarrito = () => {
    const prod = productos.find(p => p.id_producto === parseInt(productoSeleccionado));
    if (!prod) return;

    if (cantidad < 1) return;

    // Si el producto ya está en el carrito, sumamos cantidad
    const existe = carrito.find(i => i.id_producto === prod.id_producto);
    const cantidadTotal = existe ? existe.cantidad + parseInt(cantidad) : parseInt(cantidad);

    if (cantidadTotal > prod.stock_actual) {
      alert(`Solo hay ${prod.stock_actual} unidades en stock.`);
      return;
    }

    if (existe) {
      setCarrito(carrito.map(i =>
        i.id_producto === prod.id_producto
          ? { ...i, cantidad: cantidadTotal, subtotal: prod.precio_venta * cantidadTotal }
          : i
      ));
    } else {
      setCarrito([...carrito, {
        id_producto: prod.id_producto,
        nombre:      prod.nombre,
        precio:      prod.precio_venta,
        cantidad:    parseInt(cantidad),
        subtotal:    prod.precio_venta * parseInt(cantidad),
      }]);
    }
    setCantidad(1);
  };

  const quitarDelCarrito = (id_producto) => {
    setCarrito(carrito.filter(i => i.id_producto !== id_producto));
  };

  const cambiarCantidad = (id_producto, nuevaCantidad) => {
    if (nuevaCantidad < 1) return;
    const prod = productos.find(p => p.id_producto === id_producto);
    if (prod && nuevaCantidad > prod.stock_actual) return;
    setCarrito(carrito.map(i =>
      i.id_producto === id_producto
        ? { ...i, cantidad: nuevaCantidad, subtotal: i.precio * nuevaCantidad }
        : i
    ));
  };

  const calcularTotal = () =>
    carrito.reduce((acc, item) => acc + item.subtotal, 0);

  const procesarVenta = async () => {
    if (carrito.length === 0) return;
    setProcesando(true);

    const nuevaVenta = {
      id_usuario:  usuario?.id_usuario || 1,
      total_venta: calcularTotal(),
      detalles: carrito.map(item => ({
        id_producto: item.id_producto,
        cantidad:    item.cantidad,
        subtotal:    item.subtotal,
      })),
    };

    try {
      const respuesta = await crearVenta(nuevaVenta);

      // Construimos el objeto ticket con toda la info
      setTicket({
        id_venta:    respuesta.id_venta || respuesta.id || "—",
        vendedor:    usuario?.nombre || "Vendedor",
        fecha:       new Date().toLocaleString("es-PE", {
                       dateStyle: "long",
                       timeStyle: "short",
                     }),
        items:       [...carrito],
        total:       calcularTotal(),
      });

      setCarrito([]);
      cargarProductos();
    } catch (error) {
      console.error(error);
      alert("Error al registrar la venta. Intenta de nuevo.");
    } finally {
      setProcesando(false);
    }
  };

  const cerrarTicket = () => setTicket(null);

  return (
    <div className="animate-in">

      {/* ── Cabecera ── */}
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Punto de <span>Venta</span></h1>
          <p className="section-label">Vendedor: {usuario?.nombre}</p>
        </div>
      </div>

      <div className="pos-layout">

        {/* ── Panel izquierdo: selector + carrito ── */}
        <div className="pos-products-panel">

          {/* Selector de producto */}
          <div className="card" style={{ marginBottom: "var(--space-lg)" }}>
            <div className="card-header">
              <span className="card-title">Agregar Producto</span>
            </div>
            <div className="card-body" style={{ display: "flex", gap: "var(--space-md)", flexWrap: "wrap", alignItems: "flex-end" }}>

              <div className="form-group" style={{ flex: 1, minWidth: "200px", marginBottom: 0 }}>
                <label className="form-label">Producto</label>
                <select
                  value={productoSeleccionado}
                  onChange={(e) => setProductoSeleccionado(e.target.value)}
                >
                  {productos.map(prod => (
                    <option key={prod.id_producto} value={prod.id_producto}>
                      {prod.nombre} — S/ {Number(prod.precio_venta).toFixed(2)} (Stock: {prod.stock_actual})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ width: "90px", marginBottom: 0 }}>
                <label className="form-label">Cantidad</label>
                <input
                  type="number"
                  min="1"
                  value={cantidad}
                  onChange={(e) => setCantidad(parseInt(e.target.value) || 1)}
                />
              </div>

              <button className="btn btn-primary" onClick={agregarAlCarrito}>
                + Agregar
              </button>

            </div>
          </div>

          {/* Carrito */}
          <div className="table-container">
            <div className="table-toolbar">
              <div className="table-toolbar-left">
                <span className="card-title">Carrito</span>
              </div>
              {carrito.length > 0 && (
                <div className="table-toolbar-right">
                  <button className="btn btn-ghost btn-sm" onClick={() => setCarrito([])}>
                    Vaciar carrito
                  </button>
                </div>
              )}
            </div>

            <table className="data-table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Precio unit.</th>
                  <th>Cantidad</th>
                  <th>Subtotal</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {carrito.length === 0 ? (
                  <tr>
                    <td colSpan={5}>
                      <div className="empty-state" style={{ padding: "var(--space-xl)" }}>
                        <span className="empty-state-icon">🛒</span>
                        <p className="empty-state-title">Carrito vacío</p>
                        <p>Agrega productos para comenzar la venta</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  carrito.map((item) => (
                    <tr key={item.id_producto}>
                      <td className="col-name">{item.nombre}</td>
                      <td>S/ {Number(item.precio).toFixed(2)}</td>
                      <td>
                        <div className="pos-qty-control">
                          <button className="pos-qty-btn" onClick={() => cambiarCantidad(item.id_producto, item.cantidad - 1)}>−</button>
                          <span className="pos-qty-value">{item.cantidad}</span>
                          <button className="pos-qty-btn" onClick={() => cambiarCantidad(item.id_producto, item.cantidad + 1)}>+</button>
                        </div>
                      </td>
                      <td className="col-price">S/ {Number(item.subtotal).toFixed(2)}</td>
                      <td>
                        <div className="col-actions">
                          <button className="action-btn delete" onClick={() => quitarDelCarrito(item.id_producto)}>✕</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Panel derecho: resumen + cobrar ── */}
        <div className="pos-cart-panel">
          <div className="pos-cart-header">
            <span className="pos-cart-title">Resumen de Venta</span>
          </div>

          <div className="pos-cart-items">
            {carrito.length === 0 ? (
              <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", textAlign: "center", marginTop: "var(--space-xl)" }}>
                Sin productos aún
              </p>
            ) : (
              carrito.map(item => (
                <div key={item.id_producto} className="pos-cart-item">
                  <span className="pos-cart-item-name">{item.nombre}</span>
                  <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>×{item.cantidad}</span>
                  <span className="pos-item-price">S/ {Number(item.subtotal).toFixed(2)}</span>
                </div>
              ))
            )}
          </div>

          <div className="pos-cart-footer">
            <div className="pos-total-row">
              <span className="pos-total-label">Productos</span>
              <span className="pos-total-value">{carrito.reduce((a, i) => a + i.cantidad, 0)} unid.</span>
            </div>
            <div className="pos-grand-total">
              <span className="pos-grand-label">Total</span>
              <span className="pos-grand-value">S/ {calcularTotal().toFixed(2)}</span>
            </div>
            <button
              className="btn btn-primary"
              style={{ width: "100%", padding: "13px", fontSize: "1rem", marginTop: "var(--space-sm)" }}
              onClick={procesarVenta}
              disabled={carrito.length === 0 || procesando}
            >
              {procesando ? "Procesando..." : "💰 Cobrar Venta"}
            </button>
          </div>
        </div>

      </div>

      {/* ── Modal Ticket ── */}
      {ticket && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && cerrarTicket()}>
          <div className="modal modal-sm">

            <div className="modal-header">
              <div>
                <h3 className="modal-title">Ticket Generado ✓</h3>
                <p className="modal-subtitle">Venta registrada exitosamente</p>
              </div>
              <button className="modal-close" onClick={cerrarTicket}>✕</button>
            </div>

            <div className="modal-body">
              {/* Cabecera del ticket */}
              <div style={{
                textAlign: "center",
                padding: "var(--space-lg) 0 var(--space-md)",
                borderBottom: "1px dashed var(--border-default)",
                marginBottom: "var(--space-md)"
              }}>
                <div style={{ fontSize: "2rem", marginBottom: "6px" }}>🍰</div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", color: "var(--text-primary)", letterSpacing: "0.06em" }}>
                  RiquiHouse
                </div>
                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  Panadería & Pastelería
                </div>
              </div>

              {/* Datos del ticket */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "var(--space-md)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem" }}>
                  <span style={{ color: "var(--text-muted)" }}>N° Ticket</span>
                  <span style={{ color: "var(--gold-light)", fontWeight: 600 }}>#{String(ticket.id_venta).padStart(5, "0")}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem" }}>
                  <span style={{ color: "var(--text-muted)" }}>Vendedor</span>
                  <span style={{ color: "var(--text-primary)" }}>{ticket.vendedor}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem" }}>
                  <span style={{ color: "var(--text-muted)" }}>Fecha y hora</span>
                  <span style={{ color: "var(--text-primary)" }}>{ticket.fecha}</span>
                </div>
              </div>

              {/* Línea punteada */}
              <div style={{ borderTop: "1px dashed var(--border-default)", margin: "var(--space-md) 0" }} />

              {/* Detalle de productos */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "var(--space-md)" }}>
                {ticket.items.map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem" }}>
                    <span style={{ color: "var(--gold)", fontWeight: 700, minWidth: "20px" }}>{item.cantidad}×</span>
                    <span style={{ flex: 1, color: "var(--text-primary)" }}>{item.nombre}</span>
                    <span style={{ color: "var(--text-secondary)", fontSize: "0.78rem" }}>
                      S/ {Number(item.precio).toFixed(2)} c/u
                    </span>
                    <span style={{ color: "var(--gold-light)", fontWeight: 600, minWidth: "60px", textAlign: "right" }}>
                      S/ {Number(item.subtotal).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div style={{
                borderTop: "1px dashed var(--border-default)",
                paddingTop: "var(--space-md)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <span style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", color: "var(--text-primary)" }}>
                  TOTAL
                </span>
                <span style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", color: "var(--gold-light)", letterSpacing: "-0.01em" }}>
                  S/ {Number(ticket.total).toFixed(2)}
                </span>
              </div>

              {/* Gracias */}
              <div style={{
                textAlign: "center",
                marginTop: "var(--space-lg)",
                paddingTop: "var(--space-md)",
                borderTop: "1px dashed var(--border-default)",
                color: "var(--text-muted)",
                fontSize: "0.78rem",
                letterSpacing: "0.05em"
              }}>
                ¡Gracias por su preferencia!
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={cerrarTicket}>
                Cerrar
              </button>
              <button className="btn btn-primary" onClick={() => { window.print(); }}>
                🖨️ Imprimir
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default PuntoDeVenta;