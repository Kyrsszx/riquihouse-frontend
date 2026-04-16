import { useState, useEffect } from "react";
import { crearProducto } from "../services/productoService";
import { obtenerInsumos } from "../services/insumoService";
import { crearReceta } from "../services/recetaService";
import "../styles/productos.css";

function FormProducto({ recargarProductos }) {
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");
  const [insumosBD, setInsumosBD] = useState([]);
  const [ingredientesTemp, setIngredientesTemp] = useState([]);
  const [idInsumoSeleccionado, setIdInsumoSeleccionado] = useState("");
  const [cantidadInsumo, setCantidadInsumo] = useState("");

  useEffect(() => {
    const cargarInsumos = async () => {
      const data = await obtenerInsumos();
      setInsumosBD(data);
      if (data.length > 0) setIdInsumoSeleccionado(data[0].id_insumo);
    };
    cargarInsumos();
  }, []);

  const agregarIngredienteTemporal = () => {
    if (!idInsumoSeleccionado || !cantidadInsumo) return;

    const insumoElegido = insumosBD.find(i => i.id_insumo === parseInt(idInsumoSeleccionado));
    
    setIngredientesTemp([...ingredientesTemp, {
      id_insumo: insumoElegido.id_insumo,
      nombre: insumoElegido.nombre,
      cantidad_necesaria: parseFloat(cantidadInsumo)
    }]);

    setCantidadInsumo("");
  };

  const quitarIngrediente = (index) => {
    const nuevaLista = ingredientesTemp.filter((_, i) => i !== index);
    setIngredientesTemp(nuevaLista);
  };

  const manejarSubmit = async (e) => {
    e.preventDefault();

    const nuevoProducto = {
      nombre,
      precio_venta: parseFloat(precio),
      stock_actual: parseInt(stock) || 0
    };

    try {
      const responseProducto = await crearProducto(nuevoProducto);
      const idNuevoProducto = responseProducto.id_producto || responseProducto.insertId || responseProducto.id;
      if (idNuevoProducto && ingredientesTemp.length > 0) {
        for (let i = 0; i < ingredientesTemp.length; i++) {
          await crearReceta({
            id_producto: idNuevoProducto,
            id_insumo: ingredientesTemp[i].id_insumo,
            cantidad_necesaria: ingredientesTemp[i].cantidad_necesaria
          });
        }
      }

      alert("¡Producto y receta creados con éxito! 🚀");
      setNombre(""); setPrecio(""); setStock("");
      setIngredientesTemp([]);
      recargarProductos();

    } catch (error) {
      console.error(error);
      alert("Hubo un error al guardar el producto y su receta.");
    }
  };

  return (
    <div className="form-card" style={{ maxHeight: "80vh", overflowY: "auto" }}>
      <h2>Crear Producto</h2>

      <form onSubmit={manejarSubmit}>
        <div className="form-group">
          <label>Nombre del Producto</label>
          <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Precio (S/.)</label>
            <input type="number" step="0.01" value={precio} onChange={(e) => setPrecio(e.target.value)} required />
          </div>

          <div className="form-group" style={{ flex: 1 }}>
            <label>Stock Inicial en Vitrina</label>
            <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} />
          </div>
        </div>

        <div style={{ background: "#f0f8ff", padding: "15px", borderRadius: "8px", marginBottom: "15px", border: "1px solid #cce5ff" }}>
          <h4 style={{ marginTop: 0, color: "#004085" }}>🥣 Receta (Ingredientes)</h4>
          
          <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "10px" }}>
            <select 
              value={idInsumoSeleccionado} 
              onChange={(e) => setIdInsumoSeleccionado(e.target.value)}
              style={{ flex: 2, padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
            >
              {insumosBD.map(i => <option key={i.id_insumo} value={i.id_insumo}>{i.nombre}</option>)}
            </select>
            
            <input 
              type="number" step="0.01" placeholder="Cant."
              value={cantidadInsumo} onChange={(e) => setCantidadInsumo(e.target.value)}
              style={{ flex: 1, padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
            />
            
            <button type="button" onClick={agregarIngredienteTemporal} className="btn btn-secondary" style={{ background: "#6c757d" }}>
              Añadir
            </button>
          </div>

          {ingredientesTemp.length > 0 && (
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {ingredientesTemp.map((ing, index) => (
                <li key={index} style={{ display: "flex", justifyContent: "space-between", background: "#fff", padding: "8px", borderBottom: "1px solid #ddd", fontSize: "14px" }}>
                  <span>🔸 {ing.cantidad_necesaria}x <strong>{ing.nombre}</strong></span>
                  <button type="button" onClick={() => quitarIngrediente(index)} style={{ color: "red", border: "none", background: "none", cursor: "pointer", fontWeight: "bold" }}>X</button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button className="btn btn-primary" type="submit" style={{ width: "100%", padding: "10px", fontSize: "16px" }}>
          Guardar Producto y Receta
        </button>
      </form>
    </div>
  );
}

export default FormProducto;