import React from "react";

const AvaluosDetails = ({ avaluo, onClose, onEdit, onDelete }) => {
  if (!avaluo) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-start mt-[120px] z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-8 relative">
        <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-6 text-center">
          Detalles del Avalúo
        </h2>

        <div className="space-y-3 text-[16px] leading-relaxed text-gray-800">
          <p>
            <strong>Proyecto:</strong> {avaluo.proyectoNombre}
          </p>
          <p>
            <strong>Monto Ejecutado:</strong>{" "}
            {Number(avaluo.montoEjecutado).toLocaleString("es-NI", {
              style: "currency",
              currency: "NIO",
              minimumFractionDigits: 2,
            })}
          </p>
          <p>
            <strong>Fecha Inicio:</strong> {avaluo.fechaInicio}
          </p>
          <p>
            <strong>Fecha Fin:</strong> {avaluo.fechaFin}
          </p>
          <p>
            <strong>Tiempo Total (días):</strong> {avaluo.tiempoTotalDias}
          </p>
          <p>
            <strong>Descripción:</strong>{" "}
            {avaluo.descripcion || "Sin descripción"}
          </p>
        </div>

        <div className="flex justify-center gap-6 mt-10">
          <button
            onClick={() => onEdit(avaluo)}
            className="text-white text-base font-medium px-7 py-3 rounded-md transition hover:scale-105"
            style={{ backgroundColor: "#1A2E81", minWidth: "130px" }}
          >
            Editar
          </button>
          <button
            onClick={() => onDelete(avaluo)}
            className="bg-red-600 text-white text-base font-medium px-7 py-3 rounded-md hover:bg-red-700 transition-all"
            style={{ minWidth: "130px" }}
          >
            Eliminar
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-800 text-base font-medium px-7 py-3 rounded-md hover:bg-gray-400 transition-all"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvaluosDetails;
