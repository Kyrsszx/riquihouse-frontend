const API_URL = "http://localhost:3000/api/produccion";

export const obtenerProduccion = async () => {
  const res = await fetch(API_URL);
  return await res.json();
};

export const registrarProduccion = async (produccion) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(produccion)
  });
  return await res.json();
};