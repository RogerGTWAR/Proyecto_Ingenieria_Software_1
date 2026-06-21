import React from "react";

const MaterialesCard = ({ materiales, onEdit, onDelete, onVerDetalles }) => {
  const money = (value) =>
    Number(value ?? 0).toLocaleString("es-NI", {
      style: "currency",
      currency: "NIO",
      minimumFractionDigits: 2,
    });

  const getStockStatus = (stock, minimo) => {
    if (stock <= minimo) {
      return {
        label: "Stock bajo",
        box: "border-red-200 bg-red-100",
        text: "text-red-800",
        title: "text-red-700",
      };
    }

    if (stock <= minimo + 5) {
      return {
        label: "Stock cercano",
        box: "border-amber-200 bg-amber-100",
        text: "text-amber-800",
        title: "text-amber-700",
      };
    }

    return {
      label: "Stock normal",
      box: "border-blue-200 bg-blue-100",
      text: "text-blue-800",
      title: "text-blue-700",
    };
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
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {materiales.map((material) => {
        const stock = Number(material.cantidad_en_stock ?? 0);
        const stockMinimo = Number(material.stock_minimo ?? 10);
        const precio = Number(material.precio_unitario ?? 0);
        const valorTotal = stock * precio;
        const estadoStock = getStockStatus(stock, stockMinimo);

        return (
          <div
            key={material.id}
            className="
              overflow-hidden rounded-3xl
              border border-slate-300
              bg-slate-200
              shadow-md transition
              hover:-translate-y-1 hover:border-blue-400 hover:shadow-xl
            "
          >
            <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-cyan-900 px-5 py-4 text-white">
              <p className="text-sm font-medium text-cyan-100">
                {estadoStock.label}
              </p>

              <h3 className="mt-1 truncate text-sm font-bold">
                {material.nombre_material}
              </h3>
            </div>

            <div className="space-y-4 p-5">
              <div className="rounded-2xl border border-slate-300 bg-slate-100 p-4">
                <p className="text-sm font-semibold text-slate-600">
                  Categoría
                </p>
                <p className="mt-1 text-sm font-bold text-slate-900">
                  {material.categoriaNombre || "Sin categoría"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-slate-300 bg-slate-100 p-4">
                  <p className="text-sm font-semibold text-slate-600">
                    Unidad
                  </p>
                  <p className="mt-1 text-sm font-bold text-slate-900">
                    {material.unidad_de_medida || "—"}
                  </p>
                </div>

                <div className={`rounded-2xl border p-4 ${estadoStock.box}`}>
                  <p className={`text-sm font-semibold ${estadoStock.title}`}>
                    Stock
                  </p>
                  <p className={`mt-1 text-sm font-bold ${estadoStock.text}`}>
                    {stock.toLocaleString("es-NI")}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-amber-200 bg-amber-100 p-4">
                  <p className="text-sm font-semibold text-amber-700">
                    Stock mínimo
                  </p>
                  <p className="mt-1 text-sm font-bold text-amber-800">
                    {stockMinimo.toLocaleString("es-NI")}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-300 bg-slate-100 p-4">
                  <p className="text-sm font-semibold text-slate-600">
                    Alertas
                  </p>
                  <p className="mt-1 text-sm font-bold text-slate-900">
                    {Number(material.alertas_count ?? 0)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-emerald-200 bg-emerald-100 p-4">
                  <p className="text-sm font-semibold text-emerald-700">
                    Precio
                  </p>
                  <p className="mt-1 text-sm font-bold text-emerald-800">
                    {money(precio)}
                  </p>
                </div>

                <div className="rounded-2xl border border-emerald-200 bg-emerald-100 p-4">
                  <p className="text-sm font-semibold text-emerald-700">
                    Valor
                  </p>
                  <p className="mt-1 text-sm font-bold text-emerald-800">
                    {money(valorTotal)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2 pt-2 sm:grid-cols-3">
                <button
                  type="button"
                  onClick={() => onVerDetalles(material)}
                  className="rounded-xl bg-blue-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-800"
                >
                  Detalles
                </button>

                <button
                  type="button"
                  onClick={() => onEdit(material)}
                  className="rounded-xl border border-slate-400 bg-slate-100 px-4 py-2 text-sm font-bold text-slate-800 transition hover:bg-slate-300"
                >
                  Editar
                </button>

                <button
                  type="button"
                  onClick={() => onDelete(material)}
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
};

export default MaterialesCard;