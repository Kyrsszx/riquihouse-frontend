import { useEffect, useState } from "react";
import { obtenerInsumos, eliminarInsumo, crearInsumo, actualizarInsumo } from "../services/insumoService";

function Insumos() {
  const [insumos, setInsumos] = useState([]);
  
  // Modos: "cerrado", "nuevo", "existente", "editar"
  const [modoFormulario, setModoFormulario] = useState("cerrado");

  // Estados para NUEVO Insumo
  const [nombre, setNombre] = useState("");
  const [costo, setCosto] = useState("");
  const [stock, setStock] = useState("");

  // Estados para AGREGAR STOCK a uno Existente
  const [idSeleccionado, setIdSeleccionado] = useState("");
  const [cantidadExtra, setCantidadExtra] = useState("");

  // Estados para EDITAR Insumo (Nombre y Precio)
  const [insumoEditando, setInsumoEditando] = useState(null);
  const [nombreEdit, setNombreEdit] = useState("");
  const [costoEdit, setCostoEdit] = useState("");

  useEffect(() => {
    cargarInsumos();
  }, []);

  const cargarInsumos = async () => {
    const data = await obtenerInsumos();
    setInsumos(data);
    if (data.length > 0) setIdSeleccionado(data[0].id_insumo);
  };

  const borrarInsumo = async (id) => {
    const confirmar = window.confirm("¿Estás seguro de eliminar este ingrediente?");
    if (!confirmar) return;
    await eliminarInsumo(id);
    cargarInsumos(); 
  };

  const guardarNuevoInsumo = async (e) => {
    e.preventDefault();
    try {
      await crearInsumo({ nombre, costo_unitario: parseFloat(costo), stock_actual: parseInt(stock) || 0 });
      alert("¡Nuevo insumo registrado!");
      setNombre(""); setCosto(""); setStock("");
      setModoFormulario("cerrado");
      cargarInsumos();
    } catch (error) {
      alert("Error al guardar el insumo");
    }
  };

  const agregarStockExistente = async (e) => {
    e.preventDefault();
    try {
      const insumoOriginal = insumos.find(i => i.id_insumo === parseInt(idSeleccionado));
      
      // ¡AQUÍ ESTÁ LA CORRECCIÓN MATEMÁTICA!
      const nuevoStock = parseFloat(insumoOriginal.stock_actual) + parseFloat(cantidadExtra);

      await actualizarInsumo(idSeleccionado, {
        nombre: insumoOriginal.nombre,
        costo_unitario: insumoOriginal.costo_unitario,
        stock_actual: nuevoStock
      });

      alert("¡Stock actualizado correctamente!");
      setCantidadExtra("");
      setModoFormulario("cerrado");
      cargarInsumos();
    } catch (error) {
      alert("Error al actualizar el stock");
    }
  };

  // FUNCIONES NUEVAS PARA EDITAR
  const abrirEdicion = (insumo) => {
    setInsumoEditando(insumo);
    setNombreEdit(insumo.nombre);
    setCostoEdit(insumo.costo_unitario);
    setModoFormulario("editar");
  };

  const guardarEdicion = async (e) => {
    e.preventDefault();
    try {
      await actualizarInsumo(insumoEditando.id_insumo, {
        nombre: nombreEdit,
        costo_unitario: parseFloat(costoEdit),
        stock_actual: insumoEditando.stock_actual
      });
      alert("¡Datos del insumo actualizados!");
      setModoFormulario("cerrado");
      setInsumoEditando(null);
      cargarInsumos();
    } catch (error) {
      alert("Error al editar el insumo");
    }
  };

  const insumosOrdenados = [...insumos].sort((a, b) => a.stock_actual - b.stock_actual);

  return (
    <div>
      <h1 className="page-title">Almacén de Insumos</h1>
      
      <div style={{ marginBottom: "20px" }}>
        <button 
          className="btn btn-primary" 
          style={{ marginRight: "10px", background: modoFormulario === "existente" ? "#555" : "#0d6efd" }}
          onClick={() => setModoFormulario(modoFormulario === "existente" ? "cerrado" : "existente")}
        >
          📦 Ingresar más Stock
        </button>

        <button 
          className="btn btn-secondary" 
          style={{ background: modoFormulario === "nuevo" ? "#555" : "#198754", color: "white" }}
          onClick={() => setModoFormulario(modoFormulario === "nuevo" ? "cerrado" : "nuevo")}
        >
          ✨ Registrar Nuevo Insumo
        </button>
      </div>

      {modoFormulario === "existente" && (
        <form onSubmit={agregarStockExistente} style={{ background: "#e3f2fd", padding: "20px", marginBottom: "20px", borderRadius: "8px" }}>
          <h3>📦 Ingresar mercancía (Insumo Existente)</h3>
          <label>Insumo: </label>
          <select value={idSeleccionado} onChange={(e) => setIdSeleccionado(e.target.value)} style={{ marginRight: "15px", padding: "5px" }}>
            {insumos.map(i => <option key={i.id_insumo} value={i.id_insumo}>{i.nombre} (Stock: {i.stock_actual})</option>)}
          </select>
          <label>Cantidad a sumar: </label>
          <input type="number" step="0.01" min="0.01" value={cantidadExtra} onChange={(e) => setCantidadExtra(e.target.value)} required style={{ marginRight: "10px", width: "80px", padding: "5px" }} />
          <button type="submit" className="btn btn-primary">Sumar al Almacén</button>
        </form>
      )}

      {modoFormulario === "nuevo" && (
        <form onSubmit={guardarNuevoInsumo} style={{ background: "#e8f5e9", padding: "20px", marginBottom: "20px", borderRadius: "8px" }}>
          <h3>✨ Registrar Insumo por primera vez</h3>
          <label>Nombre: </label>
          <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required style={{ marginRight: "10px" }} />
          <label>Costo (S/.): </label>
          <input type="number" step="0.01" value={costo} onChange={(e) => setCosto(e.target.value)} required style={{ marginRight: "10px", width: "80px" }} />
          <label>Stock Inicial: </label>
          <input type="number" step="0.01" value={stock} onChange={(e) => setStock(e.target.value)} required style={{ marginRight: "10px", width: "80px" }} />
          <button type="submit" className="btn btn-primary" style={{ background: "green" }}>Guardar Nuevo</button>
        </form>
      )}

      {modoFormulario === "editar" && insumoEditando && (
        <form onSubmit={guardarEdicion} style={{ background: "#fff3cd", padding: "20px", marginBottom: "20px", borderRadius: "8px", border: "1px solid #ffeeba" }}>
          <h3 style={{ color: "#856404", marginTop: 0 }}>✏️ Editar Insumo (ID: {insumoEditando.id_insumo})</h3>
          <label>Nuevo Nombre: </label>
          <input type="text" value={nombreEdit} onChange={(e) => setNombreEdit(e.target.value)} required style={{ marginRight: "10px" }} />
          <label>Nuevo Costo (S/.): </label>
          <input type="number" step="0.01" value={costoEdit} onChange={(e) => setCostoEdit(e.target.value)} required style={{ marginRight: "10px", width: "80px" }} />
          <button type="submit" className="btn btn-warning" style={{ color: "black", fontWeight: "bold" }}>Guardar Cambios</button>
          <button type="button" onClick={() => setModoFormulario("cerrado")} style={{ marginLeft: "10px", cursor: "pointer" }}>Cancelar</button>
        </form>
      )}

      <table border="1" width="100%" style={{ textAlign: "left", marginBottom: "20px", background: "white" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre del Insumo</th>
            <th>Costo Unitario</th>
            <th>Stock Actual</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {insumosOrdenados.length === 0 ? (
            <tr><td colSpan="6">El almacén está vacío</td></tr>
          ) : (
            insumosOrdenados.map((insumo) => {
              const esPocoStock = insumo.stock_actual < 20;
              return (
                <tr key={insumo.id_insumo} style={{ background: esPocoStock ? "#ffebee" : "transparent" }}>
                  <td>{insumo.id_insumo}</td>
                  <td><strong>{insumo.nombre}</strong></td>
                  <td>S/. {insumo.costo_unitario}</td>
                  <td style={{ color: esPocoStock ? "red" : "black", fontWeight: "bold" }}>
                    {insumo.stock_actual}
                  </td>
                  <td>{esPocoStock ? "⚠️ Comprar más" : "✅ Óptimo"}</td>
                  <td>
                    <button className="btn btn-warning" style={{ marginRight: "5px" }} onClick={() => abrirEdicion(insumo)}>Editar</button>
                    <button className="btn btn-danger" onClick={() => borrarInsumo(insumo.id_insumo)}>Eliminar</button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Insumos;