import React from "react";

const UsuariosCard = ({ usuarios, onEdit, onDelete, onVerDetalles }) => {
  if (!usuarios.length) {
    return (
      <p className="text-gray-500 text-center mt-4 text-base">
        No hay usuarios registrados.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-3 justify-start">
      {usuarios.map((u) => (
        <div
          key={u.usuario_id}
          className="bg-[#F9FAFB] border border-gray-200 rounded-xl shadow-sm 
                     p-4 w-[280px] hover:shadow-md hover:scale-[1.01] 
                     transition-all duration-200"
        >
          <h3 className="font-semibold text-[var(--color-primary)] text-[17px] mb-1">
            {u.usuario}
          </h3>

          <p className="text-[15px] text-gray-700 mb-1">
            Empleado:{" "}
            <span className="font-medium">
              {u.nombres} {u.apellidos}
            </span>
          </p>

          <p className="text-[15px] text-gray-600 mb-1">
            Rol: {u.cargo}
          </p>

          <p className="text-[14px] text-gray-500 mb-2">
            Estado: Activo
          </p>

          <div className="flex justify-center gap-2 mt-3">
            <button
              onClick={() => onVerDetalles(u)}
              className="text-white text-sm px-3 py-1 rounded-md transition hover:scale-105"
              style={{ backgroundColor: "#1A2E81" }}
            >
              Detalles
            </button>

            <button
              onClick={() => onEdit(u)}
              className="bg-white border border-gray-300 text-gray-800 text-sm px-3 py-1 rounded-md 
                         hover:bg-gray-100 hover:scale-105 transition"
            >
              Editar
            </button>

            <button
              onClick={() => onDelete(u)}
              className="bg-red-600 text-white text-sm px-3 py-1 rounded-md 
                         hover:bg-red-700 hover:scale-105 transition"
            >
              Eliminar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UsuariosCard;
