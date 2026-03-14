import ProductRow from "./ProductRow";
import "../styles/productos.css";

function ProductTable({ productos, onDelete, onEdit }) {

return(

<div className="table-container">

<table className="table">

<thead>

<tr>
<th>ID</th>
<th>Nombre</th>
<th>Precio</th>
<th>Stock</th>
<th>Acciones</th>
</tr>

</thead>

<tbody>

{productos.map((p)=>(
<ProductRow
key={p.id_producto}
producto={p}
onDelete={onDelete}
onEdit={onEdit}
/>
))}

</tbody>

</table>

</div>

)

}

export default ProductTable