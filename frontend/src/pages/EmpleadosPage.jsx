import { useMemo, useState } from "react";

import EmpleadosCard from "../components/empleados/EmpleadosCard";
import EmpleadosTable from "../components/empleados/EmpleadosTable";
import EmpleadosDetails from "../components/empleados/EmpleadosDetails";
import EmpleadosForm from "../components/empleados/EmpleadosForm";

import DeleteConfirmationModal from "../components/ui/DeleteConfirmationModal";

import { useEmpleados } from "../hooks/useEmpleados";
import useRoles from "../hooks/useRoles";

const normalize = (s = "") =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

function EmpleadosPage() {
  const { items: empleados, loading, add, edit, remove } = useEmpleados();
  const { items: roles } = useRoles();

  const rolNameById = useMemo(
    () => Object.fromEntries(roles.map((r) => [Number(r.id), r.nombre])),
    [roles]
  );

  const [busqueda, setBusqueda] = useState("");
  const [filtroRol, setFiltroRol] = useState("all");
  const [vistaTarjetas, setVistaTarjetas] = useState(true);

  const [vistaDetalle, setVistaDetalle] = useState(false);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [empleadoAEditar, setEmpleadoAEditar] = useState(null);

  const [mostrarEliminar, setMostrarEliminar] = useState(false);
  const [empleadoAEliminar, setEmpleadoAEliminar] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const empleadosFiltrados = (empleados || []).filter((e) => {
    const q = busqueda.toLowerCase();

    const coincideBusqueda =
      e.nombres.toLowerCase().includes(q) ||
      e.apellidos.toLowerCase().includes(q);

    const coincideRol =
      filtroRol === "all" || Number(e.rolId) === Number(filtroRol);

    return coincideBusqueda && coincideRol;
  });

  const obtenerColorRol = (rolNombre) => {
    const key = normalize(rolNombre);

    const colores = {
      gerente: "bg-blue-100 text-blue-800",
      contador: "bg-green-100 text-green-800",
      asistente: "bg-yellow-100 text-yellow-800",
      ingeniero: "bg-purple-100 text-purple-800",
      recursos: "bg-pink-100 text-pink-800",
    };

    return colores[key] || "bg-gray-100 text-gray-800";
  };

  const abrirFormulario = () => {
    setEmpleadoAEditar(null);
    setModoEdicion(false);
    setMostrarFormulario(true);
  };

  const editarEmpleado = (empleado) => {
    setEmpleadoAEditar(empleado);
    setModoEdicion(true);
    setMostrarFormulario(true);
    setVistaDetalle(false);
  };

  const cerrarFormulario = () => {
    setMostrarFormulario(false);
    setEmpleadoAEditar(null);
    setModoEdicion(false);
  };

  const guardarEmpleado = async (data) => {
    try {
      const datosFormateados = {
        nombres: data.nombres,
        apellidos: data.apellidos,
        cedula: data.cedula,
        correo: data.correo,
        telefono: data.telefono,
        pais: data.pais,
        direccion: data.direccion,
        fecha_nacimiento: data.fecha_nacimiento
          ? new Date(data.fecha_nacimiento).toISOString()
          : null,
        fecha_contratacion: data.fecha_contratacion
          ? new Date(data.fecha_contratacion).toISOString()
          : null,
        rol_id: Number(data.rolId),
      };

      if (modoEdicion && empleadoAEditar) {
        const actualizado = await edit(empleadoAEditar.id, datosFormateados);
        console.log("Empleado actualizado correctamente");

        if (vistaDetalle && empleadoSeleccionado?.id === empleadoAEditar.id) {
          setEmpleadoSeleccionado(actualizado);
        }
      } else {
        await add(datosFormateados);
        console.log("Empleado agregado correctamente");
      }

      cerrarFormulario();
    } catch (error) {
      console.error("Error al guardar empleado:", error);
    }
  };

  const eliminarEmpleado = async () => {
    if (!empleadoAEliminar) return;

    setIsDeleting(true);

    await remove(empleadoAEliminar.id);

    setIsDeleting(false);
    setMostrarEliminar(false);
    setEmpleadoAEliminar(null);
    cerrarDetalles();
  };

  const verDetalles = (empleado) => {
    setEmpleadoSeleccionado(empleado);
    setVistaDetalle(true);
  };

  const cerrarDetalles = () => {
    setVistaDetalle(false);
    setEmpleadoSeleccionado(null);
  };

  const abrirEliminar = (empleado) => {
    setEmpleadoAEliminar(empleado);
    setMostrarEliminar(true);
  };

  const cerrarEliminar = () => {
    setMostrarEliminar(false);
    setEmpleadoAEliminar(null);
  };

  const totalEmpleados = empleados.length;

  const empleadosActivos = empleados.filter(
    (e) => (e.estado || "Activo") === "Activo"
  ).length;

  const totalRoles = roles.length;

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-slate-200 px-4">
        <div className="rounded-3xl border border-slate-300 bg-slate-100 px-8 py-6 text-center shadow-xl">
          <p className="text-sm font-bold text-slate-800">
            Cargando empleados...
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
                  Empleados
                </p>

                <h1 className="mt-1 text-sm font-bold tracking-tight text-white">
                  Gestión de empleados
                </h1>

                <p className="mt-2 text-sm text-slate-300">
                  Administración del personal, roles, datos laborales y estado de los empleados.
                </p>
              </div>

              <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-3 xl:w-[520px]">
                <div className="rounded-2xl border border-white/10 bg-slate-900/50 px-4 py-3 text-left shadow-sm backdrop-blur xl:text-right">
                  <p className="text-sm font-medium text-cyan-100">
                    Empleados
                  </p>

                  <p className="mt-1 text-sm font-bold text-white">
                    {totalEmpleados}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-900/50 px-4 py-3 text-left shadow-sm backdrop-blur xl:text-right">
                  <p className="text-sm font-medium text-cyan-100">
                    Activos
                  </p>

                  <p className="mt-1 text-sm font-bold text-white">
                    {empleadosActivos}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-900/50 px-4 py-3 text-left shadow-sm backdrop-blur xl:text-right">
                  <p className="text-sm font-medium text-cyan-100">
                    Roles
                  </p>

                  <p className="mt-1 text-sm font-bold text-white">
                    {totalRoles}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full shrink-0 rounded-3xl border border-slate-300 bg-slate-100 p-4 shadow-md sm:p-5">
          <div className="flex w-full flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 xl:flex-1">
              <div className="min-w-0">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Buscar empleado
                </label>

                <input
                  type="text"
                  placeholder="Buscar por nombre o apellido..."
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

              <div className="min-w-0">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Filtrar por rol
                </label>

                <select
                  value={filtroRol}
                  onChange={(e) => setFiltroRol(e.target.value)}
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
                    focus:border-blue-600
                    focus:bg-white
                    focus:ring-4
                    focus:ring-blue-100
                  "
                >
                  <option value="all">Todos los roles</option>

                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-end xl:w-auto">
              <div className="rounded-2xl border border-blue-200 bg-blue-100 px-4 py-3">
                <p className="text-sm font-semibold text-blue-700">
                  Resultados
                </p>

                <p className="mt-1 text-sm font-bold text-blue-900">
                  {empleadosFiltrados.length}
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
                Añadir Empleado
              </button>
            </div>
          </div>
        </section>

        <section className="flex min-h-0 w-full flex-1 flex-col overflow-hidden rounded-3xl border border-slate-300 bg-slate-100 p-3 shadow-md sm:p-5">
          <div className="mb-4 flex w-full shrink-0 flex-col gap-2 border-b border-slate-300 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Lista de empleados
              </h2>

              <p className="mt-1 text-sm text-slate-600">
                Visualice, edite o elimine los empleados registrados.
              </p>
            </div>

            <span className="w-fit rounded-full border border-slate-300 bg-slate-200 px-4 py-2 text-sm font-bold text-slate-700">
              {vistaTarjetas ? "Vista tarjetas" : "Vista tabla"}
            </span>
          </div>

          <div className="min-h-0 w-full flex-1 overflow-y-auto overflow-x-hidden pr-1">
            <div className="w-full min-w-0">
              {vistaTarjetas ? (
                <EmpleadosCard
                  empleados={empleadosFiltrados}
                  rolNameById={rolNameById}
                  obtenerColorRol={obtenerColorRol}
                  onEdit={editarEmpleado}
                  onDelete={abrirEliminar}
                  onVerDetalles={verDetalles}
                />
              ) : (
                <EmpleadosTable
                  empleados={empleadosFiltrados}
                  rolNameById={rolNameById}
                  obtenerColorRol={obtenerColorRol}
                  onEdit={editarEmpleado}
                  onDelete={abrirEliminar}
                  onVerDetalles={verDetalles}
                />
              )}
            </div>
          </div>
        </section>

        {vistaDetalle && (
          <EmpleadosDetails
            empleado={empleadoSeleccionado}
            onClose={cerrarDetalles}
            onEdit={editarEmpleado}
            onDelete={abrirEliminar}
            rolNameById={rolNameById}
          />
        )}

        {mostrarFormulario && (
          <EmpleadosForm
            onSubmit={guardarEmpleado}
            onClose={cerrarFormulario}
            initialData={empleadoAEditar}
            isEdit={modoEdicion}
            roles={roles}
          />
        )}

        {mostrarEliminar && (
          <DeleteConfirmationModal
            isOpen={mostrarEliminar}
            onClose={cerrarEliminar}
            onConfirm={eliminarEmpleado}
            itemName={
              empleadoAEliminar
                ? `${empleadoAEliminar.nombres} ${empleadoAEliminar.apellidos}`
                : ""
            }
            loading={isDeleting}
          />
        )}
      </div>
    </div>
  );
}

export default EmpleadosPage;