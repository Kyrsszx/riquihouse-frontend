import { useState } from "react";
import { crearProducto } from "../services/productoService";
import "../styles/productos.css";

function FormProducto({ recargarProductos }) {

const [nombre,setNombre]=useState("");
const [precio,setPrecio]=useState("");
const [stock,setStock]=useState("");

const manejarSubmit=async(e)=>{
e.preventDefault();

const nuevoProducto={
nombre,
precio_venta:parseFloat(precio),
stock_actual:parseInt(stock)
};

await crearProducto(nuevoProducto);

setNombre("");
setPrecio("");
setStock("");

recargarProductos();
};

return(

<div className="form-card">

<h2>Crear Producto</h2>

<form onSubmit={manejarSubmit}>

<div className="form-group">
<label>Nombre</label>
<input
type="text"
value={nombre}
onChange={(e)=>setNombre(e.target.value)}
required
/>
</div>

<div className="form-group">
<label>Precio</label>
<input
type="number"
step="0.01"
value={precio}
onChange={(e)=>setPrecio(e.target.value)}
required
/>
</div>

<div className="form-group">
<label>Stock</label>
<input
type="number"
value={stock}
onChange={(e)=>setStock(e.target.value)}
/>
</div>

<button className="btn btn-primary" type="submit">
Crear Producto
</button>

</form>

</div>

)

}

export default FormProducto