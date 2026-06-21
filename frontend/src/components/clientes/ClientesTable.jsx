import React from "react";

export default function ClientesTable({
  clientes,
  onEdit,
  onDelete,
  onVerDetalles,
}) {
  if (!clientes.length) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-400 bg-slate-200 px-6 py-10 text-center shadow-sm">
        <p className="text-sm font-bold text-slate-800">
          No hay clientes registrados
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
              <th className="px-4 py-4 text-left font-bold">Tipo</th>
              <th className="px-4 py-4 text-left font-bold">Identificación</th>
              <th className="px-4 py-4 text-left font-bold">Cliente</th>
              <th className="px-4 py-4 text-left font-bold">Contacto</th>
              <th className="px-4 py-4 text-left font-bold">Ciudad</th>
              <th className="px-4 py-4 text-left font-bold">Teléfono</th>
              <th className="px-4 py-4 text-left font-bold">Correo</th>
              <th className="px-4 py-4 text-center font-bold">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-300">
            {clientes.map((c, idx) => (
              <tr
                key={c.id}
                className={`
                  transition
                  ${idx % 2 === 0 ? "bg-slate-100" : "bg-slate-200"}
                  hover:bg-blue-100
                `}
              >
                <td className="px-4 py-4 font-bold text-slate-900">
                  {c.tipoCliente || "—"}
                </td>

                <td className="px-4 py-4 text-slate-700">
                  {c.numeroIdentificacion || "—"}
                </td>

                <td className="px-4 py-4 font-bold text-slate-900">
                  {c.nombreEmpresa || "—"}
                </td>

                <td className="px-4 py-4 text-slate-700">
                  {c.nombreContacto || "—"}
                </td>

                <td className="px-4 py-4 text-slate-700">
                  {c.ciudad || "—"}
                </td>

                <td className="px-4 py-4 text-slate-700">
                  {c.telefono || "—"}
                </td>

                <td className="px-4 py-4 text-slate-700">
                  {c.correo || "—"}
                </td>

                <td className="px-4 py-4">
                  <div className="flex justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => onVerDetalles(c)}
                      className="rounded-xl bg-blue-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-800"
                    >
                      Detalles
                    </button>

                    <button
                      type="button"
                      onClick={() => onEdit(c)}
                      className="rounded-xl border border-slate-400 bg-slate-100 px-4 py-2 text-sm font-bold text-slate-800 transition hover:bg-slate-300"
                    >
                      Editar
                    </button>

                    <button
                      type="button"
                      onClick={() => onDelete(c)}
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
        {clientes.map((c) => (
          <div
            key={c.id}
            className="rounded-2xl border border-slate-300 bg-slate-100 p-4 shadow-sm"
          >
            <div className="mb-4 border-b border-slate-300 pb-3">
              <h3 className="text-sm font-bold text-slate-900">
                {c.nombreEmpresa || "—"}
              </h3>

              <p className="text-sm text-slate-600">
                {c.tipoCliente || "Cliente"} ·{" "}
                {c.nombreContacto || "Sin contacto"}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <MiniBox
                label="Identificación"
                value={c.numeroIdentificacion || "—"}
              />

              <MiniBox label="Ciudad" value={c.ciudad || "—"} />

              <MiniBox label="Teléfono" value={c.telefono || "—"} />

              <MiniBox label="Correo" value={c.correo || "—"} />
            </div>

            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
              <button
                type="button"
                onClick={() => onVerDetalles(c)}
                className="rounded-xl bg-blue-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-800"
              >
                Detalles
              </button>

              <button
                type="button"
                onClick={() => onEdit(c)}
                className="rounded-xl border border-slate-400 bg-slate-200 px-4 py-2 text-sm font-bold text-slate-800 transition hover:bg-slate-300"
              >
                Editar
              </button>

              <button
                type="button"
                onClick={() => onDelete(c)}
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
    <p className="mt-1 break-words text-sm font-bold">{value}</p>
  </div>
);