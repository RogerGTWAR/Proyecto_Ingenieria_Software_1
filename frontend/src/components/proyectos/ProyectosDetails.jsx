import React, { useEffect, useMemo } from "react";
import { useDetallesEmpleados } from "../../hooks/useDetallesEmpleados";
import { useEmpleados } from "../../hooks/useEmpleados";

const ProyectosDetails = ({ proyecto, onClose, onEdit, onDelete }) => {
  const { items: detalles, reload: reloadDetalles } = useDetallesEmpleados();
  const { items: empleados, reload: reloadEmpleados } = useEmpleados();

  useEffect(() => {
    const load = async () => {
      await reloadDetalles();
      await reloadEmpleados();
    };

    if (proyecto) load();
  }, [proyecto, reloadDetalles, reloadEmpleados]);

  const tiempoTotalDias = useMemo(() => {
    if (!proyecto?.fechaInicio || !proyecto?.fechaFin) return "—";

    const inicio = new Date(proyecto.fechaInicio);
    const fin = new Date(proyecto.fechaFin);
    const diffMs = fin - inicio;

    if (isNaN(diffMs) || diffMs < 0) return "—";

    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return `${diffDays} días`;
  }, [proyecto?.fechaInicio, proyecto?.fechaFin]);

  const empleadosAsignados = useMemo(() => {
    if (!proyecto?.id) return [];

    const detallesProyecto = detalles.filter(
      (d) => Number(d.proyectoId) === Number(proyecto.id)
    );

    return detallesProyecto
      .map((d) => {
        const emp = empleados.find((e) => Number(e.id) === Number(d.empleadoId));

        if (!emp) return null;

        return {
          id: emp.id,
          nombreCompleto: `${emp.nombres} ${emp.apellidos}`,
          rol: emp.rolNombre ?? "Sin rol",
          fechaAsignacion: d.fechaProyecto,
        };
      })
      .filter(Boolean);
  }, [detalles, empleados, proyecto]);

  if (!proyecto) return null;

  const money = (value) => Number(value ?? 0).toLocaleString("es-NI");

  const estadoClass = {
    Activo: "border-emerald-200 bg-emerald-100 text-emerald-800",
    Completado: "border-blue-200 bg-blue-100 text-blue-800",
    Cancelado: "border-red-200 bg-red-100 text-red-800",
    "En Espera": "border-amber-200 bg-amber-100 text-amber-800",
  };

  return (
    <div
      className="
        fixed left-0 right-0 bottom-0 top-16 z-40
        flex items-center justify-center overflow-y-auto
        bg-slate-900/35 px-4 py-6 lg:left-48
      "
    >
      <div
        className="
          flex w-full max-w-6xl max-h-[calc(100dvh-96px)]
          flex-col overflow-hidden rounded-3xl
          border border-slate-300 bg-slate-100 shadow-2xl
        "
      >
        <div className="shrink-0 bg-gradient-to-r from-slate-950 via-blue-950 to-cyan-900 px-5 py-5 text-white sm:px-7">
          <p className="text-sm font-medium text-cyan-100">
            Gestión de proyectos
          </p>

          <h2 className="mt-1 text-sm font-bold tracking-tight text-white">
            {proyecto.nombreProyecto}
          </h2>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto bg-slate-100 p-4 sm:p-6">
          <section className="rounded-3xl border border-slate-300 bg-slate-200 p-4 shadow-sm sm:p-6">
            <div className="mb-5 border-b border-slate-300 pb-4">
              <h3 className="text-sm font-bold text-slate-900">
                Resumen del proyecto
              </h3>

              <p className="mt-1 text-sm text-slate-600">
                Información principal del proyecto seleccionado.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <InfoBox
                label="Cliente"
                value={proyecto.clienteNombre || "Sin cliente"}
              />

              <InfoBox
                label="Ubicación"
                value={proyecto.ubicacion || "—"}
              />

              <InfoBox
                label="Presupuesto Total"
                value={`C$${money(proyecto.presupuestoTotal)}`}
                variant="green"
              />

              <div
                className={`
                  rounded-2xl border p-4
                  ${
                    estadoClass[proyecto.estado] ||
                    "border-slate-300 bg-slate-100 text-slate-800"
                  }
                `}
              >
                <p className="text-sm font-semibold opacity-80">Estado</p>
                <p className="mt-1 text-sm font-bold">
                  {proyecto.estado || "—"}
                </p>
              </div>

              <InfoBox
                label="Fecha Inicio"
                value={proyecto.fechaInicio?.split("T")[0] || "—"}
              />

              <InfoBox
                label="Fecha Fin"
                value={proyecto.fechaFin?.split("T")[0] || "—"}
              />

              <InfoBox label="Tiempo Total" value={tiempoTotalDias} />

              <InfoBox
                label="Empleados"
                value={empleadosAsignados.length}
                variant="blue"
              />

              <InfoBox
                label="Descripción"
                value={proyecto.descripcion || "—"}
                className="xl:col-span-4"
              />
            </div>
          </section>

          <section className="rounded-3xl border border-slate-300 bg-slate-200 p-4 shadow-sm sm:p-6">
            <div className="mb-5 flex flex-col gap-2 border-b border-slate-300 pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Empleados asignados
                </h3>

                <p className="mt-1 text-sm text-slate-600">
                  Personal relacionado con este proyecto.
                </p>
              </div>

              <span className="w-fit rounded-full border border-blue-200 bg-blue-100 px-4 py-2 text-sm font-bold text-blue-800">
                {empleadosAsignados.length} asignado(s)
              </span>
            </div>

            {empleadosAsignados.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {empleadosAsignados.map((e) => (
                  <div
                    key={e.id}
                    className="rounded-2xl border border-slate-300 bg-slate-100 p-4 shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-sm font-bold text-blue-700">
                        {e.nombreCompleto
                          ?.split(" ")
                          .map((x) => x[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-slate-900">
                          {e.nombreCompleto}
                        </p>

                        <p className="truncate text-sm text-slate-600">
                          {e.rol}
                        </p>

                        <p className="text-sm text-slate-500">
                          {e.fechaAsignacion
                            ? new Date(e.fechaAsignacion).toLocaleDateString()
                            : "Sin fecha"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyBox text="No hay empleados asignados a este proyecto." />
            )}
          </section>
        </div>

        <div className="shrink-0 border-t border-slate-300 bg-slate-100 px-4 py-4 sm:px-6">
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-2xl border border-slate-400 bg-slate-100 px-6 py-3 text-sm font-bold text-slate-800 shadow-sm transition hover:bg-slate-300 sm:w-auto"
            >
              Cerrar
            </button>

            <button
              type="button"
              onClick={() => onDelete(proyecto)}
              className="w-full rounded-2xl bg-red-600 px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-red-700 sm:w-auto"
            >
              Eliminar
            </button>

            <button
              type="button"
              onClick={() => onEdit(proyecto)}
              className="w-full rounded-2xl bg-gradient-to-r from-blue-800 to-cyan-700 px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:scale-[1.01] hover:shadow-xl sm:w-auto"
            >
              Editar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoBox = ({ label, value, variant = "default", className = "" }) => {
  const styles = {
    default: "border-slate-300 bg-slate-100 text-slate-800",
    green: "border-emerald-200 bg-emerald-100 text-emerald-800",
    blue: "border-blue-200 bg-blue-100 text-blue-800",
  };

  return (
    <div className={`rounded-2xl border p-4 ${styles[variant]} ${className}`}>
      <p className="text-sm font-semibold opacity-80">{label}</p>
      <p className="mt-1 text-sm font-bold">{value}</p>
    </div>
  );
};

const EmptyBox = ({ text }) => (
  <div className="rounded-2xl border border-dashed border-slate-400 bg-slate-100 px-6 py-8 text-center">
    <p className="text-sm font-bold text-slate-700">{text}</p>
  </div>
);

export default ProyectosDetails;