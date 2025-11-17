import React from "react";

export default function ServiciosTable({ servicios, onEdit, onDelete, onVerDetalles }) {
  return (
    <div className="w-full bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">

      <div className="grid grid-cols-5 font-semibold text-[#1A2E81] bg-gray-100 p-3 border-b">
        <span>Servicio</span>
        <span>Descripción</span>
        <span>Costo Directo</span>
        <span>Costo Indirecto</span>
        <span className="text-center">Acciones</span>
      </div>

      <div className="divide-y divide-gray-200">
        {servicios.length > 0 ? (
          servicios.map((s, index) => (
            <div
              key={s.id}
              className={`grid grid-cols-5 items-center px-3 py-2 ${
                index % 2 === 0 ? "bg-gray-50" : "bg-white"
              } hover:bg-gray-100 transition`}
            >
              <span>{s.nombreServicio}</span>
              <span>{s.descripcion || "—"}</span>
              <span>C${s.totalCostoDirecto.toLocaleString("es-NI")}</span>
              <span>C${s.totalCostoIndirecto.toLocaleString("es-NI")}</span>

              <div className="flex justify-center gap-2">
                <button
                  onClick={() => onVerDetalles(s)}
                  className="text-white text-sm px-3 py-1 rounded-md"
                  style={{ backgroundColor: "#1A2E81" }}
                >
                  Detalles
                </button>

                <button
                  onClick={() => onEdit(s)}
                  className="bg-white border border-gray-300 text-gray-800 text-sm px-3 py-1 rounded-md hover:bg-gray-100"
                >
                  Editar
                </button>

                <button
                  onClick={() => onDelete(s)}
                  className="bg-red-600 text-white text-sm px-3 py-1 rounded-md hover:bg-red-700"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-4">No hay servicios registrados.</p>
        )}
      </div>
    </div>
  );
}
