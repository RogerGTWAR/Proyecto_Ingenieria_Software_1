import { useState } from "react";

import DeleteConfirmationModal from "../components/ui/DeleteConfirmationModal";

import AvaluosCard from "../components/avaluos/AvaluosCard";
import AvaluosTable from "../components/avaluos/AvaluosTable";
import AvaluosDetails from "../components/avaluos/AvaluosDetails";
import AvaluosForm from "../components/avaluos/AvaluosForm";

import { useAvaluos } from "../hooks/useAvaluos";
import { useDetallesAvaluos } from "../hooks/useDetallesAvaluos";
import { useServicios } from "../hooks/useServicios";

function AvaluosPage() {
  const {
    items: avaluos,
    loading,
    add,
    edit,
    remove,
    reload,
  } = useAvaluos();

  const { reload: reloadDetalles } = useDetallesAvaluos();
  const { items: servicios, reload: reloadServicios } = useServicios();

  const [busqueda, setBusqueda] = useState("");
  const [vistaTarjetas, setVistaTarjetas] = useState(true);

  const [vistaDetalle, setVistaDetalle] = useState(false);
  const [avaluoSeleccionado, setAvaluoSeleccionado] = useState(null);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [avaluoAEditar, setAvaluoAEditar] = useState(null);

  const [mostrarEliminar, setMostrarEliminar] = useState(false);
  const [avaluoAEliminar, setAvaluoAEliminar] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const avaluosFiltrados = (avaluos || []).filter((a) => {
    const q = busqueda.toLowerCase();

    return (
      a.descripcion?.toLowerCase().includes(q) ||
      a.proyectoNombre?.toLowerCase().includes(q) ||
      String(a.proyectoId ?? "").includes(q)
    );
  });

  const abrirFormulario = () => {
    setAvaluoAEditar(null);
    setModoEdicion(false);
    setMostrarFormulario(true);
  };

  const editarAvaluo = (avaluo) => {
    setAvaluoAEditar(avaluo);
    setModoEdicion(true);
    setMostrarFormulario(true);
    setVistaDetalle(false);
  };

  const cerrarFormulario = () => {
    setMostrarFormulario(false);
    setAvaluoAEditar(null);
    setModoEdicion(false);
  };

  const guardarAvaluo = async (data) => {
    try {
      let avaluoGuardado;

      if (modoEdicion && avaluoAEditar) {
        avaluoGuardado = await edit(avaluoAEditar.id, data);
        setAvaluoSeleccionado(avaluoGuardado);
      } else {
        avaluoGuardado = await add(data);
      }

      if (!avaluoGuardado || !avaluoGuardado.id) {
        alert("No se pudo obtener el ID del avalúo guardado.");
        return null;
      }

      await reloadServicios();
      await reload();
      await reloadDetalles();

      return avaluoGuardado;
    } catch (error) {
      console.error("Error al guardar avalúo:", error);
      alert("No se pudo guardar el avalúo.");
      return null;
    }
  };

  const verDetalles = (avaluo) => {
    setAvaluoSeleccionado(avaluo);
    setVistaDetalle(true);
  };

  const cerrarDetalles = () => {
    setVistaDetalle(false);
    setAvaluoSeleccionado(null);
  };

  const abrirEliminar = (avaluo) => {
    setAvaluoAEliminar(avaluo);
    setMostrarEliminar(true);
  };

  const cerrarEliminar = () => {
    setMostrarEliminar(false);
    setAvaluoAEliminar(null);
  };

  const eliminarAvaluo = async () => {
    if (!avaluoAEliminar) return;

    setIsDeleting(true);

    try {
      await remove(avaluoAEliminar.id);
      await reload();
      await reloadDetalles();
      setVistaDetalle(false);
    } catch (e) {
      console.error("Error al eliminar avalúo:", e);
      alert("Error al eliminar el avalúo.");
    } finally {
      setIsDeleting(false);
      cerrarEliminar();
    }
  };

  const totalAvaluos = avaluos.length;

  const montoTotalEjecutado = avaluos.reduce(
    (acc, a) => acc + Number(a.montoEjecutado ?? 0),
    0
  );

  const totalDias = avaluos.reduce(
    (acc, a) => acc + Number(a.tiempoTotalDias ?? 0),
    0
  );

  const money = (value) => Number(value ?? 0).toLocaleString("es-NI");

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-slate-200 px-4">
        <div className="rounded-3xl border border-slate-300 bg-slate-100 px-8 py-6 text-center shadow-xl">
          <p className="text-sm font-bold text-slate-800">
            Cargando avalúos...
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
                <p className="text-sm font-medium text-cyan-100">
                  Avalúos
                </p>

                <h1 className="mt-1 text-sm font-bold tracking-tight text-white">
                  Gestión de avalúos
                </h1>

                <p className="mt-2 text-sm text-slate-300">
                  Control de avalúos, proyectos, servicios asociados y monto ejecutado.
                </p>
              </div>

              <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-3 xl:w-[520px]">
                <div className="rounded-2xl border border-white/10 bg-slate-900/50 px-4 py-3 text-left shadow-sm backdrop-blur xl:text-right">
                  <p className="text-sm font-medium text-cyan-100">
                    Avalúos
                  </p>

                  <p className="mt-1 text-sm font-bold text-white">
                    {totalAvaluos}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-900/50 px-4 py-3 text-left shadow-sm backdrop-blur xl:text-right">
                  <p className="text-sm font-medium text-cyan-100">
                    Monto ejecutado
                  </p>

                  <p className="mt-1 text-sm font-bold text-white">
                    C${money(montoTotalEjecutado)}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-900/50 px-4 py-3 text-left shadow-sm backdrop-blur xl:text-right">
                  <p className="text-sm font-medium text-cyan-100">
                    Días totales
                  </p>

                  <p className="mt-1 text-sm font-bold text-white">
                    {totalDias}
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
                Buscar avalúo
              </label>

              <input
                type="text"
                placeholder="Buscar por descripción, proyecto o ID..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-300
                  bg-slate-200
                  px-4
                  py-3
                  text-sm
                  text-slate-800
                  shadow-sm
                  outline-none
                  transition
                  placeholder:text-sm
                  placeholder:text-slate-500
                  focus:border-blue-600
                  focus:bg-white
                  focus:ring-4
                  focus:ring-blue-100
                "
              />
            </div>

            <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-end xl:w-auto">
              <div className="rounded-2xl border border-blue-200 bg-blue-100 px-4 py-3">
                <p className="text-sm font-semibold text-blue-700">
                  Resultados
                </p>

                <p className="mt-1 text-sm font-bold text-blue-900">
                  {avaluosFiltrados.length}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setVistaTarjetas(!vistaTarjetas)}
                className="
                  w-full
                  rounded-2xl
                  border
                  border-slate-400
                  bg-slate-200
                  px-5
                  py-3
                  text-sm
                  font-bold
                  text-slate-800
                  shadow-sm
                  transition
                  hover:bg-slate-300
                  sm:w-auto
                "
              >
                {vistaTarjetas ? "Ver como Tabla" : "Ver como Tarjetas"}
              </button>

              <button
                type="button"
                onClick={abrirFormulario}
                className="
                  w-full
                  rounded-2xl
                  bg-gradient-to-r
                  from-blue-800
                  to-cyan-700
                  px-5
                  py-3
                  text-sm
                  font-bold
                  text-white
                  shadow-lg
                  transition
                  hover:scale-[1.01]
                  hover:shadow-xl
                  sm:w-auto
                "
              >
                Añadir Avalúo
              </button>
            </div>
          </div>
        </section>

        <section className="flex min-h-0 w-full flex-1 flex-col overflow-hidden rounded-3xl border border-slate-300 bg-slate-100 p-3 shadow-md sm:p-5">
          <div className="mb-4 flex w-full shrink-0 flex-col gap-2 border-b border-slate-300 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Lista de avalúos
              </h2>

              <p className="mt-1 text-sm text-slate-600">
                Visualice, edite o elimine los avalúos registrados.
              </p>
            </div>

            <span className="w-fit rounded-full border border-slate-300 bg-slate-200 px-4 py-2 text-sm font-bold text-slate-700">
              {vistaTarjetas ? "Vista tarjetas" : "Vista tabla"}
            </span>
          </div>

          <div className="min-h-0 w-full flex-1 overflow-y-auto overflow-x-hidden pr-1">
            <div className="w-full min-w-0">
              {vistaTarjetas ? (
                <AvaluosCard
                  avaluos={avaluosFiltrados}
                  onEdit={editarAvaluo}
                  onDelete={abrirEliminar}
                  onVerDetalles={verDetalles}
                />
              ) : (
                <AvaluosTable
                  avaluos={avaluosFiltrados}
                  onEdit={editarAvaluo}
                  onDelete={abrirEliminar}
                  onVerDetalles={verDetalles}
                />
              )}
            </div>
          </div>
        </section>

        {vistaDetalle && avaluoSeleccionado && (
          <AvaluosDetails
            avaluo={avaluoSeleccionado}
            onClose={cerrarDetalles}
            onEdit={editarAvaluo}
            onDelete={abrirEliminar}
          />
        )}

        {mostrarFormulario && (
          <AvaluosForm
            onSubmit={guardarAvaluo}
            onClose={cerrarFormulario}
            initialData={avaluoAEditar}
            isEdit={modoEdicion}
            servicios={servicios}
          />
        )}

        {mostrarEliminar && (
          <DeleteConfirmationModal
            isOpen={mostrarEliminar}
            onClose={cerrarEliminar}
            onConfirm={eliminarAvaluo}
            itemName={avaluoAEliminar?.descripcion || ""}
            loading={isDeleting}
          />
        )}
      </div>
    </div>
  );
}

export default AvaluosPage;