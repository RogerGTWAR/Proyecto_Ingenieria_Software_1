import React from "react";

const MaterialesCard = ({ materiales, onEdit, onDelete, onVerDetalles }) => {
  if (!materiales.length) {
    return (
      <p className="text-gray-500 text-center mt-4 text-base">
        No hay materiales registrados.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-4 justify-start">
      {materiales.map((material) => (
        <div
          key={material.id}
          className="bg-[#F9FAFB] border border-gray-200 rounded-2xl shadow-md 
                     p-5 w-[290px] hover:shadow-lg hover:scale-[1.02] 
                     transition-all duration-200"
        >
          <h3 className="font-semibold text-[var(--color-primary)] text-[17px] mb-2 text-center">
            {material.nombre_material}
          </h3>

          <div className="text-[15px] text-gray-700 space-y-1 mb-2">
            <p>
              <strong>Categoría:</strong>{" "}
              {material.categoriaNombre || "Sin categoría"}
            </p>
            <p>
              <strong>Unidad:</strong> {material.unidad_de_medida || "—"}
            </p>
            <p>
              <strong>Stock:</strong> {material.cantidad_en_stock ?? 0}
            </p>
            <p>
              <strong>Precio:</strong>{" "}
              {material.precio_unitario
                ? Number(material.precio_unitario).toLocaleString("es-NI", {
                    style: "currency",
                    currency: "NIO",
                    minimumFractionDigits: 2,
                  })
                : "C$ 0.00"}
            </p>
          </div>

          <div className="flex justify-center gap-2 mt-3">
            <button
              onClick={() => onVerDetalles(material)}
              className="bg-[var(--color-primary)] text-white text-sm px-4 py-1.5 rounded-md hover:scale-105 transition"
              style={{ backgroundColor: "#1A2E81" }}
            >
              Detalles
            </button>

            <button
              onClick={() => onEdit(material)}
              className="bg-white border border-gray-300 text-gray-800 text-sm px-4 py-1.5 rounded-md hover:bg-gray-100 hover:scale-105 transition"
            >
              Editar
            </button>

            <button
              onClick={() => onDelete(material)}
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

export default MaterialesCard;
