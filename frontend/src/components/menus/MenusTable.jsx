import React from "react";

export default function MenusTable({ menus, onEdit, onDelete }) {
  const getParentName = (menu) => {
    if (!menu.parentId) return "—";

    const parent = menus.find((x) => Number(x.id) === Number(menu.parentId));

    return parent?.nombre || "—";
  };

  if (!menus.length) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-400 bg-slate-200 px-6 py-10 text-center shadow-sm">
        <p className="text-sm font-bold text-slate-800">
          No hay menús registrados
        </p>

        <p className="mt-1 text-sm text-slate-600">
          Registre un nuevo menú para comenzar.
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
              <th className="px-4 py-4 text-left font-bold">Nombre</th>
              <th className="px-4 py-4 text-center font-bold">Tipo</th>
              <th className="px-4 py-4 text-left font-bold">URL</th>
              <th className="px-4 py-4 text-left font-bold">Padre</th>
              <th className="px-4 py-4 text-center font-bold">Estado</th>
              <th className="px-4 py-4 text-center font-bold">Visible</th>
              <th className="px-4 py-4 text-center font-bold">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-300">
            {menus.map((m, idx) => (
              <tr
                key={m.id}
                className={`
                  transition
                  ${idx % 2 === 0 ? "bg-slate-100" : "bg-slate-200"}
                  hover:bg-blue-100
                `}
              >
                <td className="px-4 py-4 font-bold text-slate-900">
                  {m.nombre || "—"}
                </td>

                <td className="px-4 py-4 text-center">
                  <span
                    className={`
                      rounded-full border px-3 py-1 text-sm font-bold
                      ${
                        m.esSubmenu
                          ? "border-cyan-200 bg-cyan-100 text-cyan-800"
                          : "border-indigo-200 bg-indigo-100 text-indigo-800"
                      }
                    `}
                  >
                    {m.esSubmenu ? "Submenú" : "Menú"}
                  </span>
                </td>

                <td className="px-4 py-4 text-slate-700">
                  {m.url || "—"}
                </td>

                <td className="px-4 py-4 text-slate-700">
                  {getParentName(m)}
                </td>

                <td className="px-4 py-4 text-center">
                  <span
                    className={`
                      rounded-full border px-3 py-1 text-sm font-bold
                      ${
                        m.estado
                          ? "border-emerald-200 bg-emerald-100 text-emerald-800"
                          : "border-red-200 bg-red-100 text-red-800"
                      }
                    `}
                  >
                    {m.estado ? "Activo" : "Inactivo"}
                  </span>
                </td>

                <td className="px-4 py-4 text-center">
                  <span
                    className={`
                      rounded-full border px-3 py-1 text-sm font-bold
                      ${
                        m.show
                          ? "border-blue-200 bg-blue-100 text-blue-800"
                          : "border-slate-300 bg-slate-100 text-slate-700"
                      }
                    `}
                  >
                    {m.show ? "Visible" : "Oculto"}
                  </span>
                </td>

                <td className="px-4 py-4">
                  <div className="flex justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(m)}
                      className="rounded-xl border border-slate-400 bg-slate-100 px-4 py-2 text-sm font-bold text-slate-800 transition hover:bg-slate-300"
                    >
                      Editar
                    </button>

                    <button
                      type="button"
                      onClick={() => onDelete(m)}
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
        {menus.map((m) => (
          <div
            key={m.id}
            className="rounded-2xl border border-slate-300 bg-slate-100 p-4 shadow-sm"
          >
            <div className="mb-4 border-b border-slate-300 pb-3">
              <h3 className="text-sm font-bold text-slate-900">
                {m.nombre || "—"}
              </h3>

              <p className="mt-1 text-sm text-slate-600">
                {m.url || "Sin ruta definida"}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <MiniBox
                label="Tipo"
                value={m.esSubmenu ? "Submenú" : "Menú"}
                blue={m.esSubmenu}
              />

              <MiniBox label="Padre" value={getParentName(m)} />

              <MiniBox
                label="Estado"
                value={m.estado ? "Activo" : "Inactivo"}
                green={m.estado}
                red={!m.estado}
              />

              <MiniBox
                label="Visible"
                value={m.show ? "Visible" : "Oculto"}
                blue={m.show}
              />
            </div>

            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => onEdit(m)}
                className="rounded-xl border border-slate-400 bg-slate-200 px-4 py-2 text-sm font-bold text-slate-800 transition hover:bg-slate-300"
              >
                Editar
              </button>

              <button
                type="button"
                onClick={() => onDelete(m)}
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

const MiniBox = ({
  label,
  value,
  green = false,
  red = false,
  blue = false,
}) => {
  let className = "border-slate-300 bg-slate-200 text-slate-800";

  if (green) {
    className = "border-emerald-200 bg-emerald-100 text-emerald-800";
  }

  if (red) {
    className = "border-red-200 bg-red-100 text-red-800";
  }

  if (blue) {
    className = "border-blue-200 bg-blue-100 text-blue-800";
  }

  return (
    <div className={`rounded-xl border p-3 ${className}`}>
      <p className="text-sm font-semibold opacity-80">{label}</p>
      <p className="mt-1 truncate text-sm font-bold">{value}</p>
    </div>
  );
};