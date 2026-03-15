const API_URL = "http://localhost:3000/api/insumos";

export const obtenerInsumos = async () => {
  const res = await fetch(API_URL);
  return await res.json();
};

export const crearInsumo = async (insumo) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(insumo)
  });
  return await res.json();
};

export const eliminarInsumo = async (id) => {
  await fetch(`${API_URL}/${id}`, {
    method: "DELETE"
  });
};

export const actualizarInsumo = async (id, insumo) => {
  await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(insumo)
  });
};