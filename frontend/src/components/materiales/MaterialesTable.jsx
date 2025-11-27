import React from "react";

export default function MaterialesTable({ materiales, onEdit, onDelete, onVerDetalles }) {
  return (
    <div className="w-full bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">

      <div className="grid grid-cols-6 font-semibold text-[#1A2E81] bg-gray-100 p-3 border-b">
        <span>Material</span>
        <span>Categoría</span>
        <span>Unidad</span>
        <span>Stock</span>
        <span>Precio</span>
        <span className="text-center">Acciones</span>
      </div>

      <div className="divide-y divide-gray-200">
        {materiales.length > 0 ? (
          materiales.map((m, idx) => (
            <div
              key={m.id}
              className={`grid grid-cols-6 items-center px-3 py-2 ${
                idx % 2 === 0 ? "bg-gray-50" : "bg-white"
              } hover:bg-gray-100 transition`}
            >
              <span>{m.nombre_material}</span>
              <span>{m.categoriaNombre || "—"}</span>
              <span>{m.unidad_de_medida || "—"}</span>
              <span>{m.cantidad_en_stock ?? 0}</span>
              <span>
                {m.precio_unitario
                  ? `C$${Number(m.precio_unitario).toLocaleString("es-NI")}`
                  : "C$0.00"}
              </span>

              <div className="flex justify-center gap-2">
                <button
                  onClick={() => onVerDetalles(m)}
                  className="text-white text-sm px-3 py-1 rounded-md"
                  style={{ backgroundColor: "#1A2E81" }}
                >
                  Detalles
                </button>

                <button
                  onClick={() => onEdit(m)}
                  className="bg-white border border-gray-300 text-gray-800 text-sm px-3 py-1 rounded-md hover:bg-gray-100"
                >
                  Editar
                </button>

                <button
                  onClick={() => onDelete(m)}
                  className="bg-red-600 text-white text-sm px-3 py-1 rounded-md hover:bg-red-700"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-4">No hay materiales registrados.</p>
        )}
      </div>
    </div>
  );
}
