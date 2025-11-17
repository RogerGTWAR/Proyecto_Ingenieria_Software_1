import { useState } from "react";
import ButtonList from "../components/ButtonList";
import DeleteConfirmationModal from "../components/ui/DeleteConfirmationModal";

import MaterialesCard from "../components/materiales/MaterialesCard";
import MaterialesTable from "../components/materiales/MaterialesTable"; // NUEVO
import MaterialesDetails from "../components/materiales/MaterialesDetails";
import MaterialesForm from "../components/materiales/MaterialesForm";

import { useMateriales } from "../hooks/useMateriales";

function MaterialesPage() {
  const { items: materiales, loading, add, edit, remove, reload } = useMateriales();

  const [busqueda, setBusqueda] = useState("");
  const [materialSeleccionado, setMaterialSeleccionado] = useState(null);
  const [vistaDetalle, setVistaDetalle] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [materialAEditar, setMaterialAEditar] = useState(null);
  const [mostrarEliminar, setMostrarEliminar] = useState(false);
  const [materialAEliminar, setMaterialAEliminar] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // 🔘 Nueva vista (true = tarjetas, false = tabla)
  const [vistaTarjetas, setVistaTarjetas] = useState(true);

  const materialesFiltrados = materiales.filter((m) =>
    m.nombre_material.toLowerCase().includes(busqueda.toLowerCase())
  );

  const abrirFormulario = () => {
    setMaterialAEditar(null);
    setModoEdicion(false);
    setMostrarFormulario(true);
  };

  const editarMaterial = (material) => {
    setMaterialAEditar(material);
    setModoEdicion(true);
    setMostrarFormulario(true);
  };

  const cerrarFormulario = () => {
    setMostrarFormulario(false);
    setMaterialAEditar(null);
    setModoEdicion(false);
  };

  const guardarMaterial = async (data) => {
    try {
      if (modoEdicion && materialAEditar) {
        await edit(materialAEditar.id, data);
      } else {
        await add(data);
      }
      await reload();
      cerrarFormulario();
    } catch (e) {
      console.error("❌ Error al guardar material:", e);
      alert("No se pudo guardar el material.");
    }
  };

  const abrirDetalles = (material) => {
    setMaterialSeleccionado(material);
    setVistaDetalle(true);
  };

  const cerrarDetalles = () => {
    setVistaDetalle(false);
    setMaterialSeleccionado(null);
  };

  const abrirEliminar = (material) => {
    setMaterialAEliminar(material);
    setMostrarEliminar(true);
  };

  const cerrarEliminar = () => {
    setMostrarEliminar(false);
    setMaterialAEliminar(null);
  };

  const eliminarMaterial = async () => {
    if (!materialAEliminar) return;
    setIsDeleting(true);
    try {
      await remove(materialAEliminar.id);
      await reload();
      cerrarEliminar();
    } catch (e) {
      console.error("❌ Error al eliminar material:", e);
      alert("No se pudo eliminar el material.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-[var(--color-primary)] text-lg font-semibold">
        Cargando materiales...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 relative">
      <h1 className="heading-1 text-[var(--color-primary)] mb-2">Materiales</h1>
      <p className="body-1 text-[var(--color-gray)] mb-6">
        Gestión de materiales y suministros en inventario
      </p>

      <ButtonList
        buttons={[
          {
            id: "add",
            name: "Añadir Material",
            icon: "/icons/add.svg",
            coordinate: 4,
            action: abrirFormulario,
          },
        ]}
      />

      {/* Buscador + Switch */}
      <div className="bg-white rounded-xl shadow-sm p-4 mt-4 mb-6 flex items-center gap-4">
        <input
          type="text"
          placeholder="Buscar material por nombre..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[var(--color-primary)]"
        />

        {/* 🔘 Switch Vista */}
        <button
          onClick={() => setVistaTarjetas(!vistaTarjetas)}
          className="px-4 py-2 bg-[#1A2E81] text-white rounded-lg shadow hover:scale-105 transition"
        >
          {vistaTarjetas ? "Ver como Tabla" : "Ver como Tarjetas"}
        </button>
      </div>

      {/* Vista Tarjetas / Tabla */}
      {vistaTarjetas ? (
        <MaterialesCard
          materiales={materialesFiltrados}
          onEdit={editarMaterial}
          onDelete={abrirEliminar}
          onVerDetalles={abrirDetalles}
        />
      ) : (
        <MaterialesTable
          materiales={materialesFiltrados}
          onEdit={editarMaterial}
          onDelete={abrirEliminar}
          onVerDetalles={abrirDetalles}
        />
      )}

      {vistaDetalle && materialSeleccionado && (
        <MaterialesDetails
          material={materialSeleccionado}
          onClose={cerrarDetalles}
          onEdit={editarMaterial}
          onDelete={abrirEliminar}
        />
      )}

      {mostrarFormulario && (
        <MaterialesForm
          onSubmit={guardarMaterial}
          onClose={cerrarFormulario}
          initialData={materialAEditar}
          isEdit={modoEdicion}
        />
      )}

      {mostrarEliminar && (
        <DeleteConfirmationModal
          isOpen={mostrarEliminar}
          onClose={cerrarEliminar}
          onConfirm={eliminarMaterial}
          itemName={materialAEliminar?.nombre_material || ""}
          loading={isDeleting}
        />
      )}
    </div>
  );
}

export default MaterialesPage;
