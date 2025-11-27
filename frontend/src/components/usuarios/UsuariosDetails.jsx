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

  const nombreCompleto =
    empleadoInfo
      ? `${empleadoInfo.nombres} ${empleadoInfo.apellidos}`
      : `${usuario.nombres ?? ""} ${usuario.apellidos ?? ""}`.trim() || "—";

  const nombreRol = usuario.cargo || rolInfo?.cargo || "—";

  return (
    <div className="fixed inset-0 flex justify-center items-start mt-[120px] z-50">
      <div className="bg-[#F9FAFB] rounded-2xl shadow-2xl w-full max-w-2xl p-6 relative overflow-y-auto max-h-[90vh]">

        <h2 className="text-2xl font-semibold text-[var(--color-primary)] mb-4 text-center">
          Usuario: {usuario.usuario}
        </h2>

        <div className="space-y-2 text-gray-700">
          <p><strong>Usuario:</strong> {usuario.usuario}</p>
          <p><strong>Empleado:</strong> {nombreCompleto}</p>
          <p><strong>Rol:</strong> {nombreRol}</p>
          <p><strong>Estado:</strong> Activo</p>
        </div>

        <div className="flex justify-center gap-6 mt-10">
          <button
            onClick={() => onEdit(usuario)}
            className="text-white text-base font-medium px-7 py-3 rounded-md transition hover:scale-105"
            style={{ backgroundColor: "#1A2E81", minWidth: "130px" }}
          >
            Editar
          </button>

          <button
            onClick={() => onDelete(usuario)}
            className="bg-red-600 text-white text-base font-medium px-7 py-3 rounded-md hover:bg-red-700 transition-all"
            style={{ minWidth: "130px" }}
          >
            Eliminar
          </button>

          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-800 text-base font-medium px-7 py-3 rounded-md hover:bg-gray-400 transition-all"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};

export default UsuariosDetails;
