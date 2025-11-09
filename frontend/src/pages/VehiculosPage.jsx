import { useState } from "react";
import ButtonList from "../components/ButtonList";
import DeleteConfirmationModal from "../components/ui/DeleteConfirmationModal";
import VehiculosCard from "../components/vehiculos/VehiculosCard";
import VehiculosDetails from "../components/vehiculos/VehiculosDetails";
import VehiculosForm from "../components/vehiculos/VehiculosForm";
import { useVehiculos } from "../hooks/useVehiculos";
import { useDetallesVehiculos } from "../hooks/useDetallesVehiculos";

function VehiculosPage() {
  const { items: vehiculos, loading, add, edit, remove, reload } = useVehiculos();
  const { reload: reloadDetalles } = useDetallesVehiculos();

  const [busqueda, setBusqueda] = useState("");
  const [vistaDetalle, setVistaDetalle] = useState(false);
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(null);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [vehiculoAEditar, setVehiculoAEditar] = useState(null);

  const [mostrarEliminar, setMostrarEliminar] = useState(false);
  const [vehiculoAEliminar, setVehiculoAEliminar] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const vehiculosFiltrados = (vehiculos || []).filter((v) =>
    v.placa?.toLowerCase().includes(busqueda.toLowerCase()) ||
    v.marca?.toLowerCase().includes(busqueda.toLowerCase()) ||
    v.modelo?.toLowerCase().includes(busqueda.toLowerCase())
  );

  const abrirFormulario = () => {
    setVehiculoAEditar(null);
    setModoEdicion(false);
    setMostrarFormulario(true);
  };

  const editarVehiculo = (vehiculo) => {
    setVehiculoAEditar(vehiculo);
    setModoEdicion(true);
    setMostrarFormulario(true);
    setVistaDetalle(false);
  };

  const cerrarFormulario = () => {
    setMostrarFormulario(false);
    setVehiculoAEditar(null);
    setModoEdicion(false);
  };

  const guardarVehiculo = async (data) => {
    try {
      let vehiculoGuardado;

      if (modoEdicion && vehiculoAEditar) {
        vehiculoGuardado = await edit(vehiculoAEditar.id, data);
        setVehiculoSeleccionado(vehiculoGuardado);
      } else {
        vehiculoGuardado = await add(data);
      }

      if (!vehiculoGuardado || !vehiculoGuardado.id) {
        console.error("❌ No se pudo obtener el ID del vehículo:", vehiculoGuardado);
        alert("No se pudo obtener el ID del vehículo guardado.");
        return null;
      }

      await reload();
      await reloadDetalles();
      return vehiculoGuardado;
    } catch (error) {
      console.error("❌ Error al guardar vehículo:", error);
      alert("No se pudo guardar el vehículo.");
      return null;
    }
  };

  const verDetalles = (vehiculo) => {
    setVehiculoSeleccionado(vehiculo);
    setVistaDetalle(true);
  };

  const cerrarDetalles = () => {
    setVistaDetalle(false);
    setVehiculoSeleccionado(null);
  };

  const abrirEliminar = (vehiculo) => {
    setVehiculoAEliminar(vehiculo);
    setMostrarEliminar(true);
  };

  const cerrarEliminar = () => {
    setMostrarEliminar(false);
    setVehiculoAEliminar(null);
  };

  const eliminarVehiculo = async () => {
    if (!vehiculoAEliminar) return;
    setIsDeleting(true);
    try {
      await remove(vehiculoAEliminar.id);
      await reload();
      setVistaDetalle(false);
    } catch (e) {
      console.error("Error al eliminar vehículo:", e);
      alert("Error al eliminar el vehículo.");
    } finally {
      setIsDeleting(false);
      cerrarEliminar();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-[var(--color-primary)] text-lg font-semibold">
        Cargando vehículos...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 relative">
      <h1 className="heading-1 text-[var(--color-primary)] mb-2">Vehículos</h1>
      <p className="body-1 text-[var(--color-gray)] mb-6">
        Gestión y control de vehículos asignados
      </p>

      <ButtonList
        buttons={[
          {
            id: "add",
            name: "Añadir Vehículo",
            icon: "/icons/add.svg",
            coordinate: 4,
            action: abrirFormulario,
          },
        ]}
      />

      <div className="bg-white rounded-xl shadow-sm p-4 mt-4 mb-6">
        <input
          type="text"
          placeholder="Buscar por placa, marca o modelo..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[var(--color-primary)]"
        />
      </div>

      <VehiculosCard
        vehiculos={vehiculosFiltrados}
        onEdit={editarVehiculo}
        onDelete={abrirEliminar}
        onVerDetalles={verDetalles}
      />

      {vistaDetalle && vehiculoSeleccionado && (
        <VehiculosDetails
          vehiculo={vehiculoSeleccionado}
          onClose={cerrarDetalles}
          onEdit={editarVehiculo}
          onDelete={abrirEliminar}
        />
      )}

      {mostrarFormulario && (
        <VehiculosForm
          onSubmit={guardarVehiculo}
          onClose={cerrarFormulario}
          initialData={vehiculoAEditar}
          isEdit={modoEdicion}
        />
      )}

      {mostrarEliminar && (
        <DeleteConfirmationModal
          isOpen={mostrarEliminar}
          onClose={cerrarEliminar}
          onConfirm={eliminarVehiculo}
          itemName={vehiculoAEliminar?.placa || ""}
          loading={isDeleting}
        />
      )}
    </div>
  );
}

export default VehiculosPage;
