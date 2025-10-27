import React from "react";

const ProductosCard = ({ productos, onEdit, onDelete, onVerDetalles }) => {
  return (
    <div className="w-full bg-[var(--color-fifth)] rounded-2xl shadow-xl shadow-black/10 overflow-hidden">
      {/* 🧭 Encabezado */}
      <div className="grid grid-cols-6 font-semibold text-[var(--color-primary)] bg-gray-100 p-3 border-b border-gray-200 rounded-t-xl">
        <span>Nombre</span>
        <span>Categoría</span>
        <span>Unidad</span>
        <span>Stock</span>
        <span>Precio (C$)</span>
        <span className="text-center">Acciones</span>
      </div>

      {/* 🧾 Filas */}
      <div className="divide-y divide-gray-200">
        {productos.length > 0 ? (
          productos.map((producto, index) => (
            <div
              key={producto.id}
              className={`grid grid-cols-6 items-center px-3 py-2 ${
                index % 2 === 0 ? "bg-gray-50" : "bg-white"
              } hover:bg-gray-100 transition`}
            >
              <span>{producto.nombre_producto || "—"}</span>
              <span>{producto.categoriaNombre || "Sin categoría"}</span>
              <span>{producto.unidad_de_medida || "—"}</span>
              <span>{producto.cantidad_en_stock ?? 0}</span>
              <span>
                {producto.precio_unitario
                  ? Number(producto.precio_unitario).toLocaleString("es-NI", {
                      style: "currency",
                      currency: "NIO",
                      minimumFractionDigits: 2,
                    })
                  : "C$ 0.00"}
              </span>

              {/* 🔘 Botones */}
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => onVerDetalles(producto)}
                  className="text-white text-sm px-3 py-1 rounded-md transition hover:scale-105"
                  style={{ backgroundColor: "#1A2E81" }}
                >
                  Detalles
                </button>
                <button
                  onClick={() => onEdit(producto)}
                  className="bg-white border border-gray-300 text-gray-800 text-sm px-3 py-1 rounded-md hover:bg-gray-100 hover:scale-105 transition"
                >
                  Editar
                </button>
                <button
                  onClick={() => onDelete(producto)}
                  className="bg-red-600 text-white text-sm px-3 py-1 rounded-md hover:bg-red-700 hover:scale-105 transition"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-4">
            No hay productos registrados.
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductosCard;
