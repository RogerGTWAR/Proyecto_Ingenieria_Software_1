import React from "react";

const ServiciosCard = ({ servicios, onEdit, onDelete, onVerDetalles }) => {
  if (!servicios.length) {
    return (
      <p className="text-gray-500 text-center mt-4 text-base">
        No hay servicios registrados.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-4 justify-start">
      {servicios.map((servicio) => (
        <div
          key={servicio.id}
          className="bg-[#F9FAFB] border border-gray-200 rounded-2xl shadow-md 
                     p-5 w-[290px] hover:shadow-lg hover:scale-[1.02] 
                     transition-all duration-200"
        >
          {/* --- Información del servicio --- */}
          <h3 className="font-semibold text-[var(--color-primary)] text-[17px] mb-2 text-center">
            {servicio.nombreServicio}
          </h3>

          <div className="text-[15px] text-gray-700 space-y-1 mb-2">
            <p>
              💰 <strong>Precio:</strong>{" "}
              {servicio.precioUnitario?.toLocaleString("es-NI", {
                style: "currency",
                currency: "NIO",
                minimumFractionDigits: 2,
              })}
            </p>
            <p>
              📦 <strong>Cantidad:</strong> {servicio.cantidad || "—"}
            </p>
            <p>
              💵 <strong>Total:</strong>{" "}
              {servicio.total?.toLocaleString("es-NI", {
                style: "currency",
                currency: "NIO",
                minimumFractionDigits: 2,
              })}
            </p>
            <p>
              ⚙️ <strong>Estado:</strong>{" "}
              <span
                className={`${
                  servicio.estado === "Activo"
                    ? "text-green-600 font-medium"
                    : servicio.estado === "Pendiente"
                    ? "text-yellow-600 font-medium"
                    : "text-gray-600"
                }`}
              >
                {servicio.estado}
              </span>
            </p>
          </div>

          {/* --- Botones de acción --- */}
          <div className="flex justify-center gap-2 mt-3">
            <button
              onClick={() => onVerDetalles(servicio)}
              className="bg-[var(--color-primary)] text-white text-sm px-4 py-1.5 rounded-md hover:scale-105 transition"
              style={{ backgroundColor: "#1A2E81" }}
            >
              Detalles
            </button>
            <button
              onClick={() => onEdit(servicio)}
              className="bg-white border border-gray-300 text-gray-800 text-sm px-4 py-1.5 rounded-md hover:bg-gray-100 hover:scale-105 transition"
            >
              Editar
            </button>
            <button
              onClick={() => onDelete(servicio)}
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

export default ServiciosCard;
