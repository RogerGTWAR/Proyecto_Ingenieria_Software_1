import React from "react";

const VehiculosCard = ({ vehiculos, onEdit, onDelete, onVerDetalles }) => {
  if (!vehiculos.length) {
    return (
      <p className="text-gray-500 text-center mt-4 text-base">
        No hay vehículos registrados.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-3 justify-start">
      {vehiculos.map((v) => (
        <div
          key={v.id}
          className="bg-[#F9FAFB] border border-gray-200 rounded-xl shadow-sm 
                     p-4 w-[280px] hover:shadow-md hover:scale-[1.01] 
                     transition-all duration-200"
        >
          {/* --- Información principal del vehículo --- */}
          <h3 className="font-semibold text-[var(--color-primary)] text-[17px] mb-1">
            {v.marca} {v.modelo}
          </h3>
          <p className="text-[15px] text-gray-700 mb-1">
            🚘 Placa: <span className="font-medium">{v.placa}</span>
          </p>
          <p className="text-[15px] text-gray-600 mb-1">
            Año: {v.anio || "—"}
          </p>
          <p className="text-[15px] text-gray-600 mb-1">
            Tipo: {v.tipo_de_vehiculo || "—"}
          </p>
          <p className="text-[15px] text-gray-600 mb-1">
            Combustible: {v.tipo_de_combustible || "—"}
          </p>
          <p
            className={`text-[15px] font-medium mb-1 ${
              v.estado === "Disponible"
                ? "text-green-600"
                : v.estado === "En Mantenimiento"
                ? "text-yellow-600"
                : "text-red-600"
            }`}
          >
            Estado: {v.estado || "—"}
          </p>
          <p className="text-[15px] text-gray-600 mb-2">
            Proveedor: {v.proveedorNombre || "—"}
          </p>

          {/* --- Botones de acción --- */}
          <div className="flex justify-center gap-2 mt-3">
            <button
              onClick={() => onVerDetalles(v)}
              className="text-white text-sm px-3 py-1 rounded-md transition hover:scale-105"
              style={{ backgroundColor: "#1A2E81" }}
            >
              Detalles
            </button>
            <button
              onClick={() => onEdit(v)}
              className="bg-white border border-gray-300 text-gray-800 text-sm px-3 py-1 rounded-md hover:bg-gray-100 hover:scale-105 transition"
            >
              Editar
            </button>
            <button
              onClick={() => onDelete(v)}
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

export default VehiculosCard;
