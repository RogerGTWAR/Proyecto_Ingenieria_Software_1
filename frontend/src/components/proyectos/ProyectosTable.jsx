import React from "react";

export default function ProyectosTable({
  proyectos,
  onEdit,
  onDelete,
  onVerDetalles,
}) {
  const money = (value) => Number(value ?? 0).toLocaleString("es-NI");

  const estadoClass = {
    Activo: "border-emerald-200 bg-emerald-100 text-emerald-800",
    Completado: "border-blue-200 bg-blue-100 text-blue-800",
    Cancelado: "border-red-200 bg-red-100 text-red-800",
    "En Espera": "border-amber-200 bg-amber-100 text-amber-800",
  };

  if (!proyectos.length) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-400 bg-slate-200 px-6 py-10 text-center shadow-sm">
        <p className="text-sm font-bold text-slate-800">
          No hay proyectos registrados
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
              <th className="px-4 py-4 text-left font-bold">Cliente</th>
              <th className="px-4 py-4 text-left font-bold">Ubicación</th>
              <th className="px-4 py-4 text-right font-bold">Presupuesto</th>
              <th className="px-4 py-4 text-center font-bold">Estado</th>
              <th className="px-4 py-4 text-center font-bold">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-300">
            {proyectos.map((p, idx) => (
              <tr
                key={p.id}
                className={`
                  transition
                  ${idx % 2 === 0 ? "bg-slate-100" : "bg-slate-200"}
                  hover:bg-blue-100
                `}
              >
                <td className="px-4 py-4 font-bold text-slate-900">
                  {p.nombreProyecto || "—"}
                </td>

                <td className="px-4 py-4 text-slate-700">
                  {p.clienteNombre || "—"}
                </td>

                <td className="px-4 py-4 text-slate-700">
                  {p.ubicacion || "—"}
                </td>

                <td className="px-4 py-4 text-right font-bold text-emerald-700">
                  {p.presupuestoTotal
                    ? `C$${money(p.presupuestoTotal)}`
                    : "—"}
                </td>

                <td className="px-4 py-4 text-center">
                  <span
                    className={`
                      rounded-full border px-3 py-1 text-sm font-bold
                      ${
                        estadoClass[p.estado] ||
                        "border-slate-300 bg-slate-100 text-slate-800"
                      }
                    `}
                  >
                    {p.estado || "—"}
                  </span>
                </td>

                <td className="px-4 py-4">
                  <div className="flex justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => onVerDetalles(p)}
                      className="rounded-xl bg-blue-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-800"
                    >
                      Detalles
                    </button>

                    <button
                      type="button"
                      onClick={() => onEdit(p)}
                      className="rounded-xl border border-slate-400 bg-slate-100 px-4 py-2 text-sm font-bold text-slate-800 transition hover:bg-slate-300"
                    >
                      Editar
                    </button>

                    <button
                      type="button"
                      onClick={() => onDelete(p)}
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
        {proyectos.map((p) => (
          <div
            key={p.id}
            className="rounded-2xl border border-slate-300 bg-slate-100 p-4 shadow-sm"
          >
            <div className="mb-4 border-b border-slate-300 pb-3">
              <h3 className="text-sm font-bold text-slate-900">
                {p.nombreProyecto || "—"}
              </h3>

              <p className="text-sm text-slate-600">
                {p.clienteNombre || "Sin cliente"}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <MiniBox label="Ubicación" value={p.ubicacion || "—"} />

              <MiniBox
                label="Presupuesto"
                value={
                  p.presupuestoTotal
                    ? `C$${money(p.presupuestoTotal)}`
                    : "—"
                }
                green
              />

              <MiniBox label="Inicio" value={p.fechaInicio?.split("T")[0] || "—"} />
              <MiniBox label="Fin" value={p.fechaFin?.split("T")[0] || "—"} />

              <div
                className={`
                  rounded-xl border p-3
                  ${
                    estadoClass[p.estado] ||
                    "border-slate-300 bg-slate-200 text-slate-800"
                  }
                `}
              >
                <p className="text-sm font-semibold opacity-80">Estado</p>
                <p className="mt-1 text-sm font-bold">{p.estado || "—"}</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
              <button
                type="button"
                onClick={() => onVerDetalles(p)}
                className="rounded-xl bg-blue-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-800"
              >
                Detalles
              </button>

              <button
                type="button"
                onClick={() => onEdit(p)}
                className="rounded-xl border border-slate-400 bg-slate-200 px-4 py-2 text-sm font-bold text-slate-800 transition hover:bg-slate-300"
              >
                Editar
              </button>

              <button
                type="button"
                onClick={() => onDelete(p)}
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