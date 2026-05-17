import React from "react";

export default function ComprasTable({
  compras,
  onEdit,
  onDelete,
  onVerDetalles,
}) {
  const money = (value) =>
    Number(value ?? 0).toLocaleString("es-NI", {
      style: "currency",
      currency: "NIO",
      minimumFractionDigits: 2,
    });

  const estadoClass = {
    Pagada: "bg-emerald-100 text-emerald-800 border-emerald-200",
    Pendiente: "bg-amber-100 text-amber-800 border-amber-200",
    Cancelada: "bg-red-100 text-red-800 border-red-200",
  };

  if (!compras.length) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-400 bg-slate-200 px-6 py-10 text-center shadow-sm">
        <p className="text-sm font-bold text-slate-800">
          No hay compras registradas
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
              <th className="px-4 py-4 text-left font-bold">ID</th>
              <th className="px-4 py-4 text-left font-bold">Factura</th>
              <th className="px-4 py-4 text-left font-bold">Proveedor</th>
              <th className="px-4 py-4 text-center font-bold">Fecha</th>
              <th className="px-4 py-4 text-right font-bold">Monto</th>
              <th className="px-4 py-4 text-center font-bold">Estado</th>
              <th className="px-4 py-4 text-center font-bold">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-300">
            {compras.map((c, idx) => (
              <tr
                key={c.id}
                className={`
                  transition
                  ${idx % 2 === 0 ? "bg-slate-100" : "bg-slate-200"}
                  hover:bg-blue-100
                `}
              >
                <td className="px-4 py-4 font-bold text-slate-900">
                  #{c.id}
                </td>

                <td className="px-4 py-4 text-slate-700">
                  {c.numero_factura || "—"}
                </td>

                <td className="px-4 py-4 text-slate-700">
                  {c.proveedorNombre || "—"}
                </td>

                <td className="px-4 py-4 text-center text-slate-700">
                  {c.fecha_compra || "—"}
                </td>

                <td className="px-4 py-4 text-right font-bold text-emerald-700">
                  {money(c.monto_total)}
                </td>

                <td className="px-4 py-4 text-center">
                  <span
                    className={`
                      rounded-full border px-3 py-1 text-sm font-bold
                      ${estadoClass[c.estado] || "border-slate-300 bg-slate-100 text-slate-800"}
                    `}
                  >
                    {c.estado || "—"}
                  </span>
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
        {compras.map((c) => (
          <div
            key={c.id}
            className="rounded-2xl border border-slate-300 bg-slate-100 p-4 shadow-sm"
          >
            <div className="mb-4 border-b border-slate-300 pb-3">
              <h3 className="text-sm font-bold text-slate-900">
                Compra #{c.id}
              </h3>
              <p className="text-sm text-slate-600">
                Factura: {c.numero_factura || "—"}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <MiniBox label="Proveedor" value={c.proveedorNombre || "—"} />
              <MiniBox label="Fecha" value={c.fecha_compra || "—"} />
              <MiniBox label="Monto" value={money(c.monto_total)} green />

              <div
                className={`
                  rounded-xl border p-3
                  ${estadoClass[c.estado] || "border-slate-300 bg-slate-200 text-slate-800"}
                `}
              >
                <p className="text-sm font-semibold opacity-80">Estado</p>
                <p className="mt-1 text-sm font-bold">{c.estado || "—"}</p>
              </div>
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