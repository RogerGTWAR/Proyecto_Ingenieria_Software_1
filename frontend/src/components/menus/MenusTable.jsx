import React from "react";

export default function MenusTable({ menus, onEdit, onDelete }) {
  return (
    <div className="w-full bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
      
      <div className="grid grid-cols-6 font-semibold text-[#1A2E81] bg-gray-100 p-3 border-b">
        <span>Nombre</span>
        <span>Tipo</span>
        <span>URL</span>
        <span>Padre</span>
        <span>Estado</span>
        <span className="text-center">Acciones</span>
      </div>

      <div className="divide-y divide-gray-200">
        {menus.length > 0 ? (
          menus.map((m, idx) => (
            <div
              key={m.id}
              className={`grid grid-cols-6 px-3 py-2 items-center ${
                idx % 2 === 0 ? "bg-gray-50" : "bg-white"
              } hover:bg-gray-100`}
            >
              <span>{m.nombre}</span>
              <span>{m.esSubmenu ? "Submenú" : "Menú"}</span>
              <span>{m.url || "—"}</span>
              <span>{m.parentId ? menus.find(x => x.id === m.parentId)?.nombre : "—"}</span>
              <span>{m.estado ? "Activo" : "Inactivo"}</span>

              <div className="flex justify-center gap-2">
                <button
                  onClick={() => onEdit(m)}
                  className="bg-white border border-gray-300 text-gray-800 text-sm px-3 py-1 rounded-md hover:bg-gray-200"
                >
                  Editar
                </button>

                <button
                  onClick={() => onDelete(m)}
                  className="bg-red-600 text-white text-sm px-3 py-1 rounded-md hover:bg-red-700"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-4">No hay menús registrados.</p>
        )}
      </div>
    </div>
  );
}
