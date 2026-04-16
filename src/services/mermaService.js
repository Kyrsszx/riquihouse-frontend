const API_URL = "https://riquihouse-backend.onrender.com/api/mermas";

export const obtenerMermas = async () => {
  const res = await fetch(API_URL);
  return await res.json();
};

export const crearMerma = async (merma) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(merma)
  });
  return await res.json();
};