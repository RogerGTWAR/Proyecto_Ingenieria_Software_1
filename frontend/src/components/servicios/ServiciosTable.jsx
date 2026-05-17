import React from "react";

export default function ServiciosTable({
  servicios,
  onEdit,
  onDelete,
  onVerDetalles,
}) {
  const money = (value) => Number(value ?? 0).toLocaleString("es-NI");

  if (!servicios.length) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-400 bg-slate-200 px-6 py-10 text-center shadow-sm">
        <p className="text-sm font-bold text-slate-800">
          No hay servicios registrados
        </p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-3xl border border-slate-300 bg-slate-200 shadow-xl">
      <div className="hidden overflow-x-auto xl:block">
        <table className="w-full text-sm">
          <thead className="bg-slate-900 text-slate-100">
            <tr>
              <th className="px-4 py-4 text-left font-bold">Servicio</th>
              <th className="px-4 py-4 text-left font-bold">Descripción</th>
              <th className="px-4 py-4 text-right font-bold">
                Costo Directo
              </th>
              <th className="px-4 py-4 text-right font-bold">
                Costo Indirecto
              </th>
              <th className="px-4 py-4 text-right font-bold">
                Costo Venta
              </th>
              <th className="px-4 py-4 text-center font-bold">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-300">
            {servicios.map((s, index) => (
              <tr
                key={s.id}
                className={`
                  transition
                  ${index % 2 === 0 ? "bg-slate-100" : "bg-slate-200"}
                  hover:bg-blue-100
                `}
              >
                <td className="px-4 py-4 font-bold text-slate-900">
                  {s.nombreServicio || "—"}
                </td>

                <td className="px-4 py-4 text-slate-700">
                  {s.descripcion || "—"}
                </td>

                <td className="px-4 py-4 text-right text-slate-700">
                  C${money(s.totalCostoDirecto)}
                </td>

                <td className="px-4 py-4 text-right text-slate-700">
                  C${money(s.totalCostoIndirecto)}
                </td>

                <td className="px-4 py-4 text-right font-bold text-emerald-700">
                  C${money(s.costoVenta)}
                </td>

                <td className="px-4 py-4">
                  <div className="flex justify-center gap-2">
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 gap-3 bg-slate-200 p-3 xl:hidden">
        {servicios.map((s) => (
          <div
            key={s.id}
            className="rounded-2xl border border-slate-300 bg-slate-100 p-4 shadow-sm"
          >
            <div className="mb-4 border-b border-slate-300 pb-3">
              <h3 className="text-sm font-bold text-slate-900">
                {s.nombreServicio || "—"}
              </h3>

              <p className="text-sm text-slate-600">
                {s.descripcion || "Sin descripción"}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <MiniBox
                label="Costo Directo"
                value={`C$${money(s.totalCostoDirecto)}`}
              />

              <MiniBox
                label="Costo Indirecto"
                value={`C$${money(s.totalCostoIndirecto)}`}
              />

              <MiniBox
                label="Costo Venta"
                value={`C$${money(s.costoVenta)}`}
                green
              />
            </div>

            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
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
                className="rounded-xl border border-slate-400 bg-slate-200 px-4 py-2 text-sm font-bold text-slate-800 transition hover:bg-slate-300"
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
        ))}
      </div>
    </div>
  );
}

const MiniBox = ({ label, value, green = false }) => (
  <div
    className={`
      rounded-xl border p-3
      ${
        green
          ? "border-emerald-200 bg-emerald-100 text-emerald-800"
          : "border-slate-300 bg-slate-200 text-slate-800"
      }
    `}
  >
    <p className="text-sm font-semibold opacity-80">{label}</p>
    <p className="mt-1 text-sm font-bold">{value}</p>
  </div>
);