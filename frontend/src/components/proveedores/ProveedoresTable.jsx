import React from "react";

export default function ProveedoresTable({ proveedores, onEdit, onDelete, onVerDetalles }) {
  return (
    <div className="w-full bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">

      {/* ENCABEZADOS */}
      <div className="grid grid-cols-6 font-semibold text-[#1A2E81] bg-gray-100 p-3 border-b">
        <span>Empresa</span>
        <span>Categoría</span>
        <span>Ciudad</span>
        <span>País</span>
        <span>Teléfono</span>
        <span className="text-center">Acciones</span>
      </div>

      <div className="divide-y divide-gray-200">
        {proveedores.length > 0 ? (
          proveedores.map((p, idx) => (
            <div
              key={p.id}
              className={`grid grid-cols-6 items-center px-3 py-2 ${
                idx % 2 === 0 ? "bg-gray-50" : "bg-white"
              } hover:bg-gray-100 transition`}
            >
              <span>{p.nombre_empresa}</span>
              <span>{p.categoriaNombre || "—"}</span>
              <span>{p.ciudad || "—"}</span>
              <span>{p.pais || "—"}</span>
              <span>{p.telefono || "—"}</span>

              <div className="flex justify-center gap-2">
                <button
                  onClick={() => onVerDetalles(p)}
                  className="text-white text-sm px-3 py-1 rounded-md"
                  style={{ backgroundColor: "#1A2E81" }}
                >
                  Detalles
                </button>

                <button
                  onClick={() => onEdit(p)}
                  className="bg-white border border-gray-300 text-gray-800 text-sm px-3 py-1 rounded-md hover:bg-gray-100"
                >
                  Editar
                </button>

                <button
                  onClick={() => onDelete(p)}
                  className="bg-red-600 text-white text-sm px-3 py-1 rounded-md hover:bg-red-700"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-4">No hay proveedores registrados.</p>
        )}
      </div>
    </div>
  );
}
