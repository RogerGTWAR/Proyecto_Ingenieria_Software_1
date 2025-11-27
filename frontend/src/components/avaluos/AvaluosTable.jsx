import React from "react";

export default function AvaluosTable({ avaluos, onEdit, onDelete, onVerDetalles }) {
  return (
    <div className="w-full bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
      
      <div className="grid grid-cols-6 font-semibold text-[#1A2E81] bg-gray-100 p-3 border-b">
        <span>Proyecto</span>
        <span>Descripción</span>
        <span>Fecha Inicio</span>
        <span>Fecha Fin</span>
        <span>Monto Ejecutado</span>
        <span className="text-center">Acciones</span>
      </div>

      <div className="divide-y divide-gray-200">
        {avaluos.length > 0 ? (
          avaluos.map((a, idx) => (
            <div
              key={a.id}
              className={`grid grid-cols-6 items-center px-3 py-2 ${
                idx % 2 === 0 ? "bg-gray-50" : "bg-white"
              } hover:bg-gray-100 transition`}
            >
              <span>{a.proyectoNombre || `Proyecto ${a.proyectoId}`}</span>

              <span>{a.descripcion || "—"}</span>

              <span>{a.fechaInicio?.slice(0, 10) || "—"}</span>
              <span>{a.fechaFin?.slice(0, 10) || "—"}</span>

              <span className="font-semibold text-green-700">
                C${Number(a.montoEjecutado || 0).toLocaleString("es-NI")}
              </span>

              <div className="flex justify-center gap-2">
                <button
                  onClick={() => onVerDetalles(a)}
                  className="text-white text-sm px-3 py-1 rounded-md"
                  style={{ backgroundColor: "#1A2E81" }}
                >
                  Detalles
                </button>

                <button
                  onClick={() => onEdit(a)}
                  className="bg-white border border-gray-300 text-gray-800 text-sm px-3 py-1 rounded-md hover:bg-gray-100"
                >
                  Editar
                </button>

                <button
                  onClick={() => onDelete(a)}
                  className="bg-red-600 text-white text-sm px-3 py-1 rounded-md hover:bg-red-700"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-4">No hay avalúos registrados.</p>
        )}
      </div>
    </div>
  );
}
