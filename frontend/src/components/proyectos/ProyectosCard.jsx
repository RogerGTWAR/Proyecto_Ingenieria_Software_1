import React from "react";

const ProyectosCard = ({ proyectos, onEdit, onDelete, onVerDetalles }) => {
  if (!proyectos.length) {
    return (
      <p className="text-gray-500 text-center mt-4 text-base">
        No hay proyectos registrados.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-4 justify-start">
      {proyectos.map((p) => (
        <div
          key={p.id}
          className="bg-[#F9FAFB] border border-gray-200 rounded-2xl shadow-md 
                     p-5 w-[310px] hover:shadow-lg hover:scale-[1.02] 
                     transition-all duration-200"
        >
          {/* --- Información principal del proyecto --- */}
          <h3 className="font-semibold text-[var(--color-primary)] text-[17px] mb-2 text-center">
            {p.nombreProyecto}
          </h3>

          <div className="text-[15px] text-gray-700 space-y-1 mb-2">
            <p>
              <strong>Cliente:</strong> {p.clienteNombre || "Sin asignar"}
            </p>
            <p>
              <strong>Ubicación:</strong> {p.ubicacion || "No especificada"}
            </p>
            <p>
              <strong>Presupuesto:</strong>{" "}
              {p.presupuestoTotal
                ? `C$${p.presupuestoTotal.toLocaleString("es-NI")}`
                : "—"}
            </p>
            <p>
              <strong>Estado:</strong>{" "}
              <span
                className={`${
                  p.estado === "Activo"
                    ? "text-green-600 font-medium"
                    : p.estado === "Completado"
                    ? "text-blue-600 font-medium"
                    : p.estado === "Cancelado"
                    ? "text-red-600 font-medium"
                    : "text-yellow-600 font-medium"
                }`}
              >
                {p.estado}
              </span>
            </p>
          </div>

          {/* --- Botones de acción --- */}
          <div className="flex justify-center gap-2 mt-3">
            <button
              onClick={() => onVerDetalles(p)}
              className="bg-[var(--color-primary)] text-white text-sm px-4 py-1.5 rounded-md hover:scale-105 transition"
              style={{ backgroundColor: "#1A2E81" }}
            >
              Detalles
            </button>
            <button
              onClick={() => onEdit(p)}
              className="bg-white border border-gray-300 text-gray-800 text-sm px-4 py-1.5 rounded-md hover:bg-gray-100 hover:scale-105 transition"
            >
              Editar
            </button>
            <button
              onClick={() => onDelete(p)}
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

export default ProyectosCard;
