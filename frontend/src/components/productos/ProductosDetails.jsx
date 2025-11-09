import React from "react";

const ProductosDetails = ({ producto, onClose, onEdit, onDelete }) => {
  if (!producto) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-start mt-[120px] z-50">
      <div className="bg-[#F9FAFB] rounded-xl shadow-lg w-full max-w-xl p-6 relative">
        <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-6 text-center">
          Detalles del Producto
        </h2>

        <div className="space-y-3 text-[15px] leading-relaxed text-gray-800">
          <p><strong>Nombre:</strong> {producto.nombre_producto}</p>
          <p><strong>Categoría:</strong> {producto.categoriaNombre || "Sin categoría"}</p>
          <p><strong>Unidad de Medida:</strong> {producto.unidad_de_medida || "—"}</p>
          <p><strong>Cantidad en Stock:</strong> {producto.cantidad_en_stock ?? 0}</p>
          <p>
            <strong>Precio Unitario:</strong>{" "}
            {producto.precio_unitario
              ? Number(producto.precio_unitario).toLocaleString("es-NI", {
                  style: "currency",
                  currency: "NIO",
                  minimumFractionDigits: 2,
                })
              : "C$ 0.00"}
          </p>
          <p><strong>Descripción:</strong> {producto.descripcion || "—"}</p>
        </div>

        {/* 🔘 Botones */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => onEdit(producto)}
            className="text-white text-base font-medium px-6 py-2 rounded-md transition hover:scale-105"
            style={{ backgroundColor: "#1A2E81", minWidth: "110px" }}
          >
            Editar
          </button>
          <button
            onClick={() => onDelete(producto)}
            className="bg-red-600 text-white text-base font-medium px-6 py-2 rounded-md hover:bg-red-700 transition-all"
            style={{ minWidth: "110px" }}
          >
            Eliminar
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-800 text-base font-medium px-6 py-2 rounded-md hover:bg-gray-400 transition-all"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductosDetails;
