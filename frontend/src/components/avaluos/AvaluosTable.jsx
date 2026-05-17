import React from "react";

export default function AvaluosTable({
  avaluos,
  onEdit,
  onDelete,
  onVerDetalles,
}) {
  const money = (value) =>
    Number(value ?? 0).toLocaleString("es-NI");

  if (!avaluos.length) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-400 bg-slate-200 px-6 py-10 text-center shadow-sm">
        <p className="text-sm font-bold text-slate-800">
          No hay avalúos registrados
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
              <th className="px-4 py-4 text-left font-bold">Proyecto</th>
              <th className="px-4 py-4 text-left font-bold">Descripción</th>
              <th className="px-4 py-4 text-center font-bold">Inicio</th>
              <th className="px-4 py-4 text-center font-bold">Fin</th>
              <th className="px-4 py-4 text-center font-bold">Días</th>
              <th className="px-4 py-4 text-right font-bold">Monto Ejecutado</th>
              <th className="px-4 py-4 text-center font-bold">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-300">
            {avaluos.map((a, idx) => (
              <tr
                key={a.id}
                className={`
                  transition
                  ${idx % 2 === 0 ? "bg-slate-100" : "bg-slate-200"}
                  hover:bg-blue-100
                `}
              >
                <td className="px-4 py-4 font-bold text-slate-900">
                  {a.proyectoNombre || `Proyecto ${a.proyectoId}`}
                </td>

                <td className="px-4 py-4 text-slate-700">
                  {a.descripcion || "—"}
                </td>

                <td className="px-4 py-4 text-center text-slate-700">
                  {a.fechaInicio?.slice(0, 10) || "—"}
                </td>

                <td className="px-4 py-4 text-center text-slate-700">
                  {a.fechaFin?.slice(0, 10) || "—"}
                </td>

                <td className="px-4 py-4 text-center text-slate-700">
                  {a.tiempoTotalDias || 0}
                </td>

                <td className="px-4 py-4 text-right font-bold text-emerald-700">
                  C${money(a.montoEjecutado)}
                </td>

                <td className="px-4 py-4">
                  <div className="flex justify-center gap-2">
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 gap-3 bg-slate-200 p-3 xl:hidden">
        {avaluos.map((a) => (
          <div
            key={a.id}
            className="rounded-2xl border border-slate-300 bg-slate-100 p-4 shadow-sm"
          >
            <div className="mb-4 border-b border-slate-300 pb-3">
              <h3 className="text-sm font-bold text-slate-900">
                {a.descripcion || `Avalúo #${a.id}`}
              </h3>

              <p className="text-sm text-slate-600">
                {a.proyectoNombre || `Proyecto ${a.proyectoId}`}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <MiniBox label="Inicio" value={a.fechaInicio?.slice(0, 10) || "—"} />
              <MiniBox label="Fin" value={a.fechaFin?.slice(0, 10) || "—"} />
              <MiniBox label="Días" value={a.tiempoTotalDias || 0} />
              <MiniBox
                label="Monto Ejecutado"
                value={`C$${money(a.montoEjecutado)}`}
                green
              />
            </div>

            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
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
                className="rounded-xl border border-slate-400 bg-slate-200 px-4 py-2 text-sm font-bold text-slate-800 transition hover:bg-slate-300"
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