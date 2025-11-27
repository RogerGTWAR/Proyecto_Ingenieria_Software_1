import React from "react";

const ComprasCard = ({ compras, onEdit, onDelete, onVerDetalles }) => {
  if (!compras.length) {
    return (
      <p className="text-gray-500 text-center mt-4 text-base">
        No hay compras registradas.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-3 justify-start">
      {compras.map((c) => (
        <div
          key={c.id}
          className="bg-[#F9FAFB] border border-gray-200 rounded-xl shadow-sm 
                     p-4 w-[280px] hover:shadow-md hover:scale-[1.01] 
                     transition-all duration-200"
        >
          <h3 className="font-semibold text-[var(--color-primary)] text-[17px] mb-1">
            Compra #{c.id}
          </h3>

          <p className="text-[15px] text-gray-700 mb-1">
            🧾 Factura: <span className="font-medium">{c.numero_factura}</span>
          </p>

          <p className="text-[15px] text-gray-600 mb-1">
            Fecha: {c.fecha_compra || "—"}
          </p>

          <p className="text-[15px] text-gray-600 mb-1">
            Proveedor: {c.proveedorNombre}
          </p>

          <p className="text-[15px] text-gray-600 mb-1">
            Monto Total: C$ {c.monto_total?.toFixed(2)}
          </p>

          <p
            className={`text-[15px] font-medium mb-1 ${
              c.estado === "Pagada"
                ? "text-green-600"
                : c.estado === "Pendiente"
                ? "text-yellow-600"
                : "text-red-600"
            }`}
          >
            Estado: {c.estado}
          </p>

          <div className="flex justify-center gap-2 mt-3">
            <button
              onClick={() => onVerDetalles(c)}
              className="text-white text-sm px-3 py-1 rounded-md transition hover:scale-105"
              style={{ backgroundColor: "#1A2E81" }}
            >
              Detalles
            </button>
            <button
              onClick={() => onEdit(c)}
              className="bg-white border border-gray-300 text-gray-800 text-sm px-3 py-1 rounded-md hover:bg-gray-100 hover:scale-105 transition"
            >
              Editar
            </button>
            <button
              onClick={() => onDelete(c)}
              className="bg-red-600 text-white text-sm px-3 py-1 rounded-md hover:bg-red-700 hover:scale-105 transition"
            >
              Eliminar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ComprasCard;
