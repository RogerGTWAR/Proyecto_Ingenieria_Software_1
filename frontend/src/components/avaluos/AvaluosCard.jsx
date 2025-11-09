import React from "react";

const AvaluosCard = ({ avaluos, onEdit, onDelete, onVerDetalles }) => {
  if (!avaluos.length) {
    return (
      <p className="text-gray-500 text-center mt-4 text-base">
        No hay avalúos registrados.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-4 justify-start">
      {avaluos.map((avaluo) => (
        <div
          key={avaluo.id}
          className="bg-[#F9FAFB] border border-gray-200 rounded-2xl shadow-md 
                     p-5 w-[310px] hover:shadow-lg hover:scale-[1.02] 
                     transition-all duration-200"
        >
          {/* --- Información del avalúo --- */}
          <h3 className="font-semibold text-[var(--color-primary)] text-[17px] mb-2 text-center">
            {avaluo.proyectoNombre}
          </h3>

          <div className="text-[15px] text-gray-700 space-y-1 mb-2">
            <p>
              💰 <strong>Monto ejecutado:</strong>{" "}
              {avaluo.montoEjecutado
                ? Number(avaluo.montoEjecutado).toLocaleString("es-NI", {
                    style: "currency",
                    currency: "NIO",
                    minimumFractionDigits: 2,
                  })
                : "C$ 0.00"}
            </p>
            <p>📅 <strong>Inicio:</strong> {avaluo.fechaInicio || "—"}</p>
            <p>📆 <strong>Fin:</strong> {avaluo.fechaFin || "—"}</p>
            <p>⏱️ <strong>Días totales:</strong> {avaluo.tiempoTotalDias ?? "—"}</p>
          </div>

          {/* --- Botones de acción --- */}
          <div className="flex justify-center gap-2 mt-3">
            <button
              onClick={() => onVerDetalles(avaluo)}
              className="bg-[var(--color-primary)] text-white text-sm px-4 py-1.5 rounded-md hover:scale-105 transition"
              style={{ backgroundColor: "#1A2E81" }}
            >
              Detalles
            </button>
            <button
              onClick={() => onEdit(avaluo)}
              className="bg-white border border-gray-300 text-gray-800 text-sm px-4 py-1.5 rounded-md hover:bg-gray-100 hover:scale-105 transition"
            >
              Editar
            </button>
            <button
              onClick={() => onDelete(avaluo)}
              className="bg-red-500 text-white text-sm px-4 py-1.5 rounded-md hover:bg-red-600 hover:scale-105 transition"
            >
              Eliminar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AvaluosCard;
