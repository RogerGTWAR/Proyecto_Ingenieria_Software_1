// components/servicios/ServicioCardAvailable.jsx
import React from "react";

const ServicioCardAvailable = ({ servicio, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(servicio)}
      className="bg-white border border-gray-200 p-3 rounded-lg hover:shadow-md cursor-pointer transition-all"
    >
      <h3 className="font-semibold text-gray-800">{servicio.nombreServicio}</h3>
      <p className="text-sm text-gray-500">{servicio.descripcion || "Sin descripción"}</p>

      <div className="mt-2 text-xs text-gray-600">
        <strong>ID:</strong> {servicio.id}
      </div>
    </div>
  );
};

export default ServicioCardAvailable;
