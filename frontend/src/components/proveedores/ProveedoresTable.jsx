import React from "react";

export default function ProveedoresTable({
  proveedores,
  onEdit,
  onDelete,
  onVerDetalles,
}) {
  if (!proveedores.length) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-400 bg-slate-200 px-6 py-10 text-center shadow-sm">
        <p className="text-sm font-bold text-slate-800">
          No hay proveedores registrados
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
              <th className="px-4 py-4 text-left font-bold">Empresa</th>
              <th className="px-4 py-4 text-left font-bold">Categoría</th>
              <th className="px-4 py-4 text-left font-bold">Ciudad</th>
              <th className="px-4 py-4 text-left font-bold">País</th>
              <th className="px-4 py-4 text-left font-bold">Teléfono</th>
              <th className="px-4 py-4 text-center font-bold">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-300">
            {proveedores.map((p, idx) => (
              <tr
                key={p.id}
                className={`
                  transition
                  ${idx % 2 === 0 ? "bg-slate-100" : "bg-slate-200"}
                  hover:bg-blue-100
                `}
              >
                <td className="px-4 py-4 font-bold text-slate-900">
                  {p.nombre_empresa || "—"}
                </td>

                <td className="px-4 py-4 text-slate-700">
                  {p.categoriaNombre || "—"}
                </td>

                <td className="px-4 py-4 text-slate-700">
                  {p.ciudad || "—"}
                </td>

                <td className="px-4 py-4 text-slate-700">
                  {p.pais || "—"}
                </td>

                <td className="px-4 py-4 text-slate-700">
                  {p.telefono || "—"}
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
        {proveedores.map((p) => (
          <div
            key={p.id}
            className="rounded-2xl border border-slate-300 bg-slate-100 p-4 shadow-sm"
          >
            <div className="mb-4 border-b border-slate-300 pb-3">
              <h3 className="text-sm font-bold text-slate-900">
                {p.nombre_empresa || "—"}
              </h3>

              <p className="text-sm text-slate-600">
                {p.categoriaNombre || "Sin categoría"}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <MiniBox label="Ciudad" value={p.ciudad || "—"} />
              <MiniBox label="País" value={p.pais || "—"} />
              <MiniBox label="Teléfono" value={p.telefono || "—"} />
              <MiniBox label="Contacto" value={p.nombre_contacto || "—"} />
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

const MiniBox = ({ label, value }) => (
  <div className="rounded-xl border border-slate-300 bg-slate-200 p-3 text-slate-800">
    <p className="text-sm font-semibold opacity-80">{label}</p>
    <p className="mt-1 text-sm font-bold">{value}</p>
  </div>
);