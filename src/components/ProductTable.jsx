import ProductRow from "./ProductRow";
import "../styles/table.css";

function ProductTable({ productos, onDelete, onEdit }) {
  return (
    <div className="table-container">

      {/* Toolbar */}
      <div className="table-toolbar">
        <div className="table-toolbar-left">
          <div className="table-search">
            <span className="table-search-icon">🔍</span>
            <input placeholder="Buscar productos..." />
          </div>
        </div>
      </div>

      {/* Tabla */}
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Stock</th>
            <th style={{ textAlign: "right" }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.length === 0 ? (
            <tr>
              <td colSpan={5}>
                <div className="empty-state">
                  <span className="empty-state-icon">🧁</span>
                  <p className="empty-state-title">Sin productos</p>
                  <p>Agrega tu primer producto para comenzar</p>
                </div>
              </td>
            </tr>
          ) : (
            productos.map((p) => (
              <ProductRow
                key={p.id_producto}
                producto={p}
                onDelete={onDelete}
                onEdit={onEdit}
              />
            ))
          )}
        </tbody>
      </table>

    </div>
  );
}

export default ProductTable;
