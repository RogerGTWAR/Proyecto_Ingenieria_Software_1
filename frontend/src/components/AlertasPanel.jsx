import React from "react";

const getIconByTipo = (tipo) => {
  const value = tipo?.toLowerCase() ?? "";

  if (value.includes("error")) return "!";
  if (value.includes("stock")) return "!";
  if (value.includes("eliminado")) return "×";
  if (value.includes("actualizado")) return "✓";
  if (value.includes("creado")) return "+";

  return "•";
};

const formatFecha = (fecha) => {
  if (!fecha) return "Sin fecha";

  return new Date(fecha).toLocaleString("es-NI", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function AlertasPanel({
  open,
  onClose,
  alertas = [],
  loading = false,
  error = "",
  onMarcarLeida,
  onMarcarTodas,
  onEliminar,
}) {
  if (!open) return null;

  return (
    <div
      className="
        absolute
        right-0
        top-12
        z-[100]
        w-[360px]
        max-w-[calc(100vw-24px)]
        overflow-hidden
        rounded-xl
        border
        border-slate-300
        bg-white
        shadow-2xl
      "
    >
      <div
        className="
          flex
          items-center
          justify-between
          border-b
          border-slate-200
          bg-slate-50
          px-3
          py-2
        "
      >
        <h3 className="text-sm font-bold text-slate-900">
          Notificaciones
        </h3>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onMarcarTodas}
            title="Marcar todas como leídas"
            className="
              flex
              h-7
              w-7
              items-center
              justify-center
              rounded-md
              text-sm
              font-bold
              text-blue-700
              transition
              hover:bg-blue-100
            "
          >
            ✓
          </button>

          <button
            type="button"
            onClick={onClose}
            title="Cerrar"
            className="
              flex
              h-7
              w-7
              items-center
              justify-center
              rounded-md
              text-sm
              font-bold
              text-slate-600
              transition
              hover:bg-slate-200
            "
          >
            ×
          </button>
        </div>
      </div>

      <div className="max-h-[360px] overflow-y-auto bg-white">
        {loading && (
          <div className="px-4 py-4 text-sm font-semibold text-slate-500">
            Cargando notificaciones...
          </div>
        )}

        {!loading && error && (
          <div className="px-4 py-4 text-sm font-semibold text-red-600">
            {error}
          </div>
        )}

        {!loading && !error && alertas.length === 0 && (
          <div className="px-4 py-8 text-center">
            <p className="text-sm font-bold text-slate-700">
              No hay notificaciones
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Las alertas importantes aparecerán aquí.
            </p>
          </div>
        )}

        {!loading &&
          !error &&
          alertas.map((alerta) => (
            <div
              key={alerta.id}
              className={`
                group
                border-b
                border-slate-100
                px-3
                py-3
                transition
                hover:bg-slate-50
                ${!alerta.leida ? "bg-blue-50/60" : "bg-white"}
              `}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`
                    mt-0.5
                    flex
                    h-7
                    w-7
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    text-xs
                    font-black
                    text-white
                    ${
                      alerta.prioridad === "Alta"
                        ? "bg-red-600"
                        : alerta.prioridad === "Media"
                        ? "bg-blue-600"
                        : "bg-emerald-600"
                    }
                  `}
                >
                  {getIconByTipo(alerta.tipo)}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="line-clamp-1 text-sm font-bold text-slate-900">
                      {alerta.titulo}
                    </p>

                    {!alerta.leida && (
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-600" />
                    )}
                  </div>

                  <p className="mt-1 line-clamp-2 text-xs font-medium leading-relaxed text-slate-700">
                    {alerta.mensaje}
                  </p>

                  <div className="mt-2 flex items-center justify-between gap-2">
                    <span className="text-[11px] font-semibold text-slate-500">
                      {formatFecha(alerta.fechaCreacion)}
                    </span>

                    <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:transition sm:group-hover:opacity-100">
                      {!alerta.leida && (
                        <button
                          type="button"
                          onClick={() => onMarcarLeida(alerta.id)}
                          className="
                            rounded-md
                            px-2
                            py-1
                            text-[11px]
                            font-bold
                            text-blue-700
                            transition
                            hover:bg-blue-100
                          "
                        >
                          Leer
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => onEliminar(alerta.id)}
                        className="
                          rounded-md
                          px-2
                          py-1
                          text-[11px]
                          font-bold
                          text-red-700
                          transition
                          hover:bg-red-100
                        "
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>

      <div
        className="
          border-t
          border-slate-200
          bg-slate-50
          px-3
          py-2
          text-center
        "
      >
        <span className="text-xs font-bold text-slate-600">
          Total: {alertas.length}
        </span>
      </div>
    </div>
  );
}