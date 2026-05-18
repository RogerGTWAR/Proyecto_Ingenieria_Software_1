import React, { useEffect, useState } from "react";
import { useCostosDirectos } from "../../hooks/useCostosDirectos";
import { useCostosIndirectos } from "../../hooks/useCostosIndirectos";

const DESCRIPCION_PORCENTAJES = {
  costoMaterial: "Cantidad × precio unitario",
  manoObra: "40% del costo material",
  equipos: "10% del costo material",
  totalDirecto: "Material + mano de obra + equipos",
  costoDirectoBase: "Base para calcular indirectos",
  administracion: "5% del costo directo",
  operacion: "10% del costo directo",
  utilidad: "15% del costo directo",
  totalIndirecto: "Administración + operación + utilidad",
};

export default function ServiciosDetails({
  servicio,
  onClose,
  onEdit,
  onDelete,
}) {
  const [mostrarPorcentajes, setMostrarPorcentajes] = useState(false);

  const { items: directos, reload: reloadDirectos } = useCostosDirectos();
  const { items: indirectos, reload: reloadIndirectos } = useCostosIndirectos();

  useEffect(() => {
    if (servicio) {
      reloadDirectos();
      reloadIndirectos();
      setMostrarPorcentajes(false);
    }
  }, [servicio]);

  if (!servicio) return null;

  const money = (value) => Number(value ?? 0).toLocaleString("es-NI");

  const directosServicio = directos.filter(
    (d) => Number(d.servicioId) === Number(servicio.id)
  );

  const indirectoServicio = indirectos.find(
    (i) => Number(i.servicioId) === Number(servicio.id)
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
            Gestión de servicios
          </p>

          <h2 className="mt-1 text-sm font-bold tracking-tight text-white">
            {servicio.nombreServicio}
          </h2>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto bg-slate-100 p-4 sm:p-6">
          <section className="rounded-3xl border border-slate-300 bg-slate-200 p-4 shadow-sm sm:p-6">
            <div className="mb-5 border-b border-slate-300 pb-4">
              <h3 className="text-sm font-bold text-slate-900">
                Resumen del servicio
              </h3>

              <p className="mt-1 text-sm text-slate-600">
                Información general y totales calculados.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
              <InfoBox
                label="Descripción"
                value={servicio.descripcion || "—"}
              />

              <InfoBox
                label="Costo Directo Total"
                value={`C$${money(servicio.totalCostoDirecto)}`}
              />

              <InfoBox
                label="Costo Indirecto Total"
                value={`C$${money(servicio.totalCostoIndirecto)}`}
              />

              <InfoBox
                label="Costo de Venta"
                value={`C$${money(servicio.costoVenta)}`}
                variant="green"
              />
            </div>
          </section>

          <section className="rounded-3xl border border-slate-300 bg-slate-200 p-4 shadow-sm sm:p-6">
            <div className="mb-5 flex flex-col gap-2 border-b border-slate-300 pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Costos directos
                </h3>

                <p className="mt-1 text-sm text-slate-600">
                  Materiales, mano de obra y equipos asignados al servicio.
                </p>

                <button
                  type="button"
                  onClick={() => setMostrarPorcentajes((prev) => !prev)}
                  className="
                    mt-3 rounded-xl border border-blue-200 bg-blue-100
                    px-4 py-2 text-xs font-bold text-blue-800
                    transition hover:bg-blue-200
                  "
                >
                  {mostrarPorcentajes
                    ? "Ocultar porcentajes"
                    : "Mostrar porcentajes"}
                </button>
              </div>

              <span className="w-fit rounded-full border border-blue-200 bg-blue-100 px-4 py-2 text-sm font-bold text-blue-800">
                {directosServicio.length} registro(s)
              </span>
            </div>

            {directosServicio.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                {directosServicio.map((d) => (
                  <div
                    key={d.id}
                    className="
                      rounded-2xl border border-slate-300 bg-slate-100
                      p-4 shadow-sm transition hover:border-blue-300 hover:shadow-md
                    "
                  >
                    <div className="mb-4 flex flex-col gap-1 border-b border-slate-300 pb-3">
                      <h4 className="text-sm font-bold text-slate-900">
                        {d.materialNombre}
                      </h4>

                      <p className="text-sm text-slate-600">
                        Costo directo calculado por material, mano de obra y
                        equipos.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      <MiniBox
                        label="Cantidad"
                        value={`${d.cantidadMaterial} ${d.unidadMedida}`}
                      />

                      <MiniBox
                        label="P. Unitario"
                        value={`C$${money(d.precioUnitario)}`}
                      />

                      <MiniBox
                        label="C. Material"
                        porcentaje={
                          mostrarPorcentajes
                            ? DESCRIPCION_PORCENTAJES.costoMaterial
                            : null
                        }
                        value={`C$${money(d.costoMaterial)}`}
                      />

                      <MiniBox
                        label="Mano de Obra"
                        porcentaje={
                          mostrarPorcentajes
                            ? DESCRIPCION_PORCENTAJES.manoObra
                            : null
                        }
                        value={`C$${money(d.manoObra)}`}
                      />

                      <MiniBox
                        label="Equipos"
                        porcentaje={
                          mostrarPorcentajes
                            ? DESCRIPCION_PORCENTAJES.equipos
                            : null
                        }
                        value={`C$${money(d.equiposTransporteHerramientas)}`}
                      />

                      <MiniBox
                        label="Total"
                        porcentaje={
                          mostrarPorcentajes
                            ? DESCRIPCION_PORCENTAJES.totalDirecto
                            : null
                        }
                        value={`C$${money(d.totalCostoDirecto)}`}
                        variant="green"
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyBox text="No hay costos directos registrados." />
            )}
          </section>

          <section className="rounded-3xl border border-slate-300 bg-slate-200 p-4 shadow-sm sm:p-6">
            <div className="mb-5 flex flex-col gap-2 border-b border-slate-300 pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Costos indirectos
                </h3>

                <p className="mt-1 text-sm text-slate-600">
                  Este servicio maneja un único registro de administración,
                  operación y utilidad.
                </p>
              </div>

              <span className="w-fit rounded-full border border-emerald-200 bg-emerald-100 px-4 py-2 text-sm font-bold text-emerald-800">
                1 resumen
              </span>
            </div>

            {indirectoServicio ? (
              <div
                className="
                  overflow-hidden rounded-3xl border border-slate-300
                  bg-slate-100 shadow-sm
                "
              >
                <div className="bg-gradient-to-r from-emerald-700 to-teal-700 px-5 py-4 text-white">
                  <p className="text-sm font-medium text-emerald-100">
                    Resumen de costos indirectos
                  </p>

                  <h4 className="mt-1 text-sm font-bold">
                    Total indirecto: C$
                    {money(indirectoServicio.totalCostoIndirecto)}
                  </h4>
                </div>

                <div className="p-4 sm:p-5">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
                    <BigCostBox
                      label="Costo Directo Base"
                      porcentaje={
                        mostrarPorcentajes
                          ? DESCRIPCION_PORCENTAJES.costoDirectoBase
                          : null
                      }
                      value={`C$${money(indirectoServicio.totalCostoDirecto)}`}
                    />

                    <BigCostBox
                      label="Administración"
                      porcentaje={
                        mostrarPorcentajes
                          ? DESCRIPCION_PORCENTAJES.administracion
                          : null
                      }
                      value={`C$${money(indirectoServicio.administracion)}`}
                    />

                    <BigCostBox
                      label="Operación"
                      porcentaje={
                        mostrarPorcentajes
                          ? DESCRIPCION_PORCENTAJES.operacion
                          : null
                      }
                      value={`C$${money(indirectoServicio.operacion)}`}
                    />

                    <BigCostBox
                      label="Utilidad"
                      porcentaje={
                        mostrarPorcentajes
                          ? DESCRIPCION_PORCENTAJES.utilidad
                          : null
                      }
                      value={`C$${money(indirectoServicio.utilidad)}`}
                    />

                    <BigCostBox
                      label="Total Indirecto"
                      porcentaje={
                        mostrarPorcentajes
                          ? DESCRIPCION_PORCENTAJES.totalIndirecto
                          : null
                      }
                      value={`C$${money(
                        indirectoServicio.totalCostoIndirecto
                      )}`}
                      variant="green"
                    />
                  </div>

                  {mostrarPorcentajes && (
                    <div className="mt-4 rounded-2xl border border-slate-300 bg-slate-200 p-4">
                      <p className="text-sm font-semibold text-slate-700">
                        Interpretación
                      </p>

                      <p className="mt-1 text-sm text-slate-600">
                        El costo indirecto se calcula sobre el costo directo
                        base. Administración representa el 5%, operación el 10%
                        y utilidad el 15% del costo directo del servicio.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <EmptyBox text="No hay costos indirectos registrados." />
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
              onClick={() => onDelete(servicio)}
              className="w-full rounded-2xl bg-red-600 px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-red-700 sm:w-auto"
            >
              Eliminar
            </button>

            <button
              type="button"
              onClick={() => onEdit(servicio)}
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

const InfoBox = ({ label, value, variant = "default" }) => {
  const styles = {
    default: "border-slate-300 bg-slate-100 text-slate-800",
    green: "border-emerald-200 bg-emerald-100 text-emerald-800",
  };

  return (
    <div className={`rounded-2xl border p-4 ${styles[variant]}`}>
      <p className="text-sm font-semibold opacity-80">{label}</p>
      <p className="mt-1 text-sm font-bold">{value}</p>
    </div>
  );
};

const MiniBox = ({ label, value, porcentaje, variant = "default" }) => {
  const styles = {
    default: "border-slate-300 bg-slate-200 text-slate-800",
    green: "border-emerald-200 bg-emerald-100 text-emerald-800",
  };

  return (
    <div className={`rounded-xl border p-3 ${styles[variant]}`}>
      <p className="text-sm font-semibold opacity-80">{label}</p>

      {porcentaje && (
        <p className="mt-1 text-xs font-bold text-blue-700">
          {porcentaje}
        </p>
      )}

      <p className="mt-1 text-sm font-bold">{value}</p>
    </div>
  );
};

const BigCostBox = ({ label, value, porcentaje, variant = "default" }) => {
  const styles = {
    default: "border-slate-300 bg-slate-200 text-slate-800",
    green: "border-emerald-200 bg-emerald-100 text-emerald-800",
  };

  return (
    <div className={`rounded-2xl border p-4 ${styles[variant]}`}>
      <p className="text-sm font-semibold opacity-80">{label}</p>

      {porcentaje && (
        <p className="mt-1 text-xs font-bold text-blue-700">
          {porcentaje}
        </p>
      )}

      <p className="mt-2 text-sm font-extrabold">{value}</p>
    </div>
  );
};

const EmptyBox = ({ text }) => (
  <div className="rounded-2xl border border-dashed border-slate-400 bg-slate-100 px-6 py-8 text-center">
    <p className="text-sm font-bold text-slate-700">{text}</p>
  </div>
);