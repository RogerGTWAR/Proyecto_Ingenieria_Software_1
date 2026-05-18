import React, { useEffect, useMemo } from "react";
import { useEmpleados } from "../../hooks/useEmpleados";
import useRoles from "../../hooks/useRoles";

const UsuariosDetails = ({ usuario, onClose, onEdit, onDelete }) => {
  const { items: empleados, reload: reloadEmpleados } = useEmpleados();
  const { items: roles, reload: reloadRoles } = useRoles();

  useEffect(() => {
    reloadEmpleados();
    reloadRoles();
  }, [usuario, reloadEmpleados, reloadRoles]);

  const empleadoInfo = useMemo(() => {
    if (!usuario) return null;

    return empleados.find(
      (e) => Number(e.id ?? e.empleado_id) === Number(usuario.empleado_id)
    );
  }, [empleados, usuario]);

  const rolInfo = useMemo(() => {
    if (!empleadoInfo) return null;

    return roles.find(
      (r) => Number(r.rol_id ?? r.id) === Number(empleadoInfo.rol_id)
    );
  }, [roles, empleadoInfo]);

  if (!usuario) return null;

  const nombreCompleto = empleadoInfo
    ? `${empleadoInfo.nombres} ${empleadoInfo.apellidos}`
    : `${usuario.nombres ?? ""} ${usuario.apellidos ?? ""}`.trim() || "—";

  const nombreRol = usuario.cargo || rolInfo?.cargo || rolInfo?.nombre || "—";

  return (
    <div
      className="
        fixed left-0 right-0 bottom-0 top-16 z-40
        flex items-center justify-center overflow-y-auto
        bg-slate-900/35 px-4 py-6 lg:left-48
      "
    >
      <div
        className="
          flex w-full max-w-4xl max-h-[calc(100dvh-96px)]
          flex-col overflow-hidden rounded-3xl
          border border-slate-300 bg-slate-100 shadow-2xl
        "
      >
        <div className="shrink-0 bg-gradient-to-r from-slate-950 via-blue-950 to-cyan-900 px-5 py-5 text-white sm:px-7">
          <p className="text-sm font-medium text-cyan-100">
            Gestión de usuarios
          </p>

          <h2 className="mt-1 text-sm font-bold tracking-tight text-white">
            Usuario: {usuario.usuario}
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto bg-slate-100 p-4 sm:p-6">
          <section className="rounded-3xl border border-slate-300 bg-slate-200 p-4 shadow-sm sm:p-6">
            <div className="mb-5 border-b border-slate-300 pb-4">
              <h3 className="text-sm font-bold text-slate-900">
                Resumen del usuario
              </h3>

              <p className="mt-1 text-sm text-slate-600">
                Información principal de la cuenta seleccionada.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <InfoBox label="Usuario" value={usuario.usuario || "—"} />

              <InfoBox label="Empleado" value={nombreCompleto} />

              <InfoBox label="Rol" value={nombreRol} variant="blue" />

              <InfoBox label="Estado" value="Activo" variant="green" />
            </div>
          </section>
        </div>

        <div className="shrink-0 border-t border-slate-300 bg-slate-100 px-4 py-4 sm:px-6">
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-2xl border border-slate-400 bg-slate-100 px-6 py-3 text-sm font-bold text-slate-800 shadow-sm transition hover:bg-slate-300 sm:w-auto"
            >
              Cerrar
            </button>

            <button
              type="button"
              onClick={() => onDelete(usuario)}
              className="w-full rounded-2xl bg-red-600 px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-red-700 sm:w-auto"
            >
              Eliminar
            </button>

            <button
              type="button"
              onClick={() => onEdit(usuario)}
              className="w-full rounded-2xl bg-gradient-to-r from-blue-800 to-cyan-700 px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:scale-[1.01] hover:shadow-xl sm:w-auto"
            >
              Editar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoBox = ({ label, value, variant = "default" }) => {
  const styles = {
    default: "border-slate-300 bg-slate-100 text-slate-800",
    blue: "border-blue-200 bg-blue-100 text-blue-800",
    green: "border-emerald-200 bg-emerald-100 text-emerald-800",
  };

  return (
    <div className={`rounded-2xl border p-4 ${styles[variant]}`}>
      <p className="text-sm font-semibold opacity-80">{label}</p>
      <p className="mt-1 text-sm font-bold">{value}</p>
    </div>
  );
};

export default UsuariosDetails;