import { useEffect, useState } from "react";
import { crearVenta } from "../services/ventaService";
import { obtenerProductos } from "../services/productoService"; 

function PuntoDeVenta() {
  // Estados para manejar los datos
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  
  // Estados para el formulario de agregar al carrito
  const [productoSeleccionado, setProductoSeleccionado] = useState("");
  const [cantidad, setCantidad] = useState(1);

  // Al cargar la pantalla, traemos los productos de la vitrina
  useEffect(() => {
    cargarProductosBase();
  }, []);

  const cargarProductosBase = async () => {
    const data = await obtenerProductos();
    setProductos(data);
    // Seleccionar por defecto el primer producto de la lista
    if (data.length > 0) {
      setProductoSeleccionado(data[0].id_producto);
    }
  };

  // Función para meter productos al carrito temporal de React
  const agregarAlCarrito = () => {
    const prod = productos.find(p => p.id_producto === parseInt(productoSeleccionado));
    if (!prod) return;

    if (cantidad > prod.stock_actual) {
      alert("¡No hay suficiente stock en la vitrina!");
      return;
    }

    const subtotal = prod.precio_venta * cantidad;

    const nuevoItem = {
      id_producto: prod.id_producto,
      nombre: prod.nombre,
      precio: prod.precio_venta,
      cantidad: parseInt(cantidad),
      subtotal: subtotal
    };

    setCarrito([...carrito, nuevoItem]);
    setCantidad(1); // Reiniciamos el número
  };

  // Calcular el total a cobrar sumando los subtotales
  const calcularTotal = () => {
    return carrito.reduce((acumulador, item) => acumulador + item.subtotal, 0);
  };

  // ¡El botón final que habla con tu Backend!
  const procesarVenta = async () => {
    if (carrito.length === 0) {
      alert("El carrito está vacío");
      return;
    }

    // Armamos el JSON exacto que nos pedía tu Backend anoche
    const nuevaVenta = {
      id_usuario: 1, // ID 1 (Carlos, nuestro cajero)
      total_venta: calcularTotal(),
      detalles: carrito.map(item => ({
        id_producto: item.id_producto,
        cantidad: item.cantidad,
        subtotal: item.subtotal
      }))
    };

    try {
      await crearVenta(nuevaVenta);
      alert("¡Venta registrada con éxito y stock descontado! 🥞");
      
      // Limpiamos la caja para el siguiente cliente
      setCarrito([]); 
      cargarProductosBase(); // Recargamos la vitrina para ver el nuevo stock
    } catch (error) {
      console.error(error);
      alert("Error al registrar la venta");
    }
  };

  return (
    <div>
      <h1 className="page-title">Punto de Venta</h1>

      {/* SECCIÓN 1: Formulario para elegir producto */}
      <div style={{ background: "#f4f4f4", padding: "20px", marginBottom: "20px" }}>
        <h3>Agregar Producto</h3>
        <select 
          value={productoSeleccionado} 
          onChange={(e) => setProductoSeleccionado(e.target.value)}
          style={{ marginRight: "10px", padding: "5px" }}
        >
          {productos.map(prod => (
            <option key={prod.id_producto} value={prod.id_producto}>
              {prod.nombre} (Stock: {prod.stock_actual}) - S/.{prod.precio_venta}
            </option>
          ))}
        </select>

        <input 
          type="number" 
          min="1" 
          value={cantidad} 
          onChange={(e) => setCantidad(e.target.value)}
          style={{ width: "60px", marginRight: "10px", padding: "5px" }}
        />

        <button className="btn btn-primary" onClick={agregarAlCarrito}>
          Agregar al Carrito
        </button>
      </div>

      {/* SECCIÓN 2: El Carrito de Compras (Lo que José pondrá bonito luego) */}
      <h3>Carrito de Compras</h3>
      <table border="1" width="100%" style={{ textAlign: "left", marginBottom: "20px" }}>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {carrito.length === 0 ? (
            <tr><td colSpan="4">No hay productos en el carrito</td></tr>
          ) : (
            carrito.map((item, index) => (
              <tr key={index}>
                <td>{item.nombre}</td>
                <td>S/. {item.precio}</td>
                <td>{item.cantidad}</td>
                <td>S/. {item.subtotal}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* SECCIÓN 3: Total y Botón de Cobrar */}
      <h2>Total a Pagar: S/. {calcularTotal()}</h2>
      <button 
        className="btn btn-primary" 
        style={{ background: "green", fontSize: "18px", padding: "10px 20px" }}
        onClick={procesarVenta}
      >
        💰 COBRAR VENTA
      </button>

    </div>
  );
}

export default PuntoDeVenta;