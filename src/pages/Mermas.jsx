import { useEffect, useState } from "react";
import { obtenerInsumos } from "../services/insumoService";
import { crearMerma, obtenerMermas } from "../services/mermaService";

function Mermas() {
  const [historial, setHistorial] = useState([]);
  const [insumos, setInsumos] = useState([]);

  // Estados del formulario
  const [idInsumo, setIdInsumo] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [motivo, setMotivo] = useState("");

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    const dataMermas = await obtenerMermas();
    setHistorial(dataMermas);
    
    const dataInsumos = await obtenerInsumos();
    setInsumos(dataInsumos);
    if(dataInsumos.length > 0) setIdInsumo(dataInsumos[0].id_insumo);
  };

  const registrarAccidente = async (e) => {
    e.preventDefault();
    try {
      await crearMerma({
        id_insumo: idInsumo,
        cantidad_perdida: parseFloat(cantidad),
        motivo: motivo
      });
      alert("⚠️ Merma registrada. El stock se ha descontado automáticamente del almacén.");
      setCantidad("");
      setMotivo("");
      cargarDatos();
    } catch (error) {
      alert("Error al registrar la merma");
    }
  };

  return (
    <div>
      <h1 className="page-title" style={{ color: "#d9534f" }}>⚠️ Reporte de Mermas (Insumos)</h1>
      <p>Registra ingredientes derramados, vencidos o en mal estado para descontarlos del almacén.</p>

      {/* FORMULARIO DE REPORTE */}
      <form onSubmit={registrarAccidente} style={{ background: "#ffebee", padding: "20px", borderRadius: "8px", border: "1px solid #ffcdd2", marginBottom: "30px" }}>
        
        <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", marginBottom: "15px" }}>
          <div>
            <label style={{ display: "block", fontWeight: "bold" }}>Insumo dañado:</label>
            <select value={idInsumo} onChange={(e) => setIdInsumo(e.target.value)} style={{ padding: "8px", minWidth: "200px" }}>
              {insumos.map(i => <option key={i.id_insumo} value={i.id_insumo}>{i.nombre}</option>)}
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontWeight: "bold" }}>Cantidad perdida:</label>
            <input type="number" step="0.01" min="0.01" value={cantidad} onChange={(e) => setCantidad(e.target.value)} required style={{ padding: "8px", width: "120px" }} />
          </div>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", fontWeight: "bold" }}>Motivo / Justificación:</label>
          <input type="text" placeholder="Ej: Se cayeron los huevos, la leche se cortó..." value={motivo} onChange={(e) => setMotivo(e.target.value)} required style={{ width: "100%", padding: "8px", boxSizing: "border-box" }} />
        </div>

        <button type="submit" className="btn" style={{ background: "#d9534f", color: "white", fontWeight: "bold" }}>
          Registrar Pérdida
        </button>
      </form>

      {/* TABLA DE HISTORIAL */}
      <h3>Historial de Mermas</h3>
      <table border="1" width="100%" style={{ background: "white", textAlign: "left" }}>
        <thead style={{ background: "#f8f9fa" }}>
          <tr>
            <th>Fecha y Hora</th>
            <th>Insumo Dañado</th>
            <th>Cantidad</th>
            <th>Motivo</th>
          </tr>
        </thead>
        <tbody>
          {historial.length === 0 ? (
            <tr><td colSpan="4" style={{ textAlign: "center", padding: "10px" }}>No hay accidentes reportados. ¡Buen trabajo en cocina!</td></tr>
          ) : (
            historial.map(merma => (
              <tr key={merma.id_merma}>
                <td>{new Date(merma.fecha_hora).toLocaleString()}</td>
                <td><strong>{merma.nombre_insumo}</strong></td>
                <td style={{ color: "red", fontWeight: "bold" }}>-{merma.cantidad_perdida}</td>
                <td>{merma.motivo}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Mermas;