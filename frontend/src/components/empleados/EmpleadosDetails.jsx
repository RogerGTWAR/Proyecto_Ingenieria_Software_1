import React from "react";

const EmpleadosDetails = ({
  empleado,
  onClose,
  onEdit,
  onDelete,
  rolNameById,
}) => {
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
    <div
      className="
        fixed
        left-0
        right-0
        bottom-0
        top-16
        z-40
        flex
        items-center
        justify-center
        overflow-y-auto
        bg-slate-900/35
        px-4
        py-6
        lg:left-48
      "
    >
      <div
        className="
          flex
          w-full
          max-w-5xl
          max-h-[calc(100dvh-96px)]
          flex-col
          overflow-hidden
          rounded-3xl
          border
          border-slate-300
          bg-slate-100
          shadow-2xl
        "
      >
        <div className="shrink-0 bg-gradient-to-r from-slate-950 via-blue-950 to-cyan-900 px-5 py-5 text-white sm:px-7">
          <p className="text-sm font-medium text-cyan-100">
            Gestión de empleados
          </p>

          <h2 className="mt-1 text-sm font-bold tracking-tight text-white">
            Detalles del Empleado
          </h2>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto bg-slate-100 p-4 sm:p-6">
          <section className="rounded-3xl border border-slate-300 bg-slate-200 p-4 shadow-sm sm:p-6">
            <div className="mb-5 border-b border-slate-300 pb-4">
              <h3 className="text-sm font-bold text-slate-900">
                Datos personales
              </h3>

              <p className="mt-1 text-sm text-slate-600">
                Información principal del empleado seleccionado.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <InfoBox label="Nombres" value={empleado.nombres || "—"} />

              <InfoBox label="Apellidos" value={empleado.apellidos || "—"} />

              <InfoBox
                label="Cédula"
                value={empleado.cedula || "No registrada"}
              />

              <InfoBox
                label="Teléfono"
                value={empleado.telefono || "No registrado"}
                variant="blue"
              />

              <InfoBox
                label="País"
                value={empleado.pais || "No registrado"}
              />

              <InfoBox
                label="Fecha de Nacimiento"
                value={formatDate(empleado.fecha_nacimiento)}
              />
            </div>
          </section>

          <section className="rounded-3xl border border-slate-300 bg-slate-200 p-4 shadow-sm sm:p-6">
            <div className="mb-5 border-b border-slate-300 pb-4">
              <h3 className="text-sm font-bold text-slate-900">
                Información laboral
              </h3>

              <p className="mt-1 text-sm text-slate-600">
                Datos de rol, contratación y contacto laboral.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <InfoBox
                label="Rol"
                value={rolNameById?.[empleado.rolId] || "Sin rol asignado"}
                variant="blue"
              />

              <InfoBox
                label="Correo"
                value={empleado.correo || "No registrado"}
              />

              <InfoBox
                label="Fecha de Contratación"
                value={formatDate(empleado.fecha_contratacion)}
              />

              <InfoBox
                label="Dirección"
                value={empleado.direccion || "No registrada"}
              />
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
              onClick={() => onDelete(empleado)}
              className="w-full rounded-2xl bg-red-600 px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-red-700 sm:w-auto"
            >
              Eliminar
            </button>

            <button
              type="button"
              onClick={() => onEdit(empleado)}
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

const InfoBox = ({ label, value, variant = "default", className = "" }) => {
  const styles = {
    default: "border-slate-300 bg-slate-100 text-slate-800",
    blue: "border-blue-200 bg-blue-100 text-blue-800",
  };

  return (
    <div className={`rounded-2xl border p-4 ${styles[variant]} ${className}`}>
      <p className="text-sm font-semibold opacity-80">{label}</p>
      <p className="mt-1 text-sm font-bold">{value}</p>
    </div>
  );
};

export default EmpleadosDetails;