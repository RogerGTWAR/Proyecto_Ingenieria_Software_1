import React from "react";

const ClientesDetails = ({ cliente, onClose, onEdit, onDelete }) => {
  if (!cliente) return null;

  return (
    <div className="fixed top-[100px] left-1/2 -translate-x-1/2 z-50 w-full flex justify-center">
      <div className="bg-[#F9FAFB] rounded-2xl shadow-md border border-gray-200 w-full max-w-4xl p-10">
        <h1 className="text-3xl font-bold text-[var(--color-primary)] text-center mb-10">
          Detalles del Cliente
        </h1>

        <div className="grid grid-cols-2 gap-10 text-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
              Información Principal
            </h2>
            <div className="space-y-3 text-[16px] leading-relaxed text-gray-700">
              <p><strong>ID:</strong> {cliente.id}</p>
              <p><strong>Empresa:</strong> {cliente.nombreEmpresa}</p>
              <p><strong>Dirección:</strong> {cliente.direccion || "—"}</p>
              <p><strong>Ciudad:</strong> {cliente.ciudad || "—"}</p>
              <p><strong>País:</strong> {cliente.pais || "—"}</p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
              Información de Contacto
            </h2>
            <div className="space-y-3 text-[16px] leading-relaxed text-gray-700">
              <p><strong>Nombre:</strong> {cliente.nombreContacto || "—"}</p>
              <p><strong>Cargo:</strong> {cliente.cargoContacto || "—"}</p>
              <p><strong>Teléfono:</strong> {cliente.telefono || "—"}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-6 mt-12">
          <button
            onClick={() => onEdit?.(cliente)}
            className="text-white text-base font-medium px-7 py-3 rounded-md transition hover:scale-105"
            style={{ backgroundColor: "#1A2E81", minWidth: "130px" }}
          >
            Editar
          </button>
          <button
            onClick={() => onDelete?.(cliente)}
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

export default ClientesDetails;
