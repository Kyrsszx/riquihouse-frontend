import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUsuario } from "../services/authService";

function Login({ onLogin }) {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const navigate = useNavigate();

  const manejarSubmit = async (e) => {
    e.preventDefault();
    setError(""); 

    try {
      const respuesta = await loginUsuario({ usuario, password });
      
      // Guardamos al usuario en memoria
      localStorage.setItem("usuarioLogueado", JSON.stringify(respuesta.usuario));
      onLogin();
      
      // 🚀 REDIRECCIÓN INTELIGENTE POR ROL (AQUÍ ES DONDE VA)
      // Lo convertimos a minúscula por si en la base de datos dice "Vendedor" o "vendedor"
      const rolUsuario = respuesta.usuario.rol.toLowerCase();
      
      if (rolUsuario === 'administrador') {
        navigate("/"); 
      } else if (rolUsuario === 'vendedor') {
        navigate("/ventas"); 
      } else if (rolUsuario === 'cocinero') {
        navigate("/tablero-cocina"); 
      }

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#f4f4f4" }}>
      <div style={{ background: "white", padding: "40px", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)", width: "100%", maxWidth: "400px" }}>
        
        <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#333" }}>🥞 Riqui House</h2>
        <h4 style={{ textAlign: "center", marginBottom: "20px", color: "#666" }}>Iniciar Sesión</h4>

        {error && (
          <div style={{ background: "#f8d7da", color: "#721c24", padding: "10px", borderRadius: "4px", marginBottom: "15px", textAlign: "center" }}>
            {error}
          </div>
        )}

        <form onSubmit={manejarSubmit}>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Usuario</label>
            <input 
              type="text" 
              value={usuario} 
              onChange={(e) => setUsuario(e.target.value)} 
              required 
              style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc", boxSizing: "border-box" }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Contraseña</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc", boxSizing: "border-box" }}
            />
          </div>

          <button type="submit" style={{ width: "100%", padding: "10px", background: "#0d6efd", color: "white", border: "none", borderRadius: "4px", fontSize: "16px", cursor: "pointer", fontWeight: "bold" }}>
            Entrar al Sistema
          </button>
        </form>

      </div>
    </div>
  );
}

export default Login;