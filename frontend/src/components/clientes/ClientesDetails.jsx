import React from "react";

const ClientesDetails = ({ cliente, onClose, onEdit, onDelete }) => {
  if (!cliente) return null;

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
          w-full
          max-w-5xl
          overflow-hidden
          rounded-3xl
          border
          border-slate-300
          bg-slate-100
          shadow-2xl
        "
      >
        <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-cyan-900 px-5 py-5 text-white sm:px-7">
          <p className="text-sm font-medium text-cyan-100">
            Gestión de clientes
          </p>

          <h2 className="mt-1 text-sm font-bold tracking-tight text-white">
            Detalles del Cliente
          </h2>
        </div>

        <div className="max-h-[calc(100dvh-170px)] space-y-5 overflow-y-auto p-4 sm:p-6">
          <section className="rounded-3xl border border-slate-300 bg-slate-200 p-4 shadow-sm sm:p-6">
            <div className="mb-5 border-b border-slate-300 pb-4">
              <h3 className="text-sm font-bold text-slate-900">
                Información general
              </h3>

              <p className="mt-1 text-sm text-slate-600">
                Datos principales del cliente seleccionado.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <InfoBox label="ID" value={cliente.id || "—"} />

              <InfoBox
                label="Tipo de Cliente"
                value={cliente.tipoCliente || "—"}
                variant="blue"
              />

              <InfoBox
                label="Número de Identificación"
                value={cliente.numeroIdentificacion || "—"}
              />

              <InfoBox label="Cliente" value={cliente.nombreEmpresa || "—"} />

              <InfoBox label="Dirección" value={cliente.direccion || "—"} />

              <InfoBox label="Ciudad" value={cliente.ciudad || "—"} />

              <InfoBox label="País" value={cliente.pais || "—"} />

              <InfoBox
                label="Teléfono"
                value={cliente.telefono || "—"}
                variant="blue"
              />

              <InfoBox
                label="Correo"
                value={cliente.correo || "—"}
                variant="blue"
              />
            </div>
          </section>

          <section className="rounded-3xl border border-slate-300 bg-slate-200 p-4 shadow-sm sm:p-6">
            <div className="mb-5 border-b border-slate-300 pb-4">
              <h3 className="text-sm font-bold text-slate-900">
                Información de contacto
              </h3>

              <p className="mt-1 text-sm text-slate-600">
                Persona de contacto relacionada con el cliente.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <InfoBox
                label="Nombre"
                value={cliente.nombreContacto || "—"}
              />

              <InfoBox
                label="Cargo"
                value={cliente.cargoContacto || "—"}
              />
            </div>
          </section>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="
                w-full
                rounded-2xl
                border
                border-slate-400
                bg-slate-100
                px-6
                py-3
                text-sm
                font-bold
                text-slate-800
                shadow-sm
                transition
                hover:bg-slate-300
                sm:w-auto
              "
            >
              Cerrar
            </button>

            <button
              type="button"
              onClick={() => onDelete?.(cliente)}
              className="
                w-full
                rounded-2xl
                bg-red-600
                px-6
                py-3
                text-sm
                font-bold
                text-white
                shadow-md
                transition
                hover:bg-red-700
                sm:w-auto
              "
            >
              Eliminar
            </button>

            <button
              type="button"
              onClick={() => onEdit?.(cliente)}
              className="
                w-full
                rounded-2xl
                bg-gradient-to-r
                from-blue-800
                to-cyan-700
                px-6
                py-3
                text-sm
                font-bold
                text-white
                shadow-lg
                transition
                hover:scale-[1.01]
                hover:shadow-xl
                sm:w-auto
              "
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
  };

  return (
    <div className={`rounded-2xl border p-4 ${styles[variant]}`}>
      <p className="text-sm font-semibold opacity-80">{label}</p>
      <p className="mt-1 break-words text-sm font-bold">{value}</p>
    </div>
  );
};

export default ClientesDetails;