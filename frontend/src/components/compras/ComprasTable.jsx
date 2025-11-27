import React from "react";

export default function ComprasTable({ compras, onEdit, onDelete, onVerDetalles }) {
  return (
    <div className="w-full bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">

      {/* ENCABEZADO */}
      <div className="grid grid-cols-7 font-semibold text-[#1A2E81] bg-gray-100 p-3 border-b">
        <span>ID</span>
        <span>Factura</span>
        <span>Proveedor</span>
        <span>Fecha</span>
        <span>Monto</span>
        <span>Estado</span>
        <span className="text-center">Acciones</span>
      </div>

      {/* FILAS */}
      <div className="divide-y divide-gray-200">
        {compras.length > 0 ? (
          compras.map((c, idx) => (
            <div
              key={c.id}
              className={`grid grid-cols-7 items-center px-3 py-2 ${
                idx % 2 === 0 ? "bg-gray-50" : "bg-white"
              } hover:bg-gray-100 transition`}
            >
              <span>{c.id}</span>
              <span>{c.numero_factura}</span>
              <span>{c.proveedorNombre}</span>
              <span>{c.fecha_compra}</span>
              <span>C$ {c.monto_total.toFixed(2)}</span>

              <span
                className={`font-medium ${
                  c.estado === "Pagada"
                    ? "text-green-600"
                    : c.estado === "Pendiente"
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              >
                {c.estado}
              </span>

              <div className="flex justify-center gap-2">
                <button
                  onClick={() => onVerDetalles(c)}
                  className="text-white text-sm px-3 py-1 rounded-md"
                  style={{ backgroundColor: "#1A2E81" }}
                >
                  Detalles
                </button>

                <button
                  onClick={() => onEdit(c)}
                  className="bg-white border border-gray-300 text-gray-800 text-sm px-3 py-1 rounded-md hover:bg-gray-100"
                >
                  Editar
                </button>

                <button
                  onClick={() => onDelete(c)}
                  className="bg-red-600 text-white text-sm px-3 py-1 rounded-md hover:bg-red-700"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-4">No hay compras registradas.</p>
        )}
      </div>
    </div>
  );
}
