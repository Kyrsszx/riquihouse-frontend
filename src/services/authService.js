const API_URL = "https://riquihouse-backend.onrender.com/api/auth";

export const loginUsuario = async (credenciales) => {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credenciales)
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.mensaje || "Error al iniciar sesión");
  }

  return await res.json();
};