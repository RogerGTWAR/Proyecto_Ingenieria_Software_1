import React from "react";

const ProductosCard = ({ productos, onEdit, onDelete, onVerDetalles }) => {
  if (!productos.length) {
    return (
      <p className="text-gray-500 text-center mt-4 text-base">
        No hay productos registrados.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-4 justify-start">
      {productos.map((producto) => (
        <div
          key={producto.id}
          className="bg-[#F9FAFB] border border-gray-200 rounded-2xl shadow-md 
                     p-5 w-[290px] hover:shadow-lg hover:scale-[1.02] 
                     transition-all duration-200"
        >
          {/* --- Información del producto --- */}
          <h3 className="font-semibold text-[var(--color-primary)] text-[17px] mb-2 text-center">
            {producto.nombre_producto}
          </h3>

          <div className="text-[15px] text-gray-700 space-y-1 mb-2">
            <p>
              🏷️ <strong>Categoría:</strong>{" "}
              {producto.categoriaNombre || "Sin categoría"}
            </p>
            <p>
              📦 <strong>Unidad:</strong> {producto.unidad_de_medida || "—"}
            </p>
            <p>
              🔢 <strong>Stock:</strong> {producto.cantidad_en_stock ?? 0}
            </p>
            <p>
              💰 <strong>Precio:</strong>{" "}
              {producto.precio_unitario
                ? Number(producto.precio_unitario).toLocaleString("es-NI", {
                    style: "currency",
                    currency: "NIO",
                    minimumFractionDigits: 2,
                  })
                : "C$ 0.00"}
            </p>
          </div>

          {/* --- Botones de acción --- */}
          <div className="flex justify-center gap-2 mt-3">
            <button
              onClick={() => onVerDetalles(producto)}
              className="bg-[var(--color-primary)] text-white text-sm px-4 py-1.5 rounded-md hover:scale-105 transition"
              style={{ backgroundColor: "#1A2E81" }}
            >
              Detalles
            </button>
            <button
              onClick={() => onEdit(producto)}
              className="bg-white border border-gray-300 text-gray-800 text-sm px-4 py-1.5 rounded-md hover:bg-gray-100 hover:scale-105 transition"
            >
              Editar
            </button>
            <button
              onClick={() => onDelete(producto)}
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

export default ProductosCard;
