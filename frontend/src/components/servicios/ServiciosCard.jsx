import React from "react";

const ServiciosCard = ({ servicios, onEdit, onDelete, onVerDetalles }) => {
  return (
    <div className="w-full bg-[var(--color-fifth)] rounded-2xl shadow-xl shadow-black/10 overflow-hidden">
      <div className="grid grid-cols-6 font-semibold text-[var(--color-primary)] bg-gray-100 p-3 border-b border-gray-200 rounded-t-xl">
        <span>Nombre</span>
        <span>Precio Unitario (C$)</span>
        <span>Cantidad</span>
        <span>Total (C$)</span>
        <span>Estado</span>
        <span className="text-center">Acciones</span>
      </div>

      <div className="divide-y divide-gray-200">
        {servicios.length > 0 ? (
          servicios.map((servicio, index) => (
            <div
              key={servicio.id}
              className={`grid grid-cols-6 items-center px-3 py-2 ${
                index % 2 === 0 ? "bg-gray-50" : "bg-white"
              } hover:bg-gray-100 transition`}
            >
              <span>{servicio.nombreServicio}</span>
              <span>
                {servicio.precioUnitario.toLocaleString("es-NI", {
                  style: "currency",
                  currency: "NIO",
                  minimumFractionDigits: 2,
                })}
              </span>
              <span>{servicio.cantidad}</span>
              <span>
                {servicio.total.toLocaleString("es-NI", {
                  style: "currency",
                  currency: "NIO",
                  minimumFractionDigits: 2,
                })}
              </span>
              <span>{servicio.estado}</span>

              <div className="flex justify-center gap-2">
                <button
                  onClick={() => onVerDetalles(servicio)}
                  className="text-white text-sm px-3 py-1 rounded-md transition hover:scale-105"
                  style={{ backgroundColor: "#1A2E81" }}
                >
                  Detalles
                </button>
                <button
                  onClick={() => onEdit(servicio)}
                  className="bg-white border border-gray-300 text-gray-800 text-sm px-3 py-1 rounded-md hover:bg-gray-100 hover:scale-105 transition"
                >
                  Editar
                </button>
                <button
                  onClick={() => onDelete(servicio)}
                  className="bg-red-600 text-white text-sm px-3 py-1 rounded-md hover:bg-red-700 hover:scale-105 transition"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-4">
            No hay servicios registrados.
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiciosCard;
