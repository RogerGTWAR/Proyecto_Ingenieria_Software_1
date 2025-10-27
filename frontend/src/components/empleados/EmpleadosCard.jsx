import { useState } from "react";

const EmpleadosCard = ({ empleados, rolNameById, onEdit, onDelete, onVerDetalles, obtenerColorRol }) => {
  return (
    <div className="w-full bg-[var(--color-fifth)] rounded-2xl shadow-xl shadow-black/10 overflow-hidden">
      <div className="grid grid-cols-6 font-semibold text-[var(--color-primary)] bg-gray-100 p-3 border-b border-gray-200 rounded-t-xl">
        <span>Nombres</span>
        <span>Apellidos</span>
        <span>Rol</span>
        <span>Cédula</span>
        <span>Correo</span>
        <span className="text-center">Acciones</span>
      </div>

      <div className="divide-y divide-gray-200">
        {empleados.length > 0 ? (
          empleados.map((empleado, index) => (
            <div
              key={empleado.id}
              className={`grid grid-cols-6 items-center px-3 py-2 ${
                index % 2 === 0 ? "bg-gray-50" : "bg-white"
              } hover:bg-gray-100 transition`}
            >
              <span>{empleado.nombres}</span>
              <span>{empleado.apellidos}</span>
              <span >{rolNameById[empleado.rolId] || "Sin rol"}</span>
              <span>{empleado.cedula || "—"}</span>
              <span>{empleado.correo || "Sin correo"}</span>

              {/* 🔘 Botones de acción */}
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => onVerDetalles(empleado)}
                  className="text-white text-sm px-3 py-1 rounded-md transition hover:scale-105"
                  style={{ backgroundColor: "#1A2E81" }}
                >
                  Detalles
                </button>

                <button
                  onClick={() => onEdit(empleado)}
                  className="bg-white border border-gray-300 text-gray-800 text-sm px-3 py-1 rounded-md hover:bg-gray-100 hover:scale-105 transition"
                >
                  Editar
                </button>

                <button
                  onClick={() => onDelete(empleado)}
                  className="bg-red-600 text-white text-sm px-3 py-1 rounded-md hover:bg-red-700 hover:scale-105 transition"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-4">No hay empleados registrados.</div>
        )}
      </div>
    </div>
  );
};

export default EmpleadosCard;
