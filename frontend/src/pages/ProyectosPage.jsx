import { useState } from "react";

import DeleteConfirmationModal from "../components/ui/DeleteConfirmationModal";

import ProyectosCard from "../components/proyectos/ProyectosCard";
import ProyectosDetails from "../components/proyectos/ProyectosDetails";
import ProyectosForm from "../components/proyectos/ProyectosForm";
import ProyectosTable from "../components/proyectos/ProyectosTable";

import { useProyectos } from "../hooks/useProyectos";
import { useDetallesEmpleados } from "../hooks/useDetallesEmpleados";

function ProyectosPage() {
  const { items: proyectos, loading, add, edit, remove, reload } = useProyectos();
  const { reload: reloadDetalles } = useDetallesEmpleados();

  const [busqueda, setBusqueda] = useState("");
  const [vistaTarjetas, setVistaTarjetas] = useState(true);

  const [vistaDetalle, setVistaDetalle] = useState(false);
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [proyectoAEditar, setProyectoAEditar] = useState(null);

  const [mostrarEliminar, setMostrarEliminar] = useState(false);
  const [proyectoAEliminar, setProyectoAEliminar] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const proyectosFiltrados = (proyectos || []).filter((p) => {
    const q = busqueda.toLowerCase();

    return (
      p.nombreProyecto?.toLowerCase().includes(q) ||
      p.clienteNombre?.toLowerCase().includes(q) ||
      p.ubicacion?.toLowerCase().includes(q) ||
      p.estado?.toLowerCase().includes(q)
    );
  });

  const abrirFormulario = () => {
    setProyectoAEditar(null);
    setModoEdicion(false);
    setMostrarFormulario(true);
  };

  const editarProyecto = (proyecto) => {
    setProyectoAEditar(proyecto);
    setModoEdicion(true);
    setMostrarFormulario(true);
    setVistaDetalle(false);
  };

  const cerrarFormulario = () => {
    setMostrarFormulario(false);
    setProyectoAEditar(null);
    setModoEdicion(false);
  };

  const guardarProyecto = async (data) => {
    try {
      let proyectoGuardado;

      if (modoEdicion && proyectoAEditar) {
        proyectoGuardado = await edit(proyectoAEditar.id, data);
        setProyectoSeleccionado(proyectoGuardado);
      } else {
        proyectoGuardado = await add(data);
      }

      if (!proyectoGuardado || !proyectoGuardado.id) {
        alert("No se pudo obtener el ID del proyecto guardado.");
        return null;
      }

      await reload();
      await reloadDetalles();

      return proyectoGuardado;
    } catch (error) {
      console.error("Error al guardar proyecto:", error);
      alert("No se pudo guardar el proyecto.");
      return null;
    }
  };

  const verDetalles = (proyecto) => {
    setProyectoSeleccionado(proyecto);
    setVistaDetalle(true);
  };

  const cerrarDetalles = () => {
    setVistaDetalle(false);
    setProyectoSeleccionado(null);
  };

  const abrirEliminar = (proyecto) => {
    setProyectoAEliminar(proyecto);
    setMostrarEliminar(true);
  };

  const cerrarEliminar = () => {
    setMostrarEliminar(false);
    setProyectoAEliminar(null);
  };

  const eliminarProyecto = async () => {
    if (!proyectoAEliminar) return;

    setIsDeleting(true);

    try {
      await remove(proyectoAEliminar.id);
      await reload();
      await reloadDetalles();
      setVistaDetalle(false);
    } catch (e) {
      console.error("Error al eliminar proyecto:", e);
      alert("Error al eliminar el proyecto.");
    } finally {
      setIsDeleting(false);
      cerrarEliminar();
    }
  };

  const estadosValidosParaDinero = ["Activo", "En Espera", "Completado"];

  const proyectosParaEstadisticasDinero = proyectos.filter((p) =>
    estadosValidosParaDinero.includes(p.estado)
  );

  const totalProyectos = proyectos.length;

  const proyectosActivos = proyectos.filter(
    (p) => p.estado === "Activo"
  ).length;

  const presupuestoValido = proyectosParaEstadisticasDinero.reduce(
    (acc, p) => acc + Number(p.presupuestoTotal ?? 0),
    0
  );

  const money = (value) => Number(value ?? 0).toLocaleString("es-NI");

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-slate-200 px-4">
        <div className="rounded-3xl border border-slate-300 bg-slate-100 px-8 py-6 text-center shadow-xl">
          <p className="text-sm font-bold text-slate-800">
            Cargando proyectos...
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
                  Proyectos
                </p>

                <h1 className="mt-1 text-sm font-bold tracking-tight text-white">
                  Gestión de proyectos
                </h1>

                <p className="mt-2 text-sm text-slate-300">
                  Control de proyectos, clientes, presupuestos, estados y personal asignado.
                </p>
              </div>

              <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-3 xl:w-[520px]">
                <div className="rounded-2xl border border-white/10 bg-slate-900/50 px-4 py-3 text-left shadow-sm backdrop-blur xl:text-right">
                  <p className="text-sm font-medium text-cyan-100">
                    Proyectos
                  </p>

                  <p className="mt-1 text-sm font-bold text-white">
                    {totalProyectos}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-900/50 px-4 py-3 text-left shadow-sm backdrop-blur xl:text-right">
                  <p className="text-sm font-medium text-cyan-100">
                    Activos
                  </p>

                  <p className="mt-1 text-sm font-bold text-white">
                    {proyectosActivos}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-900/50 px-4 py-3 text-left shadow-sm backdrop-blur xl:text-right">
                  <p className="text-sm font-medium text-cyan-100">
                    Presupuesto válido
                  </p>

                  <p className="mt-1 text-sm font-bold text-white">
                    C${money(presupuestoValido)}
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
                Buscar proyecto
              </label>

              <input
                type="text"
                placeholder="Buscar por proyecto, cliente, ubicación o estado..."
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
                  {proyectosFiltrados.length}
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
                Añadir Proyecto
              </button>
            </div>
          </div>
        </section>

        <section className="flex min-h-0 w-full flex-1 flex-col overflow-hidden rounded-3xl border border-slate-300 bg-slate-100 p-3 shadow-md sm:p-5">
          <div className="mb-4 flex w-full shrink-0 flex-col gap-2 border-b border-slate-300 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Lista de proyectos
              </h2>

              <p className="mt-1 text-sm text-slate-600">
                Visualice, edite o elimine los proyectos registrados.
              </p>
            </div>

            <span className="w-fit rounded-full border border-slate-300 bg-slate-200 px-4 py-2 text-sm font-bold text-slate-700">
              {vistaTarjetas ? "Vista tarjetas" : "Vista tabla"}
            </span>
          </div>

          <div className="min-h-0 w-full flex-1 overflow-y-auto overflow-x-hidden pr-1">
            <div className="w-full min-w-0">
              {vistaTarjetas ? (
                <ProyectosCard
                  proyectos={proyectosFiltrados}
                  onEdit={editarProyecto}
                  onDelete={abrirEliminar}
                  onVerDetalles={verDetalles}
                />
              ) : (
                <ProyectosTable
                  proyectos={proyectosFiltrados}
                  onEdit={editarProyecto}
                  onDelete={abrirEliminar}
                  onVerDetalles={verDetalles}
                />
              )}
            </div>
          </div>
        </section>

        {vistaDetalle && proyectoSeleccionado && (
          <ProyectosDetails
            proyecto={proyectoSeleccionado}
            onClose={cerrarDetalles}
            onEdit={editarProyecto}
            onDelete={abrirEliminar}
          />
        )}

        {mostrarFormulario && (
          <ProyectosForm
            onSubmit={guardarProyecto}
            onClose={cerrarFormulario}
            initialData={proyectoAEditar}
            isEdit={modoEdicion}
          />
        )}

        {mostrarEliminar && (
          <DeleteConfirmationModal
            isOpen={mostrarEliminar}
            onClose={cerrarEliminar}
            onConfirm={eliminarProyecto}
            itemName={proyectoAEliminar?.nombreProyecto || ""}
            loading={isDeleting}
          />
        )}
      </div>
    </div>
  );
}

export default ProyectosPage;