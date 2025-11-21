import React from "react";

const EmpleadosDetails = ({ empleado, onClose, onEdit, onDelete, rolNameById }) => {
  if (!empleado) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "No registrada";
    const dateOnly = dateString.split("T")[0];
    const [year, month, day] = dateOnly.split("-");
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="fixed top-[100px] left-1/2 -translate-x-1/2 z-50 w-full flex justify-center">
      <div className="bg-[#F9FAFB] rounded-2xl shadow-md border border-gray-200 w-full max-w-4xl p-10">
        <h1 className="text-3xl font-bold text-[var(--color-primary)] text-center mb-10">
          Detalles del Empleado
        </h1>

        {/* Datos personales y laborales */}
        <div className="grid grid-cols-2 gap-10 text-center">
          {/* Columna izquierda - Datos personales */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
              Datos Personales
            </h2>
            <div className="space-y-3 text-[16px] leading-relaxed text-gray-700">
              <p><strong>Nombres:</strong> {empleado.nombres}</p>
              <p><strong>Apellidos:</strong> {empleado.apellidos}</p>
              <p><strong>Cédula:</strong> {empleado.cedula || "No registrada"}</p>
              <p><strong>Teléfono:</strong> {empleado.telefono || "No registrado"}</p>
              <p><strong>País:</strong> {empleado.pais || "No registrado"}</p>
              <p><strong>Fecha de Nacimiento:</strong> {formatDate(empleado.fecha_nacimiento)}</p>
            </div>
          </div>

          {/* Columna derecha - Información laboral */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
              Información Laboral
            </h2>
            <div className="space-y-3 text-[16px] leading-relaxed text-gray-700">
              <p><strong>Rol:</strong> {rolNameById?.[empleado.rolId] || "Sin rol asignado"}</p>
              <p><strong>Correo:</strong> {empleado.correo || "No registrado"}</p>
              <p><strong>Dirección:</strong> {empleado.direccion || "No registrada"}</p>
              <p><strong>Fecha de Contratación:</strong> {formatDate(empleado.fecha_contratacion)}</p>
              <p><strong>Estado:</strong> {empleado.estado || "Activo"}</p>
            </div>
          </div>
        </div>

        {/* 🔘 Botones */}
        <div className="flex justify-center gap-6 mt-12">
          <button
            onClick={() => onEdit(empleado)}
            className="text-white text-base font-medium px-7 py-3 rounded-md transition hover:scale-105"
            style={{ backgroundColor: "#1A2E81", minWidth: "130px" }}
          >
            Editar
          </button>
          <button
            onClick={() => onDelete(empleado)}
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

export default EmpleadosDetails;
