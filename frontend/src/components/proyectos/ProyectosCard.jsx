import React from "react";

const ProyectosCard = ({ proyectos, onEdit, onDelete, onVerDetalles }) => {
  const money = (value) => Number(value ?? 0).toLocaleString("es-NI");

  const estadoClass = {
    Activo: "border-emerald-200 bg-emerald-100 text-emerald-800",
    Completado: "border-blue-200 bg-blue-100 text-blue-800",
    Cancelado: "border-red-200 bg-red-100 text-red-800",
    "En Espera": "border-amber-200 bg-amber-100 text-amber-800",
  };

  if (!proyectos.length) {
    return (
      <div className="flex min-h-[260px] w-full items-center justify-center rounded-3xl border border-dashed border-slate-400 bg-slate-200 px-6 py-10 text-center shadow-sm">
        <div>
          <p className="text-sm font-bold text-slate-800">
            No hay proyectos registrados
          </p>

          <p className="mt-1 text-sm text-slate-600">
            Registre un nuevo proyecto para comenzar.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
      {proyectos.map((p) => (
        <div
          key={p.id}
          className="
            flex
            min-h-[380px]
            w-full
            flex-col
            overflow-hidden
            rounded-3xl
            border
            border-slate-300
            bg-slate-200
            shadow-md
            transition
            hover:-translate-y-1
            hover:border-blue-400
            hover:shadow-xl
          "
        >
          <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-cyan-900 px-5 py-4 text-white">
            <p className="text-sm font-medium text-cyan-100">
              Proyecto registrado
            </p>

            <h3 className="mt-1 truncate text-sm font-bold">
              {p.nombreProyecto || "Sin nombre"}
            </h3>
          </div>

          <div className="flex flex-1 flex-col justify-between p-5">
            <div className="space-y-4">
              <InfoBox
                label="Cliente"
                value={p.clienteNombre || "Sin asignar"}
              />

              <InfoBox
                label="Ubicación"
                value={p.ubicacion || "No especificada"}
              />

              <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
                <InfoBox
                  label="Presupuesto"
                  value={
                    p.presupuestoTotal
                      ? `C$${money(p.presupuestoTotal)}`
                      : "—"
                  }
                  variant="green"
                />

                <div
                  className={`
                    rounded-2xl border p-4
                    ${
                      estadoClass[p.estado] ||
                      "border-slate-300 bg-slate-100 text-slate-800"
                    }
                  `}
                >
                  <p className="text-sm font-semibold opacity-80">Estado</p>
                  <p className="mt-1 text-sm font-bold">{p.estado || "—"}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
                <InfoBox
                  label="Inicio"
                  value={p.fechaInicio?.split("T")[0] || "—"}
                />

                <InfoBox
                  label="Fin"
                  value={p.fechaFin?.split("T")[0] || "—"}
                />
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-3">
              <button
                type="button"
                onClick={() => onVerDetalles(p)}
                className="rounded-xl bg-blue-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-800"
              >
                Detalles
              </button>

              <button
                type="button"
                onClick={() => onEdit(p)}
                className="rounded-xl border border-slate-400 bg-slate-100 px-4 py-2 text-sm font-bold text-slate-800 transition hover:bg-slate-300"
              >
                Editar
              </button>

              <button
                type="button"
                onClick={() => onDelete(p)}
                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const InfoBox = ({ label, value, variant = "default" }) => {
  const styles = {
    default: "border-slate-300 bg-slate-100 text-slate-800",
    green: "border-emerald-200 bg-emerald-100 text-emerald-800",
  };

  return (
    <div className={`rounded-2xl border p-4 ${styles[variant]}`}>
      <p className="text-sm font-semibold opacity-80">{label}</p>
      <p className="mt-1 truncate text-sm font-bold">{value}</p>
    </div>
  );
};

export default ProyectosCard;