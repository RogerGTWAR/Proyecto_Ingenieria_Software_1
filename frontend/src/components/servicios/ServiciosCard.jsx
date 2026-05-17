import React from "react";

export default function ServiciosCard({
  servicios,
  onEdit,
  onDelete,
  onVerDetalles,
}) {
  const money = (value) => Number(value ?? 0).toLocaleString("es-NI");

  if (!servicios.length) {
    return (
      <div className="flex min-h-[260px] w-full items-center justify-center rounded-3xl border border-dashed border-slate-400 bg-slate-200 px-6 py-10 text-center shadow-sm">
        <div>
          <p className="text-sm font-bold text-slate-800">
            No hay servicios registrados
          </p>

          <p className="mt-1 text-sm text-slate-600">
            Registre un nuevo servicio para comenzar.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
      {servicios.map((s) => (
        <div
          key={s.id}
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
              Servicio registrado
            </p>

            <h3 className="mt-1 truncate text-sm font-bold">
              {s.nombreServicio || "Sin nombre"}
            </h3>
          </div>

          <div className="flex flex-1 flex-col justify-between p-5">
            <div className="space-y-4">
              <InfoBox
                label="Descripción"
                value={s.descripcion || "No especificada"}
              />

              <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
                <InfoBox
                  label="Costo Directo"
                  value={`C$${money(s.totalCostoDirecto)}`}
                />

                <InfoBox
                  label="Costo Indirecto"
                  value={`C$${money(s.totalCostoIndirecto)}`}
                />
              </div>

              <div className="rounded-2xl border border-emerald-200 bg-emerald-100 p-4 text-emerald-800">
                <p className="text-sm font-semibold opacity-80">
                  Costo de Venta
                </p>

                <p className="mt-1 text-sm font-bold">
                  C${money(s.costoVenta)}
                </p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-3">
              <button
                type="button"
                onClick={() => onVerDetalles(s)}
                className="rounded-xl bg-blue-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-800"
              >
                Detalles
              </button>

              <button
                type="button"
                onClick={() => onEdit(s)}
                className="rounded-xl border border-slate-400 bg-slate-100 px-4 py-2 text-sm font-bold text-slate-800 transition hover:bg-slate-300"
              >
                Editar
              </button>

              <button
                type="button"
                onClick={() => onDelete(s)}
                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

const InfoBox = ({ label, value }) => (
  <div className="rounded-2xl border border-slate-300 bg-slate-100 p-4 text-slate-800">
    <p className="text-sm font-semibold text-slate-600">{label}</p>
    <p className="mt-1 text-sm font-bold text-slate-900">{value}</p>
  </div>
);