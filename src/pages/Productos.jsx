import { useEffect, useState } from "react";
import { obtenerProductos, eliminarProducto } from "../services/productoService";

import ProductTable from "../components/ProductTable";
import ProductModal from "../components/ProductModal";
import FormProducto from "../components/FormProducto";

import "../styles/productos.css";

function Productos(){

const [productos,setProductos]=useState([])
const [modalCrear,setModalCrear]=useState(false)
const [productoEditar,setProductoEditar]=useState(null)

useEffect(()=>{
cargarProductos()
},[])

const cargarProductos=async()=>{
const data=await obtenerProductos()
setProductos(data)
}

const borrarProducto=async(id)=>{

const confirmar=window.confirm("¿Eliminar producto?")

if(!confirmar) return

await eliminarProducto(id)
cargarProductos()

}

const abrirEditar=(producto)=>{
setProductoEditar(producto)
}

const cerrarEditar=()=>{
setProductoEditar(null)
}

return(

<div>

<h1 className="page-title">Productos</h1>

<button
className="btn btn-primary"
onClick={()=>setModalCrear(true)}
>
+ Nuevo Producto
</button>

<br/>
<br/>

<ProductTable
productos={productos}
onDelete={borrarProducto}
onEdit={abrirEditar}
/>

{modalCrear && (

<div className="modal-overlay">

<div className="modal-box">

<FormProducto
recargarProductos={cargarProductos}
/>

<button
className="btn"
onClick={()=>setModalCrear(false)}
>
Cerrar
</button>

</div>

</div>

)}

{productoEditar && (

<ProductModal
producto={productoEditar}
cerrarModal={cerrarEditar}
recargarProductos={cargarProductos}
/>

)}

</div>

)

}

export default Productos