import React from "react";

const ClientesCard = ({ clientes = [], onEdit, onDelete, onVerDetalles }) => {
  return (
    <div className="w-full bg-[var(--color-fifth)] rounded-2xl shadow-xl shadow-black/10 overflow-hidden">
      {/* 🧭 Encabezados */}
      <div className="grid grid-cols-6 font-semibold text-[var(--color-primary)] bg-gray-100 p-3 border-b border-gray-200 rounded-t-xl">
        <span>ID</span>
        <span>Empresa</span>
        <span>Contacto</span>
        <span>Cargo</span>
        <span>Teléfono</span>
        <span className="text-center">Acciones</span>
      </div>

      {/* 🧩 Filas */}
      <div className="divide-y divide-gray-200">
        {clientes.length > 0 ? (
          clientes.map((c, index) => (
            <div
              key={c.id}
              className={`grid grid-cols-6 items-center px-3 py-2 ${
                index % 2 === 0 ? "bg-gray-50" : "bg-white"
              } hover:bg-gray-100 transition`}
            >
              <span>{c.id}</span>
              <span>{c.nombreEmpresa}</span>
              <span>{c.nombreContacto || "—"}</span>
              <span>{c.cargoContacto || "—"}</span>
              <span>{c.telefono || "—"}</span>

              <div className="flex justify-center gap-2">
                {/* ✅ Botón Detalles */}
                <button
                  onClick={() => onVerDetalles && onVerDetalles(c)}
                  className="text-white text-sm px-3 py-1 rounded-md transition hover:scale-105"
                  style={{ backgroundColor: "#1A2E81" }}
                >
                  Detalles
                </button>

                <button
                  onClick={() => onEdit && onEdit(c)}
                  className="bg-white border border-gray-300 text-gray-800 text-sm px-3 py-1 rounded-md hover:bg-gray-100 hover:scale-105 transition"
                >
                  Editar
                </button>

                <button
                  onClick={() => onDelete && onDelete(c)}
                  className="bg-red-600 text-white text-sm px-3 py-1 rounded-md hover:bg-red-700 hover:scale-105 transition"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-4">
            No hay clientes registrados.
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientesCard;
