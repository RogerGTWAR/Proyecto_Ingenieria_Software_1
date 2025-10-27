import { useState } from "react";
import ButtonList from "../components/ButtonList";
import DeleteConfirmationModal from "../components/ui/DeleteConfirmationModal";
import ProductosCard from "../components/productos/ProductosCard";
import ProductosDetails from "../components/productos/ProductosDetails";
import ProductosForm from "../components/productos/ProductosForm";
import { useProductos } from "../hooks/useProductos";

function ProductosPage() {
  const { items: productos, loading, add, edit, remove, reload } = useProductos();

  const [busqueda, setBusqueda] = useState("");
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [vistaDetalle, setVistaDetalle] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [productoAEditar, setProductoAEditar] = useState(null);
  const [mostrarEliminar, setMostrarEliminar] = useState(false);
  const [productoAEliminar, setProductoAEliminar] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const productosFiltrados = productos.filter((p) =>
    p.nombre_producto.toLowerCase().includes(busqueda.toLowerCase())
  );

  const abrirFormulario = () => {
    setProductoAEditar(null);
    setModoEdicion(false);
    setMostrarFormulario(true);
  };

  const editarProducto = (producto) => {
    setProductoAEditar(producto);
    setModoEdicion(true);
    setMostrarFormulario(true);
  };

  const cerrarFormulario = () => {
    setMostrarFormulario(false);
    setProductoAEditar(null);
    setModoEdicion(false);
  };

  const guardarProducto = async (data) => {
    try {
      if (modoEdicion && productoAEditar) {
        await edit(productoAEditar.id, data);
      } else {
        await add(data);
      }
      await reload();
      cerrarFormulario();
    } catch (e) {
      console.error("Error al guardar producto:", e);
      alert("No se pudo guardar el producto.");
    }
  };

  const abrirDetalles = (producto) => {
    setProductoSeleccionado(producto);
    setVistaDetalle(true);
  };

  const cerrarDetalles = () => {
    setVistaDetalle(false);
    setProductoSeleccionado(null);
  };

  const abrirEliminar = (producto) => {
    setProductoAEliminar(producto);
    setMostrarEliminar(true);
  };

  const cerrarEliminar = () => {
    setMostrarEliminar(false);
    setProductoAEliminar(null);
  };

  const eliminarProducto = async () => {
    if (!productoAEliminar) return;
    setIsDeleting(true);
    try {
      await remove(productoAEliminar.id);
      await reload();
      cerrarEliminar();
    } catch (e) {
      console.error("Error al eliminar producto:", e);
      alert("Error al eliminar el producto.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-[var(--color-primary)] text-lg font-semibold">
        Cargando productos...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 relative">
      <h1 className="heading-1 text-[var(--color-primary)] mb-2">Productos</h1>
      <p className="body-1 text-[var(--color-gray)] mb-6">
        Gestión de productos en inventario
      </p>

      <ButtonList
        buttons={[
          {
            id: "add",
            name: "Añadir Producto",
            icon: "/icons/add.svg",
            coordinate: 4,
            action: abrirFormulario,
          },
        ]}
      />

      <div className="bg-white rounded-xl shadow-sm p-4 mt-4 mb-6">
        <input
          type="text"
          placeholder="Buscar producto por nombre..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[var(--color-primary)]"
        />
      </div>

      <ProductosCard
        productos={productosFiltrados}
        onEdit={editarProducto}
        onDelete={abrirEliminar}
        onVerDetalles={abrirDetalles}
      />

      {vistaDetalle && productoSeleccionado && (
        <ProductosDetails
          producto={productos.find((p) => p.id === productoSeleccionado.id)}
          onClose={cerrarDetalles}
          onEdit={editarProducto}
          onDelete={abrirEliminar}
        />
      )}

      {mostrarFormulario && (
        <ProductosForm
          onSubmit={guardarProducto}
          onClose={cerrarFormulario}
          initialData={productoAEditar}
          isEdit={modoEdicion}
        />
      )}

      {mostrarEliminar && (
        <DeleteConfirmationModal
          isOpen={mostrarEliminar}
          onClose={cerrarEliminar}
          onConfirm={eliminarProducto}
          itemName={productoAEliminar?.nombre_producto || ""}
          loading={isDeleting}
        />
      )}
    </div>
  );
}

export default ProductosPage;
