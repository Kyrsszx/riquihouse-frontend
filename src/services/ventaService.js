const API_URL = "http://localhost:3000/api/ventas";

export const obtenerVentas = async () => {
  const res = await fetch(API_URL);
  return await res.json();
};

export const crearVenta = async (venta) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(venta)
  });

  return await res.json();
};