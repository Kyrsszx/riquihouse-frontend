import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUsuario } from "../services/authService";
import "../styles/login.css";

function Login({ onLogin }) {
  const [usuario, setUsuario]   = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [verPwd, setVerPwd]     = useState(false);

  const navigate = useNavigate();

  const manejarSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const respuesta = await loginUsuario({ usuario, password });
      localStorage.setItem("usuarioLogueado", JSON.stringify(respuesta.usuario));
      onLogin();

      const rol = respuesta.usuario.rol.toLowerCase();
      if (rol === "administrador")  navigate("/");
      else if (rol === "vendedor")  navigate("/ventas");
      else if (rol === "cocinero")  navigate("/tablero-cocina");

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-visual">
        <div className="login-deco">
          <div className="login-deco-line" />
          <div className="login-deco-line" />
          <div className="login-deco-line" />
        </div>
        <div className="login-visual-content">
          <div className="login-logo-mark">🍰</div>
          <h1 className="login-visual-title">
            El sabor de<br /><em>la tradición</em>
          </h1>
          <p className="login-visual-desc">
            Sistema de gestión interno para pastelería RiquiHouse.
            Control de producción, ventas e inventario en un solo lugar.
          </p>
        </div>
      </div>
      <div className="login-form-panel">
        <div className="login-form-box">

          <div className="login-form-header">
            <h2 className="login-form-title">Bienvenido</h2>
            <p className="login-form-subtitle">Ingresa tus credenciales para continuar</p>
          </div>

          {error && (
            <div className="login-error">
              <span>⚠️</span>
              {error}
            </div>
          )}

          <form className="login-form" onSubmit={manejarSubmit}>

            <div className="login-field">
              <label className="login-label">Usuario</label>
              <div className="login-input-wrapper">
                <span className="login-input-icon"></span>
                <input
                  className="login-input"
                  type="text"
                  placeholder="Tu nombre de usuario"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="login-field">
              <label className="login-label">Contraseña</label>
              <div className="login-input-wrapper">
                <span className="login-input-icon"></span>
                <input
                  className="login-input"
                  type={verPwd ? "text" : "password"}
                  placeholder="Tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="login-pwd-toggle"
                  onClick={() => setVerPwd(!verPwd)}
                  tabIndex={-1}
                >
                  {verPwd ? "🔒" : "👁️"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="login-submit"
              disabled={loading}
            >
              {loading ? (
                <span className="login-loading">
                  <span className="spinner" />
                  Ingresando...
                </span>
              ) : (
                "Entrar al Sistema"
              )}
            </button>

          </form>

          <p className="login-footer">RiquiHouse · Sistema interno</p>

        </div>
      </div>

    </div>
  );
}

export default Login;
