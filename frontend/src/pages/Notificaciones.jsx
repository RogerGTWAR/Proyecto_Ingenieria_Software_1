import { useMemo, useState } from "react";
import { useHistorialAlertas } from "../hooks/useHistorialAlertas";

const formatFecha = (fecha) => {
  if (!fecha) return "Sin fecha";

  return new Date(fecha).toLocaleString("es-NI", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getPrioridadClass = (prioridad) => {
  if (prioridad === "Alta") {
    return "border-red-300 bg-red-100 text-red-800";
  }

  if (prioridad === "Media") {
    return "border-amber-300 bg-amber-100 text-amber-800";
  }

  return "border-emerald-300 bg-emerald-100 text-emerald-800";
};

const getDotClass = (prioridad) => {
  if (prioridad === "Alta") return "bg-red-500";
  if (prioridad === "Media") return "bg-amber-500";
  return "bg-emerald-500";
};

function Notificaciones() {
  const {
    alertas,
    loading,
    error,
    noLeidas,
    cargarAlertas,
    marcarLeida,
    marcarTodas,
    eliminar,
  } = useHistorialAlertas();

  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [filtroPrioridad, setFiltroPrioridad] = useState("");
  const [seleccionada, setSeleccionada] = useState(null);

  const alertasFiltradas = useMemo(() => {
    const q = busqueda.trim().toLowerCase();

    return alertas.filter((a) => {
      const coincideBusqueda =
        a.titulo?.toLowerCase().includes(q) ||
        a.mensaje?.toLowerCase().includes(q) ||
        a.modulo?.toLowerCase().includes(q) ||
        a.tipo?.toLowerCase().includes(q);

      const coincideEstado =
        filtroEstado === "leidas"
          ? a.leida
          : filtroEstado === "no-leidas"
          ? !a.leida
          : true;

      const coincidePrioridad = filtroPrioridad
        ? a.prioridad === filtroPrioridad
        : true;

      return coincideBusqueda && coincideEstado && coincidePrioridad;
    });
  }, [alertas, busqueda, filtroEstado, filtroPrioridad]);

  const totalAlta = alertas.filter((a) => a.prioridad === "Alta").length;
  const totalMedia = alertas.filter((a) => a.prioridad === "Media").length;

  const alertaActiva = seleccionada || alertasFiltradas[0] || null;

  const seleccionarAlerta = async (alerta) => {
    setSeleccionada(alerta);

    if (!alerta.leida) {
      await marcarLeida(alerta.id);
    }
  };

  const eliminarSeleccionada = async () => {
    if (!alertaActiva) return;

    await eliminar(alertaActiva.id);
    setSeleccionada(null);
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100dvh-64px)] w-full items-center justify-center bg-slate-200 px-4">
        <div className="rounded-3xl border border-slate-300 bg-slate-100 px-8 py-6 text-center shadow-xl">
          <p className="text-sm font-bold text-slate-800">
            Cargando notificaciones...
          </p>

          <p className="mt-1 text-sm text-slate-600">
            Espere un momento mientras se carga el historial.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100dvh-64px)] w-full overflow-y-auto bg-slate-200 px-4 py-5 sm:px-5 lg:px-6">
      <div className="mx-auto flex min-h-full w-full max-w-[1500px] flex-col gap-5 pb-8">
        <section className="overflow-hidden rounded-[28px] border border-slate-700/40 bg-slate-900 shadow-xl">
          <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-cyan-900 px-6 py-6 text-white sm:px-8">
            <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <p className="text-sm font-medium text-cyan-100">
                  Centro de notificaciones
                </p>

                <h1 className="mt-1 text-xl font-black tracking-tight text-white">
                  Historial de Alertas
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-300">
                  Consulta las alertas, eventos importantes y acciones
                  registradas dentro del sistema.
                </p>
              </div>

              <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-4 xl:w-[680px]">
                <HeaderBox label="Total" value={alertas.length} />
                <HeaderBox label="No leídas" value={noLeidas} />
                <HeaderBox label="Alta" value={totalAlta} />
                <HeaderBox label="Media" value={totalMedia} />
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[28px] border border-slate-300 bg-slate-100 p-5 shadow-md">
          <div className="grid gap-4 xl:grid-cols-[1fr_auto] xl:items-end">
            <div className="grid gap-4 lg:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Buscar notificación
                </label>

                <input
                  type="text"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Buscar por título, módulo, tipo o mensaje..."
                  className="
                    w-full
                    rounded-2xl
                    border
                    border-slate-300
                    bg-slate-200
                    px-4
                    py-3
                    text-sm
                    font-medium
                    text-slate-800
                    shadow-sm
                    outline-none
                    transition
                    placeholder:text-slate-500
                    focus:border-blue-600
                    focus:bg-white
                    focus:ring-4
                    focus:ring-blue-100
                  "
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Estado
                </label>

                <select
                  value={filtroEstado}
                  onChange={(e) => setFiltroEstado(e.target.value)}
                  className="
                    w-full
                    rounded-2xl
                    border
                    border-slate-300
                    bg-slate-200
                    px-4
                    py-3
                    text-sm
                    font-medium
                    text-slate-800
                    shadow-sm
                    outline-none
                    transition
                    focus:border-blue-600
                    focus:bg-white
                    focus:ring-4
                    focus:ring-blue-100
                  "
                >
                  <option value="">Todas</option>
                  <option value="no-leidas">No leídas</option>
                  <option value="leidas">Leídas</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Prioridad
                </label>

                <select
                  value={filtroPrioridad}
                  onChange={(e) => setFiltroPrioridad(e.target.value)}
                  className="
                    w-full
                    rounded-2xl
                    border
                    border-slate-300
                    bg-slate-200
                    px-4
                    py-3
                    text-sm
                    font-medium
                    text-slate-800
                    shadow-sm
                    outline-none
                    transition
                    focus:border-blue-600
                    focus:bg-white
                    focus:ring-4
                    focus:ring-blue-100
                  "
                >
                  <option value="">Todas las prioridades</option>
                  <option value="Alta">Alta</option>
                  <option value="Media">Media</option>
                  <option value="Baja">Baja</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:w-[300px]">
              <button
                type="button"
                onClick={cargarAlertas}
                className="rounded-2xl bg-slate-700 px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:scale-[1.01] hover:bg-slate-800"
              >
                Actualizar
              </button>

              <button
                type="button"
                onClick={marcarTodas}
                disabled={alertas.length === 0}
                className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:scale-[1.01] hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                Marcar todas
              </button>
            </div>
          </div>
        </section>

        {error && (
          <section className="rounded-3xl border border-red-200 bg-red-100 px-5 py-4 shadow-md">
            <p className="text-sm font-bold text-red-700">{error}</p>
          </section>
        )}

        <section className="min-h-[620px] overflow-hidden rounded-[28px] border border-slate-300 bg-slate-100 shadow-xl">
          <div className="grid h-[620px] grid-cols-1 lg:grid-cols-[390px_1fr]">
            <aside className="flex min-h-0 flex-col border-b border-slate-300 bg-slate-100 lg:border-b-0 lg:border-r">
              <div className="shrink-0 border-b border-slate-300 bg-slate-200 px-5 py-4">
                <h2 className="text-sm font-black text-slate-900">
                  Lista de notificaciones
                </h2>

                <p className="mt-1 text-sm text-slate-600">
                  Resultados: {alertasFiltradas.length}
                </p>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto pr-1 scrollbar-thin scrollbar-track-slate-200 scrollbar-thumb-slate-400">
                {alertasFiltradas.length === 0 && (
                  <div className="p-8 text-center">
                    <p className="text-sm font-bold text-slate-700">
                      No hay notificaciones
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      No se encontraron registros con los filtros aplicados.
                    </p>
                  </div>
                )}

                {alertasFiltradas.map((alerta) => {
                  const activa = alertaActiva?.id === alerta.id;

                  return (
                    <button
                      key={alerta.id}
                      type="button"
                      onClick={() => seleccionarAlerta(alerta)}
                      className={`
                        block
                        w-full
                        border-b
                        border-slate-300
                        px-5
                        py-4
                        text-left
                        transition
                        ${
                          activa
                            ? "bg-blue-600 text-white"
                            : !alerta.leida
                            ? "bg-blue-50 hover:bg-blue-100"
                            : "bg-slate-100 hover:bg-slate-200"
                        }
                      `}
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={`
                            mt-1
                            h-3
                            w-3
                            shrink-0
                            rounded-full
                            ${
                              activa
                                ? "bg-white"
                                : alerta.leida
                                ? "bg-slate-400"
                                : getDotClass(alerta.prioridad)
                            }
                          `}
                        />

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <p
                              className={`
                                line-clamp-2
                                text-sm
                                font-black
                                ${
                                  activa
                                    ? "text-white"
                                    : "text-slate-900"
                                }
                              `}
                            >
                              {alerta.titulo}
                            </p>

                            {!alerta.leida && !activa && (
                              <span className="rounded-full bg-blue-600 px-2 py-1 text-[10px] font-black text-white">
                                Nueva
                              </span>
                            )}
                          </div>

                          <p
                            className={`
                              mt-2
                              text-sm
                              font-semibold
                              ${
                                activa
                                  ? "text-blue-100"
                                  : "text-slate-600"
                              }
                            `}
                          >
                            {alerta.modulo}
                          </p>

                          <p
                            className={`
                              mt-2
                              text-xs
                              font-semibold
                              ${
                                activa
                                  ? "text-blue-100"
                                  : "text-slate-500"
                              }
                            `}
                          >
                            {formatFecha(alerta.fechaCreacion)}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </aside>

            <div className="min-h-0 overflow-y-auto bg-slate-200 p-6 scrollbar-thin scrollbar-track-slate-200 scrollbar-thumb-slate-400">
              {!alertaActiva ? (
                <div className="flex h-full min-h-[500px] items-center justify-center rounded-3xl border border-slate-300 bg-slate-100 p-8 text-center">
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      Selecciona una notificación
                    </p>

                    <p className="mt-1 text-sm text-slate-600">
                      Aquí se mostrará la información completa del registro.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex min-h-[540px] flex-col overflow-hidden rounded-[28px] border border-slate-300 bg-slate-100 shadow-md">
                  <div className="shrink-0 border-b border-slate-300 bg-white px-6 py-5">
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                      <div>
                        <p className="text-sm font-bold text-slate-500">
                          {alertaActiva.modulo}
                        </p>

                        <h2 className="mt-1 text-xl font-black text-slate-900">
                          {alertaActiva.titulo}
                        </h2>

                        <p className="mt-2 text-sm font-semibold text-slate-500">
                          {formatFecha(alertaActiva.fechaCreacion)}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-black ${getPrioridadClass(
                            alertaActiva.prioridad
                          )}`}
                        >
                          {alertaActiva.prioridad}
                        </span>

                        <span
                          className={`
                            rounded-full
                            border
                            px-3
                            py-1
                            text-xs
                            font-black
                            ${
                              alertaActiva.leida
                                ? "border-slate-300 bg-slate-200 text-slate-700"
                                : "border-blue-200 bg-blue-100 text-blue-700"
                            }
                          `}
                        >
                          {alertaActiva.leida ? "Leída" : "Nueva"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="min-h-0 flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-track-slate-100 scrollbar-thumb-slate-400">
                    <div className="rounded-3xl border border-slate-300 bg-white p-6 shadow-sm">
                      <p className="text-sm font-black text-slate-900">
                        Mensaje
                      </p>

                      <p className="mt-3 text-sm font-medium leading-relaxed text-slate-700">
                        {alertaActiva.mensaje}
                      </p>
                    </div>

                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                      <InfoBox label="Tipo" value={alertaActiva.tipo} />
                      <InfoBox label="Módulo" value={alertaActiva.modulo} />
                      <InfoBox
                        label="ID de referencia"
                        value={alertaActiva.referenciaId ?? "Sin referencia"}
                      />
                      <InfoBox
                        label="Usuario"
                        value={alertaActiva.usuarioNombre ?? "Sistema"}
                      />
                    </div>
                  </div>

                  <div className="shrink-0 border-t border-slate-300 bg-white px-6 py-4">
                    <div className="flex flex-wrap justify-end gap-3">
                      {!alertaActiva.leida && (
                        <button
                          type="button"
                          onClick={() => marcarLeida(alertaActiva.id)}
                          className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:scale-[1.01] hover:bg-blue-700"
                        >
                          Marcar como leída
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={eliminarSeleccionada}
                        className="rounded-2xl bg-red-600 px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:scale-[1.01] hover:bg-red-700"
                      >
                        Eliminar notificación
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

const HeaderBox = ({ label, value }) => (
  <div className="rounded-2xl border border-white/10 bg-slate-900/50 px-4 py-3 text-left shadow-sm backdrop-blur xl:text-right">
    <p className="text-sm font-medium text-cyan-100">{label}</p>
    <p className="mt-1 text-xl font-black text-white">{value}</p>
  </div>
);

const InfoBox = ({ label, value }) => (
  <div className="rounded-3xl border border-slate-300 bg-white p-5 shadow-sm">
    <p className="text-xs font-black uppercase tracking-wide text-slate-500">
      {label}
    </p>

    <p className="mt-2 break-words text-sm font-bold text-slate-900">
      {value}
    </p>
  </div>
);

export default Notificaciones;