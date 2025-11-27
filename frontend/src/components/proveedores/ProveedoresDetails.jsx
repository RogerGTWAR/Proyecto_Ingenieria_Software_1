import React from "react";

const ProveedoresDetails = ({ proveedor, onClose, onEdit, onDelete }) => {
  if (!proveedor) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-start mt-[120px] z-50">
      <div className="bg-[#F9FAFB] rounded-xl shadow-lg w-full max-w-lg p-8 relative">
        <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-6 text-center">
          Detalles del Proveedor
        </h2>

        <div className="space-y-2 text-[16px] leading-relaxed text-gray-800">
          <p><strong>Empresa:</strong> {proveedor.nombre_empresa}</p>
          <p><strong>Categoría:</strong> {proveedor.categoriaNombre}</p>
          <p><strong>Contacto:</strong> {proveedor.nombre_contacto || "No registrado"}</p>
          <p><strong>Cargo:</strong> {proveedor.cargo_contacto || "—"}</p>
          <p><strong>Dirección:</strong> {proveedor.direccion || "—"}</p>
          <p><strong>Ciudad:</strong> {proveedor.ciudad || "—"}</p>
          <p><strong>País:</strong> {proveedor.pais || "—"}</p>
          <p><strong>Teléfono:</strong> {proveedor.telefono || "—"}</p>
          <p><strong>Correo:</strong> {proveedor.correo || "—"}</p>
        </div>

        <div className="flex justify-center gap-6 mt-10">
          <button
            onClick={() => onEdit(proveedor)}
            className="text-white text-base font-medium px-7 py-3 rounded-md transition hover:scale-105"
            style={{ backgroundColor: "#1A2E81", minWidth: "130px" }}
          >
            Editar
          </button>
          <button
            onClick={() => onDelete(proveedor)}
            className="bg-red-600 text-white text-base font-medium px-7 py-3 rounded-md hover:bg-red-700 transition-all"
            style={{ minWidth: "130px" }}
          >
            Eliminar
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-800 text-base font-medium px-7 py-3 rounded-md hover:bg-gray-400 transition-all"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProveedoresDetails;
