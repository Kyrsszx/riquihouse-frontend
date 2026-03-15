const API_URL = "http://localhost:3000/api/ventas";

// Trae todas las ventas (cabecera) — para el contador del Dashboard
export const obtenerVentas = async () => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Error al obtener ventas");
  return await res.json();
};

// Trae ventas con JOIN a ventas_detalle + productos + usuarios
// Tu backend necesita exponer GET /api/ventas/detalle
export const obtenerVentasConDetalle = async () => {
  const res = await fetch(`${API_URL}/detalle`);
  if (!res.ok) throw new Error("Error al obtener detalle de ventas");
  return await res.json();
};

// Crea una venta con su detalle
export const crearVenta = async (venta) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(venta),
  });
  if (!res.ok) throw new Error("Error al registrar la venta");
  return await res.json();
};