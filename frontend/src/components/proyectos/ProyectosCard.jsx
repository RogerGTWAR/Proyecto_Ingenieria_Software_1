import React from "react";

const ProyectosCard = ({ proyectos, onEdit, onDelete, onVerDetalles }) => {
  return (
    <div className="w-full bg-[var(--color-fifth)] rounded-2xl shadow-xl overflow-hidden">
      <div className="grid grid-cols-6 font-semibold text-[var(--color-primary)] bg-gray-100 p-3 border-b border-gray-200 rounded-t-xl">
        <span>Nombre</span>
        <span>Cliente</span>
        <span>Ubicación</span>
        <span>Estado</span>
        <span>Presupuesto</span>
        <span className="text-center">Acciones</span>
      </div>

      <div className="divide-y divide-gray-200">
        {proyectos.length > 0 ? (
          proyectos.map((p, index) => (
            <div
              key={p.id}
              className={`grid grid-cols-6 items-center px-3 py-2 ${
                index % 2 === 0 ? "bg-gray-50" : "bg-white"
              } hover:bg-gray-100 transition`}
            >
              <span>{p.nombreProyecto}</span>
              <span>{p.clienteNombre || "—"}</span>
              <span>{p.ubicacion || "—"}</span>
              <span>{p.estado}</span>
              <span>C${p.presupuestoTotal.toLocaleString()}</span>

              <div className="flex justify-center gap-2">
                <button
                  onClick={() => onVerDetalles(p)}
                  className="text-white text-sm px-3 py-1 rounded-md transition hover:scale-105"
                  style={{ backgroundColor: "#1A2E81" }}
                >
                  Detalles
                </button>
                <button
                  onClick={() => onEdit(p)}
                  className="bg-white border border-gray-300 text-gray-800 text-sm px-3 py-1 rounded-md hover:bg-gray-100 hover:scale-105 transition"
                >
                  Editar
                </button>
                <button
                  onClick={() => onDelete(p)}
                  className="bg-red-600 text-white text-sm px-3 py-1 rounded-md hover:bg-red-700 hover:scale-105 transition"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-4">
            No hay proyectos registrados.
          </div>
        )}
      </div>
    </div>
  );
};

export default ProyectosCard;
