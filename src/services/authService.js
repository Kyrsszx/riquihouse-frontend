const API_URL = "http://localhost:3000/api/auth";

export const loginUsuario = async (credenciales) => {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credenciales)
  });

  // Si el backend responde con error (ej. 401 Unauthorized), lanzamos el error
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.mensaje || "Error al iniciar sesión");
  }

  return await res.json();
};