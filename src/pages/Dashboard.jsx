import { useEffect, useState } from "react";
import { obtenerProductos } from "../services/productoService";
import "../styles/dashboard.css";

function Dashboard(){

const [totalProductos,setTotalProductos]=useState(0)

useEffect(()=>{
cargarDatos()
},[])

const cargarDatos=async()=>{

const productos=await obtenerProductos()
setTotalProductos(productos.length)

}

return(

<div>

<h1 className="page-title">Dashboard</h1>

<div className="stats-grid">

<div className="stat-card">

<h3>Productos</h3>

<p>{totalProductos}</p>

<span>Productos registrados</span>

</div>

<div className="stat-card">

<h3>Insumos</h3>

<p>0</p>

<span>Insumos registrados</span>

</div>

<div className="stat-card">

<h3>Ventas Hoy</h3>

<p>0</p>

<span>Ventas realizadas</span>

</div>

<div className="stat-card">

<h3>Producción</h3>

<p>0</p>

<span>Lotes producidos</span>

</div>

</div>

</div>

)

}

export default Dashboard