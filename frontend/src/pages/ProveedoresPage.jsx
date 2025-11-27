import { useState } from "react";
import ButtonList from "../components/ButtonList";
import DeleteConfirmationModal from "../components/ui/DeleteConfirmationModal";

import ProveedoresCard from "../components/proveedores/ProveedoresCard";
import ProveedoresTable from "../components/proveedores/ProveedoresTable";
import ProveedoresDetails from "../components/proveedores/ProveedoresDetails";
import ProveedoresForm from "../components/proveedores/ProveedoresForm";

import { useProveedores } from "../hooks/useProveedores";

function ProveedoresPage() {
  const { items: proveedores, loading, add, edit, remove, reload } = useProveedores();

  const [busqueda, setBusqueda] = useState("");
  const [vistaTabla, setVistaTabla] = useState(false);     // ← NUEVO
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState(null);
  const [vistaDetalle, setVistaDetalle] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [proveedorAEditar, setProveedorAEditar] = useState(null);
  const [mostrarEliminar, setMostrarEliminar] = useState(false);
  const [proveedorAEliminar, setProveedorAEliminar] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const proveedoresFiltrados = proveedores.filter((p) =>
    p.nombre_empresa.toLowerCase().includes(busqueda.toLowerCase())
  );

  const abrirFormulario = () => {
    setProveedorAEditar(null);
    setModoEdicion(false);
    setMostrarFormulario(true);
  };

  const editarProveedor = (proveedor) => {
    setProveedorAEditar(proveedor);
    setModoEdicion(true);
    setMostrarFormulario(true);
  };

  const cerrarFormulario = () => {
    setMostrarFormulario(false);
    setProveedorAEditar(null);
    setModoEdicion(false);
  };

  const guardarProveedor = async (data) => {
    try {
      if (modoEdicion && proveedorAEditar) {
        await edit(proveedorAEditar.id, data);
      } else {
        await add(data);
      }
      await reload();
      cerrarFormulario();
    } catch (e) {
      console.error("Error al guardar proveedor:", e);
      alert("No se pudo guardar el proveedor.");
    }
  };

  const abrirDetalles = (proveedor) => {
    setProveedorSeleccionado(proveedor);
    setVistaDetalle(true);
  };

  const cerrarDetalles = () => {
    setVistaDetalle(false);
    setProveedorSeleccionado(null);
  };

  const abrirEliminar = (proveedor) => {
    setProveedorAEliminar(proveedor);
    setMostrarEliminar(true);
  };

  const cerrarEliminar = () => {
    setMostrarEliminar(false);
    setProveedorAEliminar(null);
  };

  const eliminarProveedor = async () => {
    if (!proveedorAEliminar) return;
    setIsDeleting(true);
    try {
      await remove(proveedorAEliminar.id);
      await reload();
      cerrarEliminar();
    } catch (e) {
      console.error("Error al eliminar proveedor:", e);
      alert("Error al eliminar el proveedor.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-[var(--color-primary)] text-lg font-semibold">
        Cargando proveedores...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 relative">
      <h1 className="heading-1 text-[var(--color-primary)] mb-2">Proveedores</h1>
      <p className="body-1 text-[var(--color-gray)] mb-6">
        Gestión de proveedores registrados
      </p>

      <ButtonList
        buttons={[
          {
            id: "add",
            name: "Añadir Proveedor",
            icon: "/icons/add.svg",
            coordinate: 4,
            action: abrirFormulario,
          },
        ]}
      />

      <div className="bg-white rounded-xl shadow-sm p-4 mt-4 mb-6 flex items-center gap-4">
        <input
          type="text"
          placeholder="Buscar proveedor por nombre..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[var(--color-primary)]"
        />

        <button
          onClick={() => setVistaTabla(!vistaTabla)}
          className="px-4 py-2 bg-[#1A2E81] text-white rounded-lg shadow hover:scale-105 transition"
        >
          {vistaTabla ? "Ver como Tarjetas" : "Ver como Tabla"}
        </button>
      </div>


      {vistaTabla ? (
        <ProveedoresTable
          proveedores={proveedoresFiltrados}
          onEdit={editarProveedor}
          onDelete={abrirEliminar}
          onVerDetalles={abrirDetalles}
        />
      ) : (
        <ProveedoresCard
          proveedores={proveedoresFiltrados}
          onEdit={editarProveedor}
          onDelete={abrirEliminar}
          onVerDetalles={abrirDetalles}
        />
      )}

      {vistaDetalle && proveedorSeleccionado && (
        <ProveedoresDetails
          proveedor={proveedores.find((p) => p.id === proveedorSeleccionado.id)}
          onClose={cerrarDetalles}
          onEdit={editarProveedor}
          onDelete={abrirEliminar}
        />
      )}

      {mostrarFormulario && (
        <ProveedoresForm
          onSubmit={guardarProveedor}
          onClose={cerrarFormulario}
          initialData={proveedorAEditar}
          isEdit={modoEdicion}
        />
      )}

      {mostrarEliminar && (
        <DeleteConfirmationModal
          isOpen={mostrarEliminar}
          onClose={cerrarEliminar}
          onConfirm={eliminarProveedor}
          itemName={proveedorAEliminar?.nombre_empresa || ""}
          loading={isDeleting}
        />
      )}
    </div>
  );
}

export default ProveedoresPage;
