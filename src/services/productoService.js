const API_URL = "http://localhost:3000/api/productos";

export const obtenerProductos = async () => {
  const res = await fetch(API_URL);
  return await res.json();
};

export const crearProducto = async (producto) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(producto)
  });

  return await res.json();
};

export const eliminarProducto = async (id) => {
  await fetch(`${API_URL}/${id}`, {
    method: "DELETE"
  });
};

export const actualizarProducto = async (id, producto) => {
  await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(producto)
  });
};