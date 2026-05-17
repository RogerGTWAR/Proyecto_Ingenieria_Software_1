import React, { useEffect } from "react";
import { useDetallesAvaluos } from "../../hooks/useDetallesAvaluos";
import { useServicios } from "../../hooks/useServicios";
import { useProyectos } from "../../hooks/useProyectos";

export default function AvaluosDetails({ avaluo, onClose, onEdit, onDelete }) {
  const { items: detalles, reload: reloadDetalles } = useDetallesAvaluos();
  const { items: servicios, reload: reloadServicios } = useServicios();
  const { items: proyectos, reload: reloadProyectos } = useProyectos();

  useEffect(() => {
    reloadDetalles();
    reloadServicios();
    reloadProyectos();
  }, [avaluo]);

  if (!avaluo) return null;

  const money = (value) =>
    Number(value ?? 0).toLocaleString("es-NI");

  const proyecto = proyectos.find(
    (p) => Number(p.id) === Number(avaluo.proyectoId)
  );

  const detallesAvaluo = detalles.filter(
    (d) => Number(d.avaluoId) === Number(avaluo.id)
  );

  const serviciosMap = Object.fromEntries(
    servicios.map((s) => [Number(s.id), s])
  );

  const totalServicios = detallesAvaluo.reduce(
    (acc, d) => acc + Number(d.totalCostoVenta ?? 0),
    0
  );

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
            Gestión de avalúos
          </p>

          <h2 className="mt-1 text-sm font-bold tracking-tight text-white">
            {avaluo.descripcion?.trim() || `Avalúo #${avaluo.id}`}
          </h2>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto bg-slate-100 p-4 sm:p-6">
          <section className="rounded-3xl border border-slate-300 bg-slate-200 p-4 shadow-sm sm:p-6">
            <div className="mb-5 border-b border-slate-300 pb-4">
              <h3 className="text-sm font-bold text-slate-900">
                Resumen del avalúo
              </h3>

              <p className="mt-1 text-sm text-slate-600">
                Información general y monto ejecutado.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <InfoBox
                label="Proyecto"
                value={proyecto?.nombreProyecto || `Proyecto ${avaluo.proyectoId}`}
              />

              <InfoBox
                label="Inicio"
                value={avaluo.fechaInicio?.slice(0, 10) || "—"}
              />

              <InfoBox
                label="Fin"
                value={avaluo.fechaFin?.slice(0, 10) || "—"}
              />

              <InfoBox
                label="Total de días"
                value={avaluo.tiempoTotalDias || "—"}
              />

              <InfoBox
                label="Descripción"
                value={avaluo.descripcion || "—"}
                className="xl:col-span-2"
              />

              <InfoBox
                label="Monto Ejecutado"
                value={`C$${money(avaluo.montoEjecutado)}`}
                variant="green"
              />

              <InfoBox
                label="Total Servicios"
                value={`C$${money(totalServicios)}`}
                variant="blue"
              />
            </div>
          </section>

          <section className="rounded-3xl border border-slate-300 bg-slate-200 p-4 shadow-sm sm:p-6">
            <div className="mb-5 flex flex-col gap-2 border-b border-slate-300 pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Servicios asociados
                </h3>

                <p className="mt-1 text-sm text-slate-600">
                  Detalle de servicios incluidos en este avalúo.
                </p>
              </div>

              <span className="w-fit rounded-full border border-blue-200 bg-blue-100 px-4 py-2 text-sm font-bold text-blue-800">
                {detallesAvaluo.length} servicio(s)
              </span>
            </div>

            {detallesAvaluo.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                {detallesAvaluo.map((d) => {
                  const serv = serviciosMap[Number(d.servicioId)];

                  const nombreServicio =
                    serv?.nombreServicio ||
                    d.servicioNombre ||
                    "Servicio no disponible";

                  const descripcionServicio =
                    serv?.descripcion || d.servicioDescripcion || "";

                  return (
                    <div
                      key={d.id}
                      className="
                        rounded-2xl border border-slate-300 bg-slate-100
                        p-4 shadow-sm transition hover:border-blue-300 hover:shadow-md
                      "
                    >
                      <div className="mb-4 border-b border-slate-300 pb-3">
                        <h4 className="text-sm font-bold text-slate-900">
                          {nombreServicio}
                        </h4>

                        {descripcionServicio && (
                          <p className="mt-1 text-sm text-slate-600">
                            {descripcionServicio}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        <MiniBox label="Actividad" value={d.actividad || "—"} />
                        <MiniBox label="Unidad" value={d.unidadMedida || "—"} />
                        <MiniBox label="Cantidad" value={d.cantidad || 0} />
                        <MiniBox
                          label="P. Unitario"
                          value={`C$${money(d.precioUnitario)}`}
                        />
                        <MiniBox
                          label="Costo Venta"
                          value={`C$${money(d.costoVenta)}`}
                        />
                        <MiniBox
                          label="IVA"
                          value={`C$${money(d.iva)}`}
                        />
                        <MiniBox
                          label="Total"
                          value={`C$${money(d.totalCostoVenta)}`}
                          variant="green"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyBox text="No hay servicios asignados." />
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
              onClick={() => onDelete(avaluo)}
              className="w-full rounded-2xl bg-red-600 px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-red-700 sm:w-auto"
            >
              Eliminar
            </button>

            <button
              type="button"
              onClick={() => onEdit(avaluo)}
              className="w-full rounded-2xl bg-gradient-to-r from-blue-800 to-cyan-700 px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:scale-[1.01] hover:shadow-xl sm:w-auto"
            >
              Editar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

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

const MiniBox = ({ label, value, variant = "default" }) => {
  const styles = {
    default: "border-slate-300 bg-slate-200 text-slate-800",
    green: "border-emerald-200 bg-emerald-100 text-emerald-800",
  };

  return (
    <div className={`rounded-xl border p-3 ${styles[variant]}`}>
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