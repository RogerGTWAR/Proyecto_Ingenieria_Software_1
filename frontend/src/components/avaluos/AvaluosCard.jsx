import React from "react";
import { useProyectos } from "../../hooks/useProyectos";

export default function AvaluosCard({
  avaluos,
  onEdit,
  onDelete,
  onVerDetalles,
}) {
  const { items: proyectos } = useProyectos();

  const money = (value) =>
    Number(value ?? 0).toLocaleString("es-NI");

  const proyectosMap = Object.fromEntries(
    proyectos.map((p) => [Number(p.id), p])
  );

  if (!avaluos?.length) {
    return (
      <div className="flex min-h-[260px] w-full items-center justify-center rounded-3xl border border-dashed border-slate-400 bg-slate-200 px-6 py-10 text-center shadow-sm">
        <div>
          <p className="text-sm font-bold text-slate-800">
            No hay avalúos registrados
          </p>

          <p className="mt-1 text-sm text-slate-600">
            Registre un nuevo avalúo para comenzar.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
      {avaluos.map((a) => {
        const proyecto = proyectosMap[Number(a.proyectoId)];

        return (
          <div
            key={a.id}
            className="
              flex
              min-h-[360px]
              w-full
              flex-col
              overflow-hidden
              rounded-3xl
              border
              border-slate-300
              bg-slate-200
              shadow-md
              transition
              hover:-translate-y-1
              hover:border-blue-400
              hover:shadow-xl
            "
          >
            <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-cyan-900 px-5 py-4 text-white">
              <p className="text-sm font-medium text-cyan-100">
                Avalúo registrado
              </p>

              <h3 className="mt-1 truncate text-sm font-bold">
                {a.descripcion?.trim() || `Avalúo #${a.id}`}
              </h3>
            </div>

            <div className="flex flex-1 flex-col justify-between p-5">
              <div className="space-y-4">
                <InfoBox
                  label="Proyecto"
                  value={proyecto?.nombreProyecto || a.proyectoNombre || `Proyecto ${a.proyectoId}`}
                />

                <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
                  <InfoBox
                    label="Fecha Inicio"
                    value={a.fechaInicio?.slice(0, 10) || "—"}
                  />

                  <InfoBox
                    label="Fecha Fin"
                    value={a.fechaFin?.slice(0, 10) || "—"}
                  />
                </div>

                <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
                  <InfoBox
                    label="Días"
                    value={a.tiempoTotalDias || 0}
                  />

                  <InfoBox
                    label="Monto Ejecutado"
                    value={`C$${money(a.montoEjecutado)}`}
                    variant="green"
                  />
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-3">
                <button
                  type="button"
                  onClick={() => onVerDetalles(a)}
                  className="rounded-xl bg-blue-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-800"
                >
                  Detalles
                </button>

                <button
                  type="button"
                  onClick={() => onEdit(a)}
                  className="rounded-xl border border-slate-400 bg-slate-100 px-4 py-2 text-sm font-bold text-slate-800 transition hover:bg-slate-300"
                >
                  Editar
                </button>

                <button
                  type="button"
                  onClick={() => onDelete(a)}
                  className="rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-700"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        );
      })}
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