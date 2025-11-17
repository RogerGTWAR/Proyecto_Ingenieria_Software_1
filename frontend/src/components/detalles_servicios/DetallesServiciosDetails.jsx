// DetallesServiciosDetails.jsx
import React from "react";

const money = (n) => `C$ ${Number(n).toFixed(2)}`;

const DetallesServiciosDetails = ({ detalle, onClose, onEdit, onDelete }) => {
  if (!detalle) return null;

  return (
    <div className="fixed top-[100px] left-1/2 -translate-x-1/2 z-50 w-full flex justify-center">
      <div className="bg-[#F9FAFB] rounded-2xl shadow-md border border-gray-200 w-full max-w-3xl p-10">

        <h1 className="text-3xl font-bold text-[var(--color-primary)] text-center mb-10">
          Material Asignado al Servicio
        </h1>

        {/* INFO GENERAL */}
        <div className="space-y-4 text-gray-700 text-lg">
          <p><strong>Servicio:</strong> {detalle.servicioNombre}</p>
          <p><strong>Material:</strong> {detalle.materialNombre}</p>
          <p><strong>Descripción:</strong> {detalle.descripcion}</p>
        </div>

        {/* INFO TÉCNICA */}
        <div className="grid grid-cols-2 gap-6 bg-gray-50 p-4 rounded-xl border mt-6">
          <p><strong>Cantidad:</strong> {detalle.cantidad}</p>
          <p><strong>Unidad:</strong> {detalle.unidad}</p>
          <p><strong>Precio Unitario:</strong> {money(detalle.precioUnitario)}</p>
          <p><strong>Total:</strong> {money(detalle.total)}</p>
        </div>

        {/* BOTONES */}
        <div className="flex justify-center gap-6 mt-12">
          <button
            onClick={() => onEdit(detalle)}
            className="text-white px-7 py-3 rounded-md hover:scale-105"
            style={{ backgroundColor: "#1A2E81" }}
          >
            Editar
          </button>

          <button
            onClick={() => onDelete(detalle)}
            className="bg-red-600 text-white px-7 py-3 rounded-md hover:bg-red-700"
          >
            Eliminar
          </button>

          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-800 px-7 py-3 rounded-md hover:bg-gray-400"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetallesServiciosDetails;
