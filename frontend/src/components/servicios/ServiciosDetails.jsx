import React from "react";

const ServiciosDetails = ({ servicio, onClose, onEdit, onDelete }) => {
  if (!servicio) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-start mt-[120px] z-50">
      <div className="bg-[#F9FAFB] rounded-xl shadow-lg w-full max-w-2xl p-8 relative">
        <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-6 text-center">
          Detalles del Servicio
        </h2>

        <div className="space-y-3 text-[16px] leading-relaxed text-gray-800">
          <p><strong>Nombre:</strong> {servicio.nombreServicio}</p>
          <p><strong>Descripción:</strong> {servicio.descripcion || "Sin descripción"}</p>
          <p><strong>Precio Unitario:</strong> C$ {servicio.precioUnitario.toFixed(2)}</p>
          <p><strong>Cantidad:</strong> {servicio.cantidad}</p>
          <p><strong>Total:</strong> C$ {servicio.total.toFixed(2)}</p>
          <p><strong>Unidad de Medida:</strong> {servicio.unidadDeMedida}</p>
          <p><strong>Estado:</strong> {servicio.estado}</p>
          <p><strong>Fecha Inicio:</strong> {servicio.fechaInicio || "—"}</p>
          <p><strong>Fecha Fin:</strong> {servicio.fechaFin || "—"}</p>
          <p><strong>Duración (días):</strong> {servicio.tiempoTotalDias ?? 0}</p>
        </div>

        <div className="flex justify-center gap-6 mt-10">
          <button
            onClick={() => onEdit(servicio)}
            className="text-white text-base font-medium px-7 py-3 rounded-md transition hover:scale-105"
            style={{ backgroundColor: "#1A2E81", minWidth: "130px" }}
          >
            Editar
          </button>
          <button
            onClick={() => onDelete(servicio)}
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

export default ServiciosDetails;
