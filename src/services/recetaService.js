const API_URL = "http://localhost:3000/api/recetas";

export const obtenerRecetas = async () => {
  const res = await fetch(API_URL);
  return await res.json();
};

export const crearReceta = async (receta) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(receta)
  });
  return await res.json();
};

// <-- AGREGA ESTA NUEVA FUNCIÓN -->
export const eliminarReceta = async (id) => {
  await fetch(`${API_URL}/${id}`, {
    method: "DELETE"
  });
};

export const actualizarReceta = async (id, receta) => {
  await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(receta)
  });
};