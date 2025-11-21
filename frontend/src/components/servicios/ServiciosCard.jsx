import React from "react";

export default function ServiciosCard({ servicios, onEdit, onDelete, onVerDetalles }) {
  if (!servicios.length) {
    return (
      <p className="text-gray-500 text-center mt-4 text-base">
        No hay servicios registrados.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-4 justify-start">
      {servicios.map((s) => (
        <div
          key={s.id}
          className="bg-[#F9FAFB] border border-gray-200 rounded-2xl shadow-md 
                     p-5 w-[310px] hover:shadow-lg hover:scale-[1.02] 
                     transition-all duration-200"
        >
          <h3 className="font-semibold text-[var(--color-primary)] text-[17px] mb-2 text-center">
            {s.nombreServicio}
          </h3>

          <div className="text-[15px] text-gray-700 space-y-1 mb-3">
            <p>
              <strong>Descripción:</strong> {s.descripcion || "No especificada"}
            </p>
            <p>
              <strong>Costo Directo:</strong>{" "}
              C${s.totalCostoDirecto.toLocaleString("es-NI")}
            </p>
            <p>
              <strong>Costo Indirecto:</strong>{" "}
              C${s.totalCostoIndirecto.toLocaleString("es-NI")}
            </p>
            <p>
              <strong>Costo de Venta:</strong>{" "}
              <span className="text-green-700 font-bold">
                C${s.costoVenta.toLocaleString("es-NI")}
              </span>
            </p>
          </div>

          <div className="flex justify-center gap-2 mt-3">
            <button
              onClick={() => onVerDetalles(s)}
              className="bg-[var(--color-primary)] text-white text-sm px-4 py-1.5 rounded-md hover:scale-105 transition"
              style={{ backgroundColor: "#1A2E81" }}
            >
              Detalles
            </button>
            <button
              onClick={() => onEdit(s)}
              className="bg-white border border-gray-300 text-gray-800 text-sm px-4 py-1.5 rounded-md hover:bg-gray-100 hover:scale-105 transition"
            >
              Editar
            </button>
            <button
              onClick={() => onDelete(s)}
              className="bg-red-500 text-white text-sm px-4 py-1.5 rounded-md hover:bg-red-600 hover:scale-105 transition"
            >
              Eliminar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
