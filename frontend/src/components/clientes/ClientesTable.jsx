import React from "react";

export default function ClientesTable({ clientes, onEdit, onDelete, onVerDetalles }) {
  return (
    <div className="w-full bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
      
      {/* Encabezados */}
      <div className="grid grid-cols-6 font-semibold text-[#1A2E81] bg-gray-100 p-3 border-b">
        <span>Empresa</span>
        <span>Contacto</span>
        <span>Cargo</span>
        <span>Ciudad</span>
        <span>Teléfono</span>
        <span className="text-center">Acciones</span>
      </div>

      {/* Filas */}
      <div className="divide-y divide-gray-200">
        {clientes.length > 0 ? (
          clientes.map((c, idx) => (
            <div
              key={c.id}
              className={`grid grid-cols-6 items-center px-3 py-2 ${
                idx % 2 === 0 ? "bg-gray-50" : "bg-white"
              } hover:bg-gray-100 transition`}
            >
              <span>{c.nombreEmpresa}</span>
              <span>{c.nombreContacto || "—"}</span>
              <span>{c.cargoContacto || "—"}</span>
              <span>{c.ciudad || "—"}</span>
              <span>{c.telefono || "—"}</span>

              {/* Acciones */}
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
          <p className="text-center text-gray-500 py-4">No hay clientes registrados.</p>
        )}
      </div>
    </div>
  );
}
