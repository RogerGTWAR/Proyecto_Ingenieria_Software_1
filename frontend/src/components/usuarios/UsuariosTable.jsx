import React from "react";

export default function UsuariosTable({
  usuarios,
  onEdit,
  onDelete,
  onVerDetalles,
}) {
  if (!usuarios.length) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-400 bg-slate-200 px-6 py-10 text-center shadow-sm">
        <p className="text-sm font-bold text-slate-800">
          No hay usuarios registrados
        </p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-3xl border border-slate-300 bg-slate-200 shadow-xl">
      <div className="hidden overflow-x-auto xl:block">
        <table className="w-full text-sm">
          <thead className="bg-slate-900 text-slate-100">
            <tr>
              <th className="px-4 py-4 text-left font-bold">ID Usuario</th>
              <th className="px-4 py-4 text-left font-bold">Empleado</th>
              <th className="px-4 py-4 text-left font-bold">Usuario</th>
              <th className="px-4 py-4 text-left font-bold">Rol</th>
              <th className="px-4 py-4 text-center font-bold">Estado</th>
              <th className="px-4 py-4 text-center font-bold">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-300">
            {usuarios.map((u, idx) => (
              <tr
                key={u.usuario_id}
                className={`
                  transition
                  ${idx % 2 === 0 ? "bg-slate-100" : "bg-slate-200"}
                  hover:bg-blue-100
                `}
              >
                <td className="px-4 py-4 font-bold text-slate-900">
                  {u.usuario_id}
                </td>

                <td className="px-4 py-4 text-slate-700">
                  {`${u.nombres || ""} ${u.apellidos || ""}`.trim() || "—"}
                </td>

                <td className="px-4 py-4 font-bold text-slate-900">
                  {u.usuario || "—"}
                </td>

                <td className="px-4 py-4 font-bold text-blue-700">
                  {u.cargo || "—"}
                </td>

                <td className="px-4 py-4 text-center">
                  <span className="rounded-full border border-emerald-200 bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-800">
                    Activo
                  </span>
                </td>

                <td className="px-4 py-4">
                  <div className="flex justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => onVerDetalles(u)}
                      className="rounded-xl bg-blue-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-800"
                    >
                      Detalles
                    </button>

                    <button
                      type="button"
                      onClick={() => onEdit(u)}
                      className="rounded-xl border border-slate-400 bg-slate-100 px-4 py-2 text-sm font-bold text-slate-800 transition hover:bg-slate-300"
                    >
                      Editar
                    </button>

                    <button
                      type="button"
                      onClick={() => onDelete(u)}
                      className="rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-700"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 gap-3 bg-slate-200 p-3 xl:hidden">
        {usuarios.map((u) => (
          <div
            key={u.usuario_id}
            className="rounded-2xl border border-slate-300 bg-slate-100 p-4 shadow-sm"
          >
            <div className="mb-4 border-b border-slate-300 pb-3">
              <h3 className="text-sm font-bold text-slate-900">
                {u.usuario || "—"}
              </h3>

              <p className="text-sm text-slate-600">
                {`${u.nombres || ""} ${u.apellidos || ""}`.trim() ||
                  "Sin empleado"}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <MiniBox label="ID Usuario" value={u.usuario_id} />

              <MiniBox label="Rol" value={u.cargo || "—"} blue />

              <MiniBox label="Estado" value="Activo" green />
            </div>

            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
              <button
                type="button"
                onClick={() => onVerDetalles(u)}
                className="rounded-xl bg-blue-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-800"
              >
                Detalles
              </button>

              <button
                type="button"
                onClick={() => onEdit(u)}
                className="rounded-xl border border-slate-400 bg-slate-200 px-4 py-2 text-sm font-bold text-slate-800 transition hover:bg-slate-300"
              >
                Editar
              </button>

              <button
                type="button"
                onClick={() => onDelete(u)}
                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const MiniBox = ({ label, value, green = false, blue = false }) => {
  let className = "border-slate-300 bg-slate-200 text-slate-800";

  if (green) className = "border-emerald-200 bg-emerald-100 text-emerald-800";
  if (blue) className = "border-blue-200 bg-blue-100 text-blue-800";

  return (
    <div className={`rounded-xl border p-3 ${className}`}>
      <p className="text-sm font-semibold opacity-80">{label}</p>
      <p className="mt-1 text-sm font-bold">{value}</p>
    </div>
  );
};