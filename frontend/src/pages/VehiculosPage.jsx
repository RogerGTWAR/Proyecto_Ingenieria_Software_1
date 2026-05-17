import { useState } from "react";
import DeleteConfirmationModal from "../components/ui/DeleteConfirmationModal";

import VehiculosCard from "../components/vehiculos/VehiculosCard";
import VehiculosTable from "../components/vehiculos/VehiculosTable";
import VehiculosDetails from "../components/vehiculos/VehiculosDetails";
import VehiculosForm from "../components/vehiculos/VehiculosForm";

import { useVehiculos } from "../hooks/useVehiculos";
import { useDetallesVehiculos } from "../hooks/useDetallesVehiculos";

function VehiculosPage() {
  const { items: vehiculos, loading, add, edit, remove, reload } = useVehiculos();
  const { reload: reloadDetalles } = useDetallesVehiculos();

  const [busqueda, setBusqueda] = useState("");
  const [vistaTarjetas, setVistaTarjetas] = useState(true);

  const [vistaDetalle, setVistaDetalle] = useState(false);
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(null);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [vehiculoAEditar, setVehiculoAEditar] = useState(null);

  const [mostrarEliminar, setMostrarEliminar] = useState(false);
  const [vehiculoAEliminar, setVehiculoAEliminar] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const vehiculosFiltrados = (vehiculos || []).filter((v) => {
    const q = busqueda.toLowerCase();

    return (
      v.placa?.toLowerCase().includes(q) ||
      v.marca?.toLowerCase().includes(q) ||
      v.modelo?.toLowerCase().includes(q)
    );
  });

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

      if (!vehiculoGuardado?.id) {
        alert("No se pudo obtener el ID del vehículo guardado.");
        return null;
      }

      await reload();
      await reloadDetalles();

      return vehiculoGuardado;
    } catch (error) {
      console.error("Error al guardar vehículo:", error);
      alert("Error al guardar el vehículo.");
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
    } catch (error) {
      console.error("Error al eliminar vehículo:", error);
      alert("No se pudo eliminar el vehículo.");
    } finally {
      setIsDeleting(false);
      cerrarEliminar();
    }
  };

  const totalVehiculos = vehiculos.length;

  const disponibles = vehiculos.filter(
    (v) => v.estado === "Disponible"
  ).length;

  const mantenimiento = vehiculos.filter(
    (v) => v.estado === "En Mantenimiento"
  ).length;

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-slate-200 px-4">
        <div className="rounded-3xl border border-slate-300 bg-slate-100 px-8 py-6 text-center shadow-xl">
          <p className="text-sm font-bold text-slate-800">
            Cargando vehículos...
          </p>

          <p className="mt-1 text-sm text-slate-600">
            Espere un momento mientras se cargan los datos.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full min-w-0 overflow-hidden bg-slate-200 px-3 py-4 sm:px-5 lg:px-8">
      <div className="flex h-full w-full min-w-0 flex-col gap-5 overflow-hidden">
        <section className="w-full shrink-0 overflow-hidden rounded-3xl border border-slate-700/40 bg-slate-900 shadow-xl">
          <div className="w-full bg-gradient-to-r from-slate-950 via-blue-950 to-cyan-900 px-5 py-5 text-white sm:px-7 lg:px-8">
            <div className="flex w-full flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-cyan-100">Vehículos</p>

                <h1 className="mt-1 text-sm font-bold tracking-tight text-white">
                  Gestión de vehículos
                </h1>

                <p className="mt-2 text-sm text-slate-300">
                  Control de vehículos, proveedores, estados y asignaciones de empleados.
                </p>
              </div>

              <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-3 xl:w-[520px]">
                <div className="rounded-2xl border border-white/10 bg-slate-900/50 px-4 py-3 text-left shadow-sm backdrop-blur xl:text-right">
                  <p className="text-sm font-medium text-cyan-100">
                    Vehículos
                  </p>
                  <p className="mt-1 text-sm font-bold text-white">
                    {totalVehiculos}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-900/50 px-4 py-3 text-left shadow-sm backdrop-blur xl:text-right">
                  <p className="text-sm font-medium text-cyan-100">
                    Disponibles
                  </p>
                  <p className="mt-1 text-sm font-bold text-white">
                    {disponibles}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-900/50 px-4 py-3 text-left shadow-sm backdrop-blur xl:text-right">
                  <p className="text-sm font-medium text-cyan-100">
                    Mantenimiento
                  </p>
                  <p className="mt-1 text-sm font-bold text-white">
                    {mantenimiento}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full shrink-0 rounded-3xl border border-slate-300 bg-slate-100 p-4 shadow-md sm:p-5">
          <div className="flex w-full flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div className="w-full min-w-0 xl:flex-1">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Buscar vehículo
              </label>

              <input
                type="text"
                placeholder="Buscar por placa, marca o modelo..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-slate-200 px-4 py-3 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-sm placeholder:text-slate-500 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-end xl:w-auto">
              <div className="rounded-2xl border border-blue-200 bg-blue-100 px-4 py-3">
                <p className="text-sm font-semibold text-blue-700">
                  Resultados
                </p>
                <p className="mt-1 text-sm font-bold text-blue-900">
                  {vehiculosFiltrados.length}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setVistaTarjetas(!vistaTarjetas)}
                className="w-full rounded-2xl border border-slate-400 bg-slate-200 px-5 py-3 text-sm font-bold text-slate-800 shadow-sm transition hover:bg-slate-300 sm:w-auto"
              >
                {vistaTarjetas ? "Ver como Tabla" : "Ver como Tarjetas"}
              </button>

              <button
                type="button"
                onClick={abrirFormulario}
                className="w-full rounded-2xl bg-gradient-to-r from-blue-800 to-cyan-700 px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:scale-[1.01] hover:shadow-xl sm:w-auto"
              >
                Añadir Vehículo
              </button>
            </div>
          </div>
        </section>

        <section className="flex min-h-0 w-full flex-1 flex-col overflow-hidden rounded-3xl border border-slate-300 bg-slate-100 p-3 shadow-md sm:p-5">
          <div className="mb-4 flex w-full shrink-0 flex-col gap-2 border-b border-slate-300 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Lista de vehículos
              </h2>

              <p className="mt-1 text-sm text-slate-600">
                Visualice, edite o elimine los vehículos registrados.
              </p>
            </div>

            <span className="w-fit rounded-full border border-slate-300 bg-slate-200 px-4 py-2 text-sm font-bold text-slate-700">
              {vistaTarjetas ? "Vista tarjetas" : "Vista tabla"}
            </span>
          </div>

          <div className="min-h-0 w-full flex-1 overflow-y-auto overflow-x-hidden pr-1">
            <div className="w-full min-w-0">
              {vistaTarjetas ? (
                <VehiculosCard
                  vehiculos={vehiculosFiltrados}
                  onEdit={editarVehiculo}
                  onDelete={abrirEliminar}
                  onVerDetalles={verDetalles}
                />
              ) : (
                <VehiculosTable
                  vehiculos={vehiculosFiltrados}
                  onEdit={editarVehiculo}
                  onDelete={abrirEliminar}
                  onVerDetalles={verDetalles}
                />
              )}
            </div>
          </div>
        </section>

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
    </div>
  );
}

export default VehiculosPage;