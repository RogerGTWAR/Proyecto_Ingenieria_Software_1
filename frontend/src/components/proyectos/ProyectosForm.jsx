import { useState, useEffect } from "react";
import { useClientes } from "../../hooks/useClientes";
import { useEmpleados } from "../../hooks/useEmpleados";
import { useDetallesEmpleados } from "../../hooks/useDetallesEmpleados";

const ProyectosForm = ({ onSubmit, onClose, initialData, isEdit }) => {
  const { items: clientes } = useClientes();
  const { items: empleados } = useEmpleados();
  const { items: detalles, add, edit, remove, reload } = useDetallesEmpleados();

  const [errors, setErrors] = useState({});
  const [guardando, setGuardando] = useState(false);

  const [modalMensaje, setModalMensaje] = useState({
    open: false,
    type: "error",
    title: "",
    message: "",
  });

  const [form, setForm] = useState({
    id: "",
    clienteId: "",
    nombreProyecto: "",
    descripcion: "",
    ubicacion: "",
    fechaInicio: "",
    fechaFin: "",
    presupuestoTotal: "",
    estado: "En Espera",
  });

  const [empleadosAsignados, setEmpleadosAsignados] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState("");

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
      type: "error",
      title: "",
      message: "",
    });
  };

  useEffect(() => {
    if (initialData) {
      setForm({
        id: initialData.id ?? "",
        clienteId: initialData.clienteId ?? "",
        nombreProyecto: initialData.nombreProyecto ?? "",
        descripcion: initialData.descripcion ?? "",
        ubicacion: initialData.ubicacion ?? "",
        fechaInicio: initialData.fechaInicio
          ? new Date(initialData.fechaInicio).toISOString().split("T")[0]
          : "",
        fechaFin: initialData.fechaFin
          ? new Date(initialData.fechaFin).toISOString().split("T")[0]
          : "",
        presupuestoTotal: initialData.presupuestoTotal ?? "",
        estado: initialData.estado ?? "En Espera",
      });

      const asignados = detalles
        .filter(
          (d) =>
            Number(d.proyecto_id ?? d.proyectoId) === Number(initialData.id)
        )
        .map((d) => {
          const emp = empleados.find(
            (e) => Number(e.id) === Number(d.empleado_id ?? d.empleadoId)
          );

          return {
            id: emp?.id ?? d.empleado_id ?? d.empleadoId,
            detalleId: d.id,
            nombre: emp
              ? `${emp.nombres} ${emp.apellidos}`
              : `Empleado #${d.empleado_id ?? d.empleadoId}`,
            rol: emp?.rolNombre ?? "Sin rol",
            fecha:
              d.fecha_de_proyecto ??
              d.fechaProyecto ??
              new Date().toISOString(),
          };
        });

      setEmpleadosAsignados(asignados);
    } else {
      setForm({
        id: "",
        clienteId: "",
        nombreProyecto: "",
        descripcion: "",
        ubicacion: "",
        fechaInicio: "",
        fechaFin: "",
        presupuestoTotal: "",
        estado: "En Espera",
      });

      setEmpleadosAsignados([]);
    }
  }, [initialData, detalles, empleados]);

  const presupuesto = Number(form.presupuestoTotal || 0);

  const inputClass =
    "w-full min-w-0 rounded-xl border border-slate-300 bg-slate-100 px-3 py-3 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-sm placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100 sm:px-4";

  const labelClass = "mb-2 block text-sm font-semibold text-slate-700";
  const errorClass = "mt-1 text-sm font-medium text-red-600";

  const estadoClass = {
    "En Espera": "border-amber-200 bg-amber-100 text-amber-800",
    Activo: "border-emerald-200 bg-emerald-100 text-emerald-800",
    Completado: "border-blue-200 bg-blue-100 text-blue-800",
    Cancelado: "border-red-200 bg-red-100 text-red-800",
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const empleadosFiltrados = empleados.filter((e) =>
    `${e.nombres} ${e.apellidos}`
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  );

  const handleAsignarEmpleado = () => {
    if (guardando) return;

    if (!empleadoSeleccionado) {
      setErrors((prev) => ({
        ...prev,
        asignar: "Debe seleccionar un empleado.",
      }));
      return;
    }

    const empleado = empleados.find(
      (e) => Number(e.id) === Number(empleadoSeleccionado)
    );

    if (!empleado) {
      setErrors((prev) => ({
        ...prev,
        asignar: "El empleado seleccionado no existe.",
      }));
      return;
    }

    const yaAsignado = empleadosAsignados.some(
      (e) => Number(e.id) === Number(empleado.id)
    );

    if (yaAsignado) {
      setErrors((prev) => ({
        ...prev,
        asignar: "Este empleado ya está asignado.",
      }));
      return;
    }

    setEmpleadosAsignados((prev) => [
      ...prev,
      {
        id: empleado.id,
        detalleId: null,
        nombre: `${empleado.nombres} ${empleado.apellidos}`,
        rol: empleado.rolNombre ?? "Sin rol",
        fecha: new Date().toISOString(),
      },
    ]);

    setEmpleadoSeleccionado("");
    setBusqueda("");

    setErrors((prev) => ({
      ...prev,
      asignar: "",
    }));
  };

  const handleQuitarEmpleado = async (id) => {
    if (guardando) return;

    try {
      const detalleExistente = detalles.find(
        (d) =>
          Number(d.empleadoId ?? d.empleado_id) === Number(id) &&
          Number(d.proyectoId ?? d.proyecto_id) === Number(form.id)
      );

      if (detalleExistente) {
        await remove(detalleExistente.id);
        await reload();
      }

      setEmpleadosAsignados((prev) =>
        prev.filter((e) => Number(e.id) !== Number(id))
      );
    } catch (error) {
      mostrarMensaje(
        "error",
        "Error al quitar empleado",
        error.message || "No se pudo quitar el empleado asignado."
      );
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.clienteId) {
      newErrors.clienteId = "Seleccione un cliente.";
    }

    if (!form.nombreProyecto.trim()) {
      newErrors.nombreProyecto = "El nombre del proyecto es obligatorio.";
    } else if (form.nombreProyecto.trim().length < 3) {
      newErrors.nombreProyecto =
        "El nombre del proyecto debe tener al menos 3 caracteres.";
    }

    if (!form.ubicacion.trim()) {
      newErrors.ubicacion = "La ubicación es obligatoria.";
    }

    if (!form.presupuestoTotal || Number(form.presupuestoTotal) <= 0) {
      newErrors.presupuestoTotal =
        "Debe ingresar un presupuesto mayor que cero.";
    }

    const minFecha = new Date("2000-01-01");
    const maxFecha = new Date("2040-12-31");

    if (!form.fechaInicio) {
      newErrors.fechaInicio = "La fecha de inicio es obligatoria.";
    } else {
      const inicio = new Date(form.fechaInicio);

      if (inicio < minFecha || inicio > maxFecha) {
        newErrors.fechaInicio = "Debe estar entre 2000 y 2040.";
      }
    }

    if (!form.fechaFin) {
      newErrors.fechaFin = "La fecha de fin es obligatoria.";
    } else {
      const fin = new Date(form.fechaFin);

      if (fin < minFecha || fin > maxFecha) {
        newErrors.fechaFin = "Debe estar entre 2000 y 2040.";
      }

      if (
        form.fechaInicio &&
        new Date(form.fechaFin) < new Date(form.fechaInicio)
      ) {
        newErrors.fechaFin =
          "La fecha de fin no puede ser menor a la fecha de inicio.";
      }
    }

    if (!form.estado) {
      newErrors.estado = "Seleccione un estado.";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (guardando) return;

    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);

      mostrarMensaje(
        "error",
        "Revise los datos del proyecto",
        "Hay campos pendientes o valores inválidos. Revise el formulario antes de guardar."
      );

      return;
    }

    try {
      setGuardando(true);

      const proyectoGuardado = await onSubmit({
        ...form,
        clienteId: form.clienteId,
        presupuestoTotal: Number(form.presupuestoTotal),
      });

      const proyectoId = Number(proyectoGuardado?.id ?? form.id);

      if (!proyectoId) {
        mostrarMensaje(
          "error",
          "Error al guardar proyecto",
          "No se pudo obtener el ID del proyecto guardado."
        );

        setGuardando(false);
        return;
      }

      for (const emp of empleadosAsignados) {
        const existe = detalles.find(
          (d) =>
            Number(d.empleadoId ?? d.empleado_id) === Number(emp.id) &&
            Number(d.proyectoId ?? d.proyecto_id) === proyectoId
        );

        if (existe) {
          await edit(existe.id, {
            empleado_id: emp.id,
            proyecto_id: proyectoId,
            fecha_de_proyecto:
              existe.fechaProyecto || new Date().toISOString().split("T")[0],
          });
        } else {
          await add({
            empleado_id: emp.id,
            proyecto_id: proyectoId,
            fecha_de_proyecto: new Date().toISOString().split("T")[0],
          });
        }
      }

      await reload();
      onClose();
    } catch (error) {
      mostrarMensaje(
        "error",
        "Error al guardar proyecto",
        error.message || "No se pudo guardar el proyecto."
      );
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div
      className="
        fixed left-0 right-0 bottom-0 top-16 z-40
        flex items-center justify-center overflow-y-auto
        bg-slate-900/35 px-4 py-6 lg:left-48
      "
    >
      <form
        onSubmit={handleSubmit}
        className="
          flex w-full max-w-6xl max-h-[calc(100dvh-96px)]
          flex-col overflow-hidden rounded-3xl
          border border-slate-300 bg-slate-100 shadow-2xl
        "
      >
        <div className="shrink-0 bg-gradient-to-r from-slate-950 via-blue-950 to-cyan-900 px-5 py-5 text-white shadow-lg sm:px-7">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <p className="text-sm font-medium text-cyan-100">
                Gestión de proyectos
              </p>

              <h2 className="mt-1 truncate text-sm font-bold tracking-tight text-white">
                {isEdit ? "Editar Proyecto" : "Nuevo Proyecto"}
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <SummaryBox
                label="Presupuesto"
                value={`C$${presupuesto.toLocaleString("es-NI")}`}
              />

              <SummaryBox
                label="Empleados"
                value={empleadosAsignados.length}
              />
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto bg-slate-100 p-4 sm:p-6">
          <section className="rounded-3xl border border-slate-300 bg-slate-200 p-4 shadow-sm sm:p-6">
            <div className="mb-5 flex flex-col gap-3 border-b border-slate-300 pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Información general
                </h3>

                <p className="mt-1 text-sm text-slate-600">
                  Complete los datos principales del proyecto.
                </p>
              </div>

              <span
                className={`
                  w-fit rounded-full border px-4 py-2 text-sm font-bold
                  ${
                    estadoClass[form.estado] ||
                    "border-slate-300 bg-slate-100 text-slate-800"
                  }
                `}
              >
                {form.estado}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="min-w-0">
                <label className={labelClass}>Cliente</label>

                <select
                  name="clienteId"
                  value={form.clienteId}
                  onChange={handleChange}
                  disabled={guardando}
                  className={inputClass}
                >
                  <option value="">Seleccione un cliente</option>

                  {clientes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombreEmpresa}
                    </option>
                  ))}
                </select>

                {errors.clienteId && (
                  <p className={errorClass}>{errors.clienteId}</p>
                )}
              </div>

              <div className="min-w-0">
                <label className={labelClass}>Estado</label>

                <select
                  name="estado"
                  value={form.estado}
                  onChange={handleChange}
                  disabled={guardando}
                  className={inputClass}
                >
                  <option value="En Espera">En Espera</option>
                  <option value="Activo">Activo</option>
                  <option value="Completado">Completado</option>
                  <option value="Cancelado">Cancelado</option>
                </select>

                {errors.estado && (
                  <p className={errorClass}>{errors.estado}</p>
                )}
              </div>

              <div className="min-w-0">
                <label className={labelClass}>Nombre del Proyecto</label>

                <input
                  type="text"
                  name="nombreProyecto"
                  value={form.nombreProyecto}
                  onChange={handleChange}
                  disabled={guardando}
                  placeholder="Ejemplo: Construcción de bodega"
                  className={inputClass}
                />

                {errors.nombreProyecto && (
                  <p className={errorClass}>{errors.nombreProyecto}</p>
                )}
              </div>

              <div className="min-w-0">
                <label className={labelClass}>Ubicación</label>

                <input
                  type="text"
                  name="ubicacion"
                  value={form.ubicacion}
                  onChange={handleChange}
                  disabled={guardando}
                  placeholder="Ejemplo: Managua, Nicaragua"
                  className={inputClass}
                />

                {errors.ubicacion && (
                  <p className={errorClass}>{errors.ubicacion}</p>
                )}
              </div>

              <div className="min-w-0 md:col-span-2">
                <label className={labelClass}>Descripción</label>

                <textarea
                  name="descripcion"
                  value={form.descripcion}
                  onChange={handleChange}
                  disabled={guardando}
                  rows={3}
                  placeholder="Descripción breve del proyecto"
                  className={`${inputClass} resize-none`}
                />
              </div>

              <div className="min-w-0">
                <label className={labelClass}>Presupuesto Total (C$)</label>

                <input
                  type="number"
                  name="presupuestoTotal"
                  value={form.presupuestoTotal}
                  onChange={handleChange}
                  disabled={guardando}
                  min="0"
                  step="0.01"
                  placeholder="Ejemplo: 150000"
                  className={inputClass}
                />

                {errors.presupuestoTotal && (
                  <p className={errorClass}>{errors.presupuestoTotal}</p>
                )}
              </div>

              <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="min-w-0">
                  <label className={labelClass}>Fecha de Inicio</label>

                  <input
                    type="date"
                    name="fechaInicio"
                    value={form.fechaInicio}
                    onChange={handleChange}
                    disabled={guardando}
                    className={inputClass}
                  />

                  {errors.fechaInicio && (
                    <p className={errorClass}>{errors.fechaInicio}</p>
                  )}
                </div>

                <div className="min-w-0">
                  <label className={labelClass}>Fecha de Fin</label>

                  <input
                    type="date"
                    name="fechaFin"
                    value={form.fechaFin}
                    onChange={handleChange}
                    disabled={guardando}
                    className={inputClass}
                  />

                  {errors.fechaFin && (
                    <p className={errorClass}>{errors.fechaFin}</p>
                  )}
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-300 bg-slate-200 p-4 shadow-sm sm:p-6">
            <div className="mb-5 flex flex-col gap-3 border-b border-slate-300 pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Empleados asignados
                </h3>

                <p className="mt-1 text-sm text-slate-600">
                  Busque y asigne empleados al proyecto.
                </p>
              </div>

              <span className="w-fit rounded-full border border-blue-200 bg-blue-100 px-4 py-2 text-sm font-bold text-blue-800">
                {empleadosAsignados.length} asignado(s)
              </span>
            </div>

            <div className="mb-5 grid grid-cols-1 gap-3 lg:grid-cols-[1fr_auto]">
              <div className="min-w-0">
                <input
                  type="text"
                  placeholder="Buscar empleado..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  disabled={guardando}
                  className={inputClass}
                />

                {busqueda && (
                  <select
                    value={empleadoSeleccionado}
                    onChange={(e) => setEmpleadoSeleccionado(e.target.value)}
                    disabled={guardando}
                    className={`${inputClass} mt-3`}
                  >
                    <option value="">Seleccionar empleado...</option>

                    {empleadosFiltrados.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.nombres} {e.apellidos} — {e.rolNombre}
                      </option>
                    ))}
                  </select>
                )}

                {errors.asignar && (
                  <p className={errorClass}>{errors.asignar}</p>
                )}
              </div>

              <button
                type="button"
                onClick={handleAsignarEmpleado}
                disabled={guardando}
                className="h-fit rounded-2xl bg-gradient-to-r from-blue-800 to-cyan-700 px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:scale-[1.01] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
              >
                Asignar
              </button>
            </div>

            {empleadosAsignados.length === 0 ? (
              <EmptyBox text="Aún no hay empleados asignados." />
            ) : (
              <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
                {empleadosAsignados.map((e) => (
                  <div
                    key={e.id}
                    className="flex flex-col gap-4 rounded-2xl border border-slate-300 bg-slate-100 p-4 shadow-sm transition hover:border-blue-300 hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-sm font-bold text-blue-700">
                        {e.nombre
                          ?.split(" ")
                          .map((x) => x[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-slate-900">
                          {e.nombre}
                        </p>

                        <p className="truncate text-sm text-slate-600">
                          {e.rol}
                        </p>

                        <p className="text-sm text-slate-500">
                          Asignado: {new Date(e.fecha).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleQuitarEmpleado(e.id)}
                      disabled={guardando}
                      className="w-full rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                    >
                      Quitar
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <div className="shrink-0 border-t border-slate-300 bg-slate-100 px-4 py-4 sm:px-6">
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={guardando}
              className="w-full rounded-2xl border border-slate-400 bg-slate-100 px-8 py-3 text-sm font-bold text-slate-800 shadow-sm transition hover:bg-slate-300 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={guardando}
              className="w-full rounded-2xl bg-gradient-to-r from-blue-800 to-cyan-700 px-8 py-3 text-sm font-bold text-white shadow-lg transition hover:scale-[1.01] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100 sm:w-auto"
            >
              {guardando
                ? "Guardando..."
                : isEdit
                ? "Actualizar Proyecto"
                : "Guardar Proyecto"}
            </button>
          </div>
        </div>
      </form>

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
  );
};

const SummaryBox = ({ label, value }) => (
  <div className="rounded-2xl border border-white/10 bg-slate-900/50 px-4 py-3 text-left shadow-sm backdrop-blur sm:text-right">
    <p className="text-sm font-medium text-cyan-100">{label}</p>
    <p className="mt-1 truncate text-sm font-bold text-white">{value}</p>
  </div>
);

const EmptyBox = ({ text }) => (
  <div className="rounded-2xl border border-dashed border-slate-400 bg-slate-100 px-6 py-8 text-center">
    <p className="text-sm font-bold text-slate-700">{text}</p>
  </div>
);

export default ProyectosForm;