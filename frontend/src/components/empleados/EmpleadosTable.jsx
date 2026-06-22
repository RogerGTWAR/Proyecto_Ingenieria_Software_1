import React from "react";

export default function EmpleadosTable({
  empleados = [],
  rolNameById = {},
  onEdit,
  onDelete,
  onVerDetalles,
}) {
  if (!Array.isArray(empleados) || empleados.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-400 bg-slate-200 px-6 py-10 text-center shadow-sm">
        <p className="text-sm font-bold text-slate-800">
          No hay empleados registrados
        </p>

        <p className="mt-1 text-sm text-slate-600">
          No se encontraron empleados para mostrar.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-3xl border border-slate-300 bg-slate-200 shadow-xl">
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[950px] border-collapse text-sm">
          <thead className="bg-slate-900 text-slate-100">
            <tr>
              <th className="px-4 py-4 text-left font-bold">Nombres</th>
              <th className="px-4 py-4 text-left font-bold">Apellidos</th>
              <th className="px-4 py-4 text-left font-bold">Rol</th>
              <th className="px-4 py-4 text-left font-bold">Cédula</th>
              <th className="px-4 py-4 text-left font-bold">Teléfono</th>
              <th className="px-4 py-4 text-left font-bold">Correo</th>
              <th className="px-4 py-4 text-left font-bold">País</th>
              <th className="px-4 py-4 text-center font-bold">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-300">
            {empleados.map((empleado, index) => {
              const rolNombre =
                rolNameById?.[Number(empleado.rolId)] ||
                empleado.rolNombre ||
                "Sin rol";

              return (
                <tr
                  key={empleado.id ?? `${empleado.cedula}-${index}`}
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
                      {rolNombre}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-slate-700">
                    {empleado.cedula || "—"}
                  </td>

                  <td className="px-4 py-4 text-slate-700">
                    {empleado.telefono || "No registrado"}
                  </td>

                  <td className="px-4 py-4 text-slate-700">
                    {empleado.correo || "Sin correo"}
                  </td>

                  <td className="px-4 py-4 text-slate-700">
                    {empleado.pais || "No registrado"}
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
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}