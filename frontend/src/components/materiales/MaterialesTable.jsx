import React from "react";

export default function MaterialesTable({
  materiales,
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

  const getStockBadge = (stock, minimo) => {
    if (stock <= minimo) {
      return "border-red-200 bg-red-100 text-red-800";
    }

    if (stock <= minimo + 5) {
      return "border-amber-200 bg-amber-100 text-amber-800";
    }

    return "border-blue-200 bg-blue-100 text-blue-800";
  };

  if (!materiales.length) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-400 bg-slate-200 px-6 py-10 text-center shadow-sm">
        <p className="text-sm font-bold text-slate-800">
          No hay materiales registrados
        </p>
        <p className="mt-1 text-sm text-slate-600">
          Agregue un nuevo material para comenzar.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-3xl border border-slate-300 bg-slate-200 shadow-xl">
      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full text-sm">
          <thead className="bg-slate-900 text-slate-100">
            <tr>
              <th className="px-4 py-4 text-left font-bold">Material</th>
              <th className="px-4 py-4 text-left font-bold">Categoría</th>
              <th className="px-4 py-4 text-center font-bold">Unidad</th>
              <th className="px-4 py-4 text-center font-bold">Stock</th>
              <th className="px-4 py-4 text-center font-bold">Mínimo</th>
              <th className="px-4 py-4 text-right font-bold">Precio</th>
              <th className="px-4 py-4 text-center font-bold">Alertas</th>
              <th className="px-4 py-4 text-center font-bold">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-300">
            {materiales.map((m, index) => {
              const stock = Number(m.cantidad_en_stock ?? 0);
              const stockMinimo = Number(m.stock_minimo ?? 10);

              return (
                <tr
                  key={m.id}
                  className={`
                    transition
                    ${index % 2 === 0 ? "bg-slate-100" : "bg-slate-200"}
                    hover:bg-blue-100
                  `}
                >
                  <td className="px-4 py-4 font-bold text-slate-900">
                    {m.nombre_material}
                  </td>

                  <td className="px-4 py-4 text-slate-700">
                    {m.categoriaNombre || "—"}
                  </td>

                  <td className="px-4 py-4 text-center">
                    <span className="rounded-full bg-slate-800 px-3 py-1 text-sm font-bold text-slate-100">
                      {m.unidad_de_medida || "—"}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-center">
                    <span
                      className={`rounded-full border px-3 py-1 text-sm font-bold ${getStockBadge(
                        stock,
                        stockMinimo
                      )}`}
                    >
                      {stock.toLocaleString("es-NI")}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-center font-semibold text-slate-800">
                    {stockMinimo.toLocaleString("es-NI")}
                  </td>

                  <td className="px-4 py-4 text-right font-bold text-emerald-700">
                    {money(m.precio_unitario)}
                  </td>

                  <td className="px-4 py-4 text-center">
                    <span
                      className={`
                        rounded-full border px-3 py-1 text-sm font-bold
                        ${
                          Number(m.alertas_count ?? 0) > 0
                            ? "border-red-200 bg-red-100 text-red-800"
                            : "border-slate-300 bg-slate-100 text-slate-700"
                        }
                      `}
                    >
                      {Number(m.alertas_count ?? 0)}
                    </span>
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
                        onClick={() => onEdit(m)}
                        className="rounded-xl border border-slate-400 bg-slate-100 px-4 py-2 text-sm font-bold text-slate-800 transition hover:bg-slate-300"
                      >
                        Editar
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
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 gap-3 bg-slate-200 p-3 lg:hidden">
        {materiales.map((m) => {
          const stock = Number(m.cantidad_en_stock ?? 0);
          const stockMinimo = Number(m.stock_minimo ?? 10);

          return (
            <div
              key={m.id}
              className="rounded-2xl border border-slate-300 bg-slate-100 p-4 shadow-sm"
            >
              <div className="mb-4 border-b border-slate-300 pb-3">
                <h3 className="text-sm font-bold text-slate-900">
                  {m.nombre_material}
                </h3>

                <p className="text-sm text-slate-600">
                  {m.categoriaNombre || "Sin categoría"}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <MiniBox label="Unidad" value={m.unidad_de_medida || "—"} />

                <MiniBox
                  label="Stock"
                  value={stock.toLocaleString("es-NI")}
                  color={stock <= stockMinimo ? "red" : "blue"}
                />

                <MiniBox
                  label="Mínimo"
                  value={stockMinimo.toLocaleString("es-NI")}
                  color="yellow"
                />

                <MiniBox label="Precio" value={money(m.precio_unitario)} green />

                <MiniBox
                  label="Alertas"
                  value={Number(m.alertas_count ?? 0)}
                  color={Number(m.alertas_count ?? 0) > 0 ? "red" : "default"}
                />
              </div>

              <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
                <button
                  type="button"
                  onClick={() => onVerDetalles(m)}
                  className="rounded-xl bg-blue-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-800"
                >
                  Detalles
                </button>

                <button
                  type="button"
                  onClick={() => onEdit(m)}
                  className="rounded-xl border border-slate-400 bg-slate-200 px-4 py-2 text-sm font-bold text-slate-800 transition hover:bg-slate-300"
                >
                  Editar
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
          );
        })}
      </div>
    </div>
  );
}

const MiniBox = ({ label, value, green, color = "default" }) => {
  const styles = {
    default: "border-slate-300 bg-slate-200 text-slate-800",
    blue: "border-blue-200 bg-blue-100 text-blue-800",
    yellow: "border-amber-200 bg-amber-100 text-amber-800",
    red: "border-red-200 bg-red-100 text-red-800",
    green: "border-emerald-200 bg-emerald-100 text-emerald-800",
  };

  const selected = green ? styles.green : styles[color];

  return (
    <div className={`rounded-xl border p-3 ${selected}`}>
      <p className="text-sm font-semibold opacity-80">{label}</p>
      <p className="mt-1 text-sm font-bold">{value}</p>
    </div>
  );
};