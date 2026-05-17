import React from "react";

export default function EmpleadosTable({
  empleados,
  rolNameById,
  onEdit,
  onDelete,
  onVerDetalles,
  obtenerColorRol,
}) {
  if (!empleados.length) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-400 bg-slate-200 px-6 py-10 text-center shadow-sm">
        <p className="text-sm font-bold text-slate-800">
          No hay empleados registrados
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
              <th className="px-4 py-4 text-left font-bold">Nombres</th>
              <th className="px-4 py-4 text-left font-bold">Apellidos</th>
              <th className="px-4 py-4 text-left font-bold">Rol</th>
              <th className="px-4 py-4 text-left font-bold">Cédula</th>
              <th className="px-4 py-4 text-left font-bold">Correo</th>
              <th className="px-4 py-4 text-center font-bold">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-300">
            {empleados.map((empleado, index) => (
              <tr
                key={empleado.id}
                className={`
                  transition
                  ${index % 2 === 0 ? "bg-slate-100" : "bg-slate-200"}
                  hover:bg-blue-100
                `}
              >
                <td className="px-4 py-4 font-bold text-slate-900">
                  {empleado.nombres || "—"}
                </td>

                <td className="px-4 py-4 text-slate-700">
                  {empleado.apellidos || "—"}
                </td>

                <td className="px-4 py-4">
                  <span className="rounded-full border border-blue-200 bg-blue-100 px-3 py-1 text-sm font-bold text-blue-800">
                    {rolNameById?.[empleado.rolId] || "Sin rol"}
                  </span>
                </td>

                <td className="px-4 py-4 text-slate-700">
                  {empleado.cedula || "—"}
                </td>

                <td className="px-4 py-4 text-slate-700">
                  {empleado.correo || "Sin correo"}
                </td>

                <td className="px-4 py-4">
                  <div className="flex justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => onVerDetalles(empleado)}
                      className="rounded-xl bg-blue-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-800"
                    >
                      Detalles
                    </button>

                    <button
                      type="button"
                      onClick={() => onEdit(empleado)}
                      className="rounded-xl border border-slate-400 bg-slate-100 px-4 py-2 text-sm font-bold text-slate-800 transition hover:bg-slate-300"
                    >
                      Editar
                    </button>

                    <button
                      type="button"
                      onClick={() => onDelete(empleado)}
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
        {empleados.map((empleado) => (
          <div
            key={empleado.id}
            className="rounded-2xl border border-slate-300 bg-slate-100 p-4 shadow-sm"
          >
            <div className="mb-4 border-b border-slate-300 pb-3">
              <h3 className="text-sm font-bold text-slate-900">
                {empleado.nombres} {empleado.apellidos}
              </h3>

              <p className="text-sm text-slate-600">
                {rolNameById?.[empleado.rolId] || "Sin rol"}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <MiniBox label="Cédula" value={empleado.cedula || "—"} />
              <MiniBox label="Correo" value={empleado.correo || "Sin correo"} />
              <MiniBox
                label="Teléfono"
                value={empleado.telefono || "No registrado"}
              />
              <MiniBox
                label="Estado"
                value={empleado.estado || "Activo"}
                green
              />
            </div>

            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
              <button
                type="button"
                onClick={() => onVerDetalles(empleado)}
                className="rounded-xl bg-blue-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-800"
              >
                Detalles
              </button>

              <button
                type="button"
                onClick={() => onEdit(empleado)}
                className="rounded-xl border border-slate-400 bg-slate-200 px-4 py-2 text-sm font-bold text-slate-800 transition hover:bg-slate-300"
              >
                Editar
              </button>

              <button
                type="button"
                onClick={() => onDelete(empleado)}
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

const MiniBox = ({ label, value, green = false }) => (
  <div
    className={`
      rounded-xl border p-3
      ${
        green
          ? "border-emerald-200 bg-emerald-100 text-emerald-800"
          : "border-slate-300 bg-slate-200 text-slate-800"
      }
    `}
  >
    <p className="text-sm font-semibold opacity-80">{label}</p>
    <p className="mt-1 truncate text-sm font-bold">{value}</p>
  </div>
);