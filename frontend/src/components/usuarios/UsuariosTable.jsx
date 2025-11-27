import React from "react";

export default function UsuariosTable({ usuarios, onEdit, onDelete, onVerDetalles }) {
  return (
    <div className="w-full bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">

      <div className="grid grid-cols-6 font-semibold text-[#1A2E81] bg-gray-100 p-3 border-b">
        <span>ID Usuario</span>
        <span>Empleado</span>
        <span>Usuario</span>
        <span>Rol</span>
        <span>Estado</span>
        <span className="text-center">Acciones</span>
      </div>

      <div className="divide-y divide-gray-200">
        {usuarios.length > 0 ? (
          usuarios.map((u, idx) => (
            <div
              key={u.usuario_id}
              className={`grid grid-cols-6 items-center px-3 py-2 ${
                idx % 2 === 0 ? "bg-gray-50" : "bg-white"
              } hover:bg-gray-100 transition`}
            >
              <span>{u.usuario_id}</span>

              <span>{u.nombres} {u.apellidos}</span>

              <span className="font-medium">{u.usuario}</span>

              <span className="font-medium text-blue-700">
                {u.cargo}
              </span>

              <span className="text-green-600 font-medium">Activo</span>

              <div className="flex justify-center gap-2">
                <button
                  onClick={() => onVerDetalles(u)}
                  className="text-white text-sm px-3 py-1 rounded-md"
                  style={{ backgroundColor: "#1A2E81" }}
                >
                  Detalles
                </button>

                <button
                  onClick={() => onEdit(u)}
                  className="bg-white border border-gray-300 text-gray-800 text-sm px-3 py-1 rounded-md hover:bg-gray-100"
                >
                  Editar
                </button>

                <button
                  onClick={() => onDelete(u)}
                  className="bg-red-600 text-white text-sm px-3 py-1 rounded-md hover:bg-red-700"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-4">No hay usuarios registrados.</p>
        )}
      </div>
    </div>
  );
}
