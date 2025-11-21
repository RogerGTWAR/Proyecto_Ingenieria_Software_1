import React from "react";

const ClientesCard = ({ clientes, onEdit, onDelete, onVerDetalles }) => {
  if (!clientes.length) {
    return (
      <p className="text-gray-500 text-center mt-4 text-base">
        No hay clientes registrados.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-3 justify-start">
      {clientes.map((c) => (
        <div
          key={c.id}
          className="bg-[#F9FAFB] border border-gray-200 rounded-xl shadow-sm 
                     p-4 w-[280px] hover:shadow-md hover:scale-[1.01] 
                     transition-all duration-200"
        >
          {/* --- Información del cliente --- */}
          <h3 className="font-semibold text-[var(--color-primary)] text-[17px] mb-1">
            {c.nombreEmpresa}
          </h3>
          <p className="text-[15px] text-gray-700 mb-1">
            {c.nombreContacto || "Sin contacto"}
          </p>
          <p className="text-[15px] text-gray-600 mb-1">
            Cargo: {c.cargoContacto || "—"}
          </p>
          <p className="text-[15px] text-gray-600 flex items-center gap-1 mb-2">
            {c.telefono || "Sin teléfono"}
          </p>

          {/* --- Botones de acción --- */}
          <div className="flex justify-center gap-2 mt-3">
            <button
              onClick={() => onVerDetalles(c)}
              className="text-white text-sm px-3 py-1 rounded-md transition hover:scale-105"
              style={{ backgroundColor: "#1A2E81" }}
            >
              Detalles
            </button>
            <button
              onClick={() => onEdit(c)}
              className="bg-white border border-gray-300 text-gray-800 text-sm px-3 py-1 rounded-md hover:bg-gray-100 hover:scale-105 transition"
            >
              Editar
            </button>
            <button
              onClick={() => onDelete(c)}
              className="bg-red-600 text-white text-sm px-3 py-1 rounded-md hover:bg-red-700 hover:scale-105 transition"
            >
              Eliminar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ClientesCard;
