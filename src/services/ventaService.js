const API_URL = "https://riquihouse-backend.onrender.com/api/ventas";

export const obtenerVentas = async () => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Error al obtener ventas");
  return await res.json();
};
export const obtenerVentasConDetalle = async () => {
  const res = await fetch(`${API_URL}/detalle`);
  if (!res.ok) throw new Error("Error al obtener detalle de ventas");
  return await res.json();
};
export const crearVenta = async (venta) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(venta),
  });
  if (!res.ok) throw new Error("Error al registrar la venta");
  return await res.json();
};