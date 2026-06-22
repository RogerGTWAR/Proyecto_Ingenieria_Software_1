import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import EmpleadosCard from "../components/empleados/EmpleadosCard";
import EmpleadosTable from "../components/empleados/EmpleadosTable";
import EmpleadosDetails from "../components/empleados/EmpleadosDetails";
import EmpleadosForm from "../components/empleados/EmpleadosForm";

import DeleteConfirmationModal from "../components/ui/DeleteConfirmationModal";

import { useEmpleados } from "../hooks/useEmpleados";
import { useDetallesEmpleados } from "../hooks/useDetallesEmpleados";
import useRoles from "../hooks/useRoles";

const normalize = (s = "") =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

const flujoModulos = [
  {
    id: "empleados",
    orden: "01",
    nombre: "Empleados",
    ruta: "/empleados",
    descripcion: "Personal del sistema",
  },
  {
    id: "clientes",
    orden: "02",
    nombre: "Clientes",
    ruta: "/clientes",
    descripcion: "Empresas o contactos",
  },
  {
    id: "proyectos",
    orden: "03",
    nombre: "Proyectos",
    ruta: "/proyectos",
    descripcion: "Trabajos asociados",
  },
  {
    id: "inventario",
    orden: "04",
    nombre: "Inventario",
    ruta: "/materiales",
    descripcion: "Materiales disponibles",
  },
  {
    id: "proveedores",
    orden: "05",
    nombre: "Proveedores",
    ruta: "/proveedores",
    descripcion: "Abastecimiento",
  },
  {
    id: "compras",
    orden: "06",
    nombre: "Compras",
    ruta: "/compras",
    descripcion: "Facturas y entradas",
  },
  {
    id: "servicios",
    orden: "07",
    nombre: "Servicios",
    ruta: "/servicios",
    descripcion: "Costos y ventas",
  },
  {
    id: "avaluos",
    orden: "08",
    nombre: "Avalúos",
    ruta: "/avaluos",
    descripcion: "Ejecución del proyecto",
  },
];

function EmpleadosPage() {
  const { items: empleados, loading, add, edit, remove } = useEmpleados();

  const {
    items: detallesEmpleados,
    reload: reloadDetallesEmpleados,
  } = useDetallesEmpleados();

  const { items: roles } = useRoles();

  const rolNameById = useMemo(
    () => Object.fromEntries(roles.map((r) => [Number(r.id), r.nombre])),
    [roles]
  );

  const [busqueda, setBusqueda] = useState("");
  const [filtroRol, setFiltroRol] = useState("all");
  const [vistaTarjetas, setVistaTarjetas] = useState(false);
  const [mostrarFlujo, setMostrarFlujo] = useState(false);

  const [vistaDetalle, setVistaDetalle] = useState(false);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [empleadoAEditar, setEmpleadoAEditar] = useState(null);

  const [mostrarEliminar, setMostrarEliminar] = useState(false);
  const [empleadoAEliminar, setEmpleadoAEliminar] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [modalMensaje, setModalMensaje] = useState({
    open: false,
    type: "success",
    title: "",
    message: "",
  });

  const mostrarMensaje = (type, title, message) => {
    setModalMensaje({
      open: true,
      type,
      title,
      message,
    });
  };

  const cerrarMensaje = () => {
    setModalMensaje({
      open: false,
      type: "success",
      title: "",
      message: "",
    });
  };

  const empleadosFiltrados = (empleados || []).filter((e) => {
    const q = busqueda.toLowerCase();

    const nombres = e.nombres?.toLowerCase() ?? "";
    const apellidos = e.apellidos?.toLowerCase() ?? "";
    const cedula = e.cedula?.toLowerCase() ?? "";
    const correo = e.correo?.toLowerCase() ?? "";
    const telefono = e.telefono?.toLowerCase() ?? "";

    const coincideBusqueda =
      nombres.includes(q) ||
      apellidos.includes(q) ||
      cedula.includes(q) ||
      correo.includes(q) ||
      telefono.includes(q);

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
        reportes: data.reportes ? Number(data.reportes) : null,
      };

      if (modoEdicion && empleadoAEditar) {
        const actualizado = await edit(empleadoAEditar.id, datosFormateados);

        if (vistaDetalle && empleadoSeleccionado?.id === empleadoAEditar.id) {
          setEmpleadoSeleccionado(actualizado);
        }

        mostrarMensaje(
          "success",
          "Empleado actualizado",
          "El empleado se actualizó correctamente."
        );
      } else {
        await add(datosFormateados);

        mostrarMensaje(
          "success",
          "Empleado creado",
          "El empleado se registró correctamente."
        );
      }

      cerrarFormulario();
    } catch (error) {
      mostrarMensaje(
        "error",
        "Error al guardar empleado",
        error.message || "No se pudo guardar el empleado."
      );
    }
  };

  const eliminarEmpleado = async () => {
    if (!empleadoAEliminar) return;

    setIsDeleting(true);

    try {
      const detallesActualizados = await reloadDetallesEmpleados();

      const listaDetalles = Array.isArray(detallesActualizados)
        ? detallesActualizados
        : detallesEmpleados;

      const proyectosAsociados = listaDetalles.filter(
        (d) => Number(d.empleadoId) === Number(empleadoAEliminar.id)
      );

      if (proyectosAsociados.length > 0) {
        const proyectosTexto = proyectosAsociados
          .map((d) => d.proyectoNombre || `Proyecto ${d.proyectoId}`)
          .filter(Boolean)
          .slice(0, 5)
          .join(", ");

        setMostrarEliminar(false);
        setEmpleadoAEliminar(null);

        mostrarMensaje(
          "error",
          "No se puede eliminar el empleado",
          `No se puede eliminar el empleado "${empleadoAEliminar.nombres} ${empleadoAEliminar.apellidos}" porque tiene ${proyectosAsociados.length} proyecto(s) asociado(s).

Proyecto(s): ${proyectosTexto || "Proyecto asociado"}

Primero quite al empleado de los proyectos relacionados y luego intente eliminarlo nuevamente.`
        );

        return;
      }

      await remove(empleadoAEliminar.id);

      mostrarMensaje(
        "success",
        "Empleado eliminado",
        "El empleado se eliminó correctamente."
      );

      setMostrarEliminar(false);
      setEmpleadoAEliminar(null);
      cerrarDetalles();
    } catch (error) {
      setMostrarEliminar(false);
      setEmpleadoAEliminar(null);

      mostrarMensaje(
        "error",
        "Error al eliminar empleado",
        error.message || "No se pudo eliminar el empleado."
      );
    } finally {
      setIsDeleting(false);
    }
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
  const totalRoles = roles.length;

  if (loading) {
    return (
      <div className="flex h-[calc(100dvh-64px)] w-full items-center justify-center overflow-y-auto bg-slate-200 px-3 sm:px-4">
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
    <div className="h-[calc(100dvh-64px)] w-full overflow-y-auto overflow-x-hidden bg-slate-200 px-3 py-4 sm:px-4 lg:px-5 xl:px-6">
      <div className="flex min-h-full w-full min-w-0 flex-col gap-5 pb-8">
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
                  Administración del personal, roles y datos laborales de los empleados.
                </p>
              </div>

              <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-3 xl:w-[520px]">
                <HeaderBox label="Empleados" value={totalEmpleados} />
                <HeaderBox label="Roles" value={totalRoles} />
                <HeaderBox
                  label="Resultados"
                  value={empleadosFiltrados.length}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="w-full shrink-0 rounded-3xl border border-slate-300 bg-slate-100 p-4 shadow-md sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Navegación del módulo
              </h2>

              <p className="mt-1 text-sm text-slate-600">
                Puedes mostrar u ocultar el flujo recomendado del sistema.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setMostrarFlujo((prev) => !prev)}
              className={`
                w-full rounded-2xl px-5 py-3 text-sm font-bold shadow-md transition
                hover:scale-[1.01] sm:w-auto
                ${
                  mostrarFlujo
                    ? "border border-slate-400 bg-slate-200 text-slate-800 hover:bg-slate-300"
                    : "bg-gradient-to-r from-blue-800 to-cyan-700 text-white hover:shadow-xl"
                }
              `}
            >
              {mostrarFlujo ? "Ocultar flujo" : "Mostrar flujo"}
            </button>
          </div>
        </section>

        {mostrarFlujo && <FlujoModulo activo="empleados" />}

        <section className="w-full shrink-0 rounded-3xl border border-slate-300 bg-slate-100 p-4 shadow-md sm:p-5">
          <div className="flex w-full flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 xl:flex-1">
              <div className="min-w-0">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Buscar empleado
                </label>

                <input
                  type="text"
                  placeholder="Buscar por nombre, apellido, cédula, correo o teléfono..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="
                    w-full rounded-xl border border-slate-300 bg-slate-200
                    px-4 py-3 text-sm text-slate-800 shadow-sm outline-none
                    transition placeholder:text-sm placeholder:text-slate-500
                    focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100
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
                    w-full rounded-xl border border-slate-300 bg-slate-200
                    px-4 py-3 text-sm text-slate-800 shadow-sm outline-none
                    transition focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100
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
                  w-full rounded-2xl border border-slate-400 bg-slate-200
                  px-5 py-3 text-sm font-bold text-slate-800 shadow-sm
                  transition hover:bg-slate-300 sm:w-auto
                "
              >
                {vistaTarjetas ? "Ver como Tabla" : "Ver como Tarjetas"}
              </button>

              <button
                type="button"
                onClick={abrirFormulario}
                className="
                  w-full rounded-2xl bg-gradient-to-r from-blue-800 to-cyan-700
                  px-5 py-3 text-sm font-bold text-white shadow-lg transition
                  hover:scale-[1.01] hover:shadow-xl sm:w-auto
                "
              >
                Añadir Empleado
              </button>
            </div>
          </div>
        </section>

        <section className="flex min-h-[520px] w-full flex-col overflow-hidden rounded-3xl border border-slate-300 bg-slate-100 p-3 shadow-md sm:p-5">
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

        {modalMensaje.open && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/60 px-4 backdrop-blur-sm">
            <div
              className={`
                w-full max-w-md overflow-hidden rounded-3xl border bg-white shadow-2xl
                ${
                  modalMensaje.type === "error"
                    ? "border-red-200"
                    : "border-emerald-200"
                }
              `}
            >
              <div className="px-6 py-6">
                <div className="flex items-start gap-4">
                  <div
                    className={`
                      flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl font-black
                      ${
                        modalMensaje.type === "error"
                          ? "bg-red-100 text-red-600"
                          : "bg-emerald-100 text-emerald-600"
                      }
                    `}
                  >
                    {modalMensaje.type === "error" ? "!" : "✓"}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-black text-slate-900">
                      {modalMensaje.title}
                    </h3>

                    <p className="mt-2 whitespace-pre-line text-sm font-medium leading-relaxed text-slate-600">
                      {modalMensaje.message}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end border-t border-slate-200 bg-slate-50 px-6 py-4">
                <button
                  type="button"
                  onClick={cerrarMensaje}
                  className={`
                    rounded-2xl px-5 py-2.5 text-sm font-bold text-white shadow-md transition
                    ${
                      modalMensaje.type === "error"
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-emerald-600 hover:bg-emerald-700"
                    }
                  `}
                >
                  Entendido
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const HeaderBox = ({ label, value }) => (
  <div className="rounded-2xl border border-white/10 bg-slate-900/50 px-4 py-3 text-left shadow-sm backdrop-blur xl:text-right">
    <p className="text-sm font-medium text-cyan-100">{label}</p>
    <p className="mt-1 text-sm font-bold text-white">{value}</p>
  </div>
);

const FlujoModulo = ({ activo }) => {
  const indiceActivo = flujoModulos.findIndex((m) => m.id === activo);
  const anterior = flujoModulos[indiceActivo - 1];
  const siguiente = flujoModulos[indiceActivo + 1];

  return (
    <section className="w-full shrink-0 rounded-3xl border border-slate-300 bg-slate-100 p-4 shadow-md sm:p-5">
      <div className="mb-4 flex flex-col gap-3 border-b border-slate-300 pb-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-900">
            Flujo del sistema
          </h2>

          <p className="mt-1 text-sm text-slate-600">
            Sigue el orden recomendado para no perderte entre módulos.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          {anterior && (
            <Link
              to={anterior.ruta}
              className="rounded-2xl border border-slate-400 bg-slate-200 px-4 py-2 text-center text-sm font-bold text-slate-800 transition hover:bg-slate-300"
            >
              ← Anterior: {anterior.nombre}
            </Link>
          )}

          {siguiente && (
            <Link
              to={siguiente.ruta}
              className="rounded-2xl bg-gradient-to-r from-blue-800 to-cyan-700 px-4 py-2 text-center text-sm font-bold text-white shadow-md transition hover:scale-[1.01]"
            >
              Siguiente: {siguiente.nombre} →
            </Link>
          )}
        </div>
      </div>

      <div className="overflow-x-auto pb-1">
        <div className="flex min-w-max items-stretch gap-3">
          {flujoModulos.map((modulo, index) => {
            const isActive = modulo.id === activo;
            const isCompleted = index < indiceActivo;
            const isPending = index > indiceActivo;

            return (
              <Link
                key={modulo.id}
                to={modulo.ruta}
                className={`
                  group relative flex w-[190px] flex-col rounded-3xl border p-4 transition
                  ${
                    isActive
                      ? "border-blue-300 bg-blue-100 shadow-lg shadow-blue-900/10"
                      : isCompleted
                      ? "border-emerald-200 bg-emerald-50 hover:bg-emerald-100"
                      : "border-slate-300 bg-slate-200 hover:bg-slate-300"
                  }
                `}
              >
                <div className="mb-3 flex items-center justify-between gap-2">
                  <span
                    className={`
                      rounded-full border px-3 py-1 text-sm font-bold
                      ${
                        isActive
                          ? "border-blue-300 bg-blue-700 text-white"
                          : isCompleted
                          ? "border-emerald-300 bg-emerald-600 text-white"
                          : "border-slate-400 bg-slate-100 text-slate-700"
                      }
                    `}
                  >
                    {modulo.orden}
                  </span>

                  {isCompleted && (
                    <span className="rounded-full bg-emerald-600 px-2 py-1 text-sm font-bold text-white">
                      ✓
                    </span>
                  )}

                  {isActive && (
                    <span className="rounded-full bg-blue-700 px-2 py-1 text-sm font-bold text-white">
                      Actual
                    </span>
                  )}

                  {isPending && (
                    <span className="rounded-full bg-slate-300 px-2 py-1 text-sm font-bold text-slate-700">
                      Pend.
                    </span>
                  )}
                </div>

                <p
                  className={`
                    text-sm font-extrabold
                    ${isActive ? "text-blue-900" : "text-slate-900"}
                  `}
                >
                  {modulo.nombre}
                </p>

                <p className="mt-1 text-sm leading-5 text-slate-600">
                  {modulo.descripcion}
                </p>

                {index < flujoModulos.length - 1 && (
                  <div className="absolute -right-[18px] top-1/2 z-10 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-slate-300 bg-slate-100 text-sm font-extrabold text-slate-700 shadow md:flex">
                    →
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default EmpleadosPage;