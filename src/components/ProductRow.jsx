function ProductRow({ producto, onDelete, onEdit }) {

return(

<tr>

<td>{producto.id_producto}</td>
<td>{producto.nombre}</td>
<td>S/ {producto.precio_venta}</td>
<td>{producto.stock_actual}</td>

<td>

<div className="actions">

<button
className="btn btn-warning"
onClick={()=>onEdit(producto)}
>
Editar
</button>

<button
className="btn btn-danger"
onClick={()=>onDelete(producto.id_producto)}
>
Eliminar
</button>

</div>

</td>

</tr>

)

}

export default ProductRow