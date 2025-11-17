import React from "react";

export default function VehiculosTable({ vehiculos, onEdit, onDelete, onVerDetalles }) {
  return (
    <div className="w-full bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">

      {/* ENCABEZADO */}
      <div className="grid grid-cols-7 font-semibold text-[#1A2E81] bg-gray-100 p-3 border-b">
        <span>Placa</span>
        <span>Marca</span>
        <span>Modelo</span>
        <span>Año</span>
        <span>Tipo</span>
        <span>Estado</span>
        <span className="text-center">Acciones</span>
      </div>

      {/* FILAS */}
      <div className="divide-y divide-gray-200">
        {vehiculos.length > 0 ? (
          vehiculos.map((v, idx) => (
            <div
              key={v.id}
              className={`grid grid-cols-7 items-center px-3 py-2 ${
                idx % 2 === 0 ? "bg-gray-50" : "bg-white"
              } hover:bg-gray-100 transition`}
            >
              <span>{v.placa}</span>
              <span>{v.marca}</span>
              <span>{v.modelo}</span>
              <span>{v.anio || "—"}</span>
              <span>{v.tipo_de_vehiculo || "—"}</span>

              <span
                className={`font-medium ${
                  v.estado === "Disponible"
                    ? "text-green-600"
                    : v.estado === "En Mantenimiento"
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              >
                {v.estado}
              </span>

              {/* ACCIONES */}
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => onVerDetalles(v)}
                  className="text-white text-sm px-3 py-1 rounded-md"
                  style={{ backgroundColor: "#1A2E81" }}
                >
                  Detalles
                </button>

                <button
                  onClick={() => onEdit(v)}
                  className="bg-white border border-gray-300 text-gray-800 text-sm px-3 py-1 rounded-md hover:bg-gray-100"
                >
                  Editar
                </button>

                <button
                  onClick={() => onDelete(v)}
                  className="bg-red-600 text-white text-sm px-3 py-1 rounded-md hover:bg-red-700"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-4">No hay vehículos registrados.</p>
        )}
      </div>
    </div>
  );
}
