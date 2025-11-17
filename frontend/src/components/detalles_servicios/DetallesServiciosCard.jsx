// DetallesServiciosCard.jsx
import React from "react";

const DetallesServiciosCard = ({ detalles, onEdit, onDelete, onVerDetalles }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

      {/* HEADER */}
      <div className="grid grid-cols-6 bg-gray-100 px-4 py-3 font-semibold text-gray-700 text-sm border-b">
        <span>Material</span>
        <span>Cant.</span>
        <span>Unidad</span>
        <span>Precio U.</span>
        <span>Total</span>
        <span className="text-center">Acciones</span>
      </div>

      {detalles.length ? (
        detalles.map((d) => (
          <div
            key={d.id}
            className="grid grid-cols-6 items-center px-4 py-3 text-sm hover:bg-gray-50 transition"
          >
            <span>{d.materialNombre}</span>
            <span>{d.cantidad}</span>
            <span>{d.unidad}</span>
            <span>C$ {d.precioUnitario}</span>
            <span className="font-semibold text-[var(--color-primary)]">
              C$ {d.total}
            </span>

            <div className="flex gap-2 justify-center">
              <button
                onClick={() => onVerDetalles(d)}
                className="px-3 py-1 bg-[var(--color-primary)] text-white rounded-md text-xs hover:opacity-90"
              >
                Ver
              </button>

              <button
                onClick={() => onEdit(d)}
                className="px-3 py-1 border border-gray-300 text-gray-800 rounded-md text-xs hover:bg-gray-100"
              >
                Editar
              </button>

              <button
                onClick={() => onDelete(d)}
                className="px-3 py-1 bg-red-600 text-white rounded-md text-xs hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="p-6 text-center text-gray-500 text-sm">
          No hay materiales asignados.
        </div>
      )}
    </div>
  );
};

export default DetallesServiciosCard;
