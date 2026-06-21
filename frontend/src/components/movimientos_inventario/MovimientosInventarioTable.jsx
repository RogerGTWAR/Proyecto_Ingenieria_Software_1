import React from "react";

export default function MovimientosInventarioTable({
  movimientos,
  onDelete,
  onVerDetalles,
}) {
  const money = (value) =>
    Number(value ?? 0).toLocaleString("es-NI", {
      style: "currency",
      currency: "NIO",
      minimumFractionDigits: 2,
    });

  const formatDate = (value) => {
    if (!value) return "—";

    return new Date(value).toLocaleDateString("es-NI", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const getTipoBadge = (tipo) => {
    if (tipo === "Entrada") {
      return "border-emerald-200 bg-emerald-100 text-emerald-800";
    }

    if (tipo === "Salida") {
      return "border-red-200 bg-red-100 text-red-800";
    }

    return "border-amber-200 bg-amber-100 text-amber-800";
  };

  if (!movimientos.length) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-400 bg-slate-200 px-6 py-10 text-center shadow-sm">
        <p className="text-sm font-bold text-slate-800">
          No hay movimientos registrados
        </p>

        <p className="mt-1 text-sm text-slate-600">
          Registre una entrada, salida o ajuste de inventario.
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
              <th className="px-4 py-4 text-left font-bold">Material</th>
              <th className="px-4 py-4 text-center font-bold">Tipo</th>
              <th className="px-4 py-4 text-center font-bold">Cantidad</th>
              <th className="px-4 py-4 text-center font-bold">Stock anterior</th>
              <th className="px-4 py-4 text-center font-bold">Stock nuevo</th>
              <th className="px-4 py-4 text-right font-bold">Precio</th>
              <th className="px-4 py-4 text-center font-bold">Fecha</th>
              <th className="px-4 py-4 text-center font-bold">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-300">
            {movimientos.map((m, index) => (
              <tr
                key={m.id}
                className={`
                  transition
                  ${index % 2 === 0 ? "bg-slate-100" : "bg-slate-200"}
                  hover:bg-blue-100
                `}
              >
                <td className="px-4 py-4 font-bold text-slate-900">
                  {m.materialNombre || "—"}
                </td>

                <td className="px-4 py-4 text-center">
                  <span
                    className={`rounded-full border px-3 py-1 text-sm font-bold ${getTipoBadge(
                      m.tipoMovimiento
                    )}`}
                  >
                    {m.tipoMovimiento || "—"}
                  </span>
                </td>

                <td className="px-4 py-4 text-center font-semibold text-slate-800">
                  {Number(m.cantidad ?? 0).toLocaleString("es-NI")}
                </td>

                <td className="px-4 py-4 text-center text-slate-700">
                  {Number(m.stockAnterior ?? 0).toLocaleString("es-NI")}
                </td>

                <td className="px-4 py-4 text-center font-bold text-slate-900">
                  {Number(m.stockNuevo ?? 0).toLocaleString("es-NI")}
                </td>

                <td className="px-4 py-4 text-right font-bold text-emerald-700">
                  {money(m.precioUnitario)}
                </td>

                <td className="px-4 py-4 text-center text-slate-700">
                  {formatDate(m.fechaMovimiento)}
                </td>

                <td className="px-4 py-4">
                  <div className="flex justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => onVerDetalles(m)}
                      className="rounded-xl bg-blue-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-800"
                    >
                      Detalles
                    </button>

                    <button
                      type="button"
                      onClick={() => onDelete(m)}
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
        {movimientos.map((m) => (
          <div
            key={m.id}
            className="rounded-2xl border border-slate-300 bg-slate-100 p-4 shadow-sm"
          >
            <div className="mb-4 border-b border-slate-300 pb-3">
              <h3 className="text-sm font-bold text-slate-900">
                {m.materialNombre || "—"}
              </h3>

              <p className="text-sm text-slate-600">
                {m.tipoMovimiento || "Movimiento"} · {formatDate(m.fechaMovimiento)}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <MiniBox
                label="Cantidad"
                value={Number(m.cantidad ?? 0).toLocaleString("es-NI")}
              />

              <MiniBox
                label="Stock anterior"
                value={Number(m.stockAnterior ?? 0).toLocaleString("es-NI")}
              />

              <MiniBox
                label="Stock nuevo"
                value={Number(m.stockNuevo ?? 0).toLocaleString("es-NI")}
              />

              <MiniBox label="Precio" value={money(m.precioUnitario)} green />

              <MiniBox label="Referencia" value={m.referencia || "—"} />
            </div>

            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => onVerDetalles(m)}
                className="rounded-xl bg-blue-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-800"
              >
                Detalles
              </button>

              <button
                type="button"
                onClick={() => onDelete(m)}
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

const MiniBox = ({ label, value, green }) => (
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
    <p className="mt-1 truncate text-sm font-bold">{value}</p>
  </div>
);