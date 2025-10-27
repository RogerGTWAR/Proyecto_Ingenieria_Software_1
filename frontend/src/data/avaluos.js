import { api } from "./api.js";

const toUI = (a) => ({
  id: a.avaluo_id,
  proyectoId: a.proyecto_id,
  proyectoNombre: a.nombre_proyecto ?? "Sin proyecto",
  estadoProyecto: a.estado ?? "—",
  descripcion: a.descripcion ?? "",
  montoEjecutado: a.monto_ejecutado ?? 0,
  fechaInicio: a.fecha_inicio ? a.fecha_inicio.split("T")[0] : "",
  fechaFin: a.fecha_fin ? a.fecha_fin.split("T")[0] : "",
  tiempoTotalDias: a.tiempo_total_dias ?? 0,
});

export const fetchAvaluos = async () => {
  const { data } = await api("/avaluos");
  return (data ?? []).map(toUI);
};

export const createAvaluo = async (a) => {
  const body = {
    proyecto_id: Number(a.proyectoId ?? a.proyecto_id),
    descripcion: a.descripcion ?? null,
    monto_ejecutado: parseFloat(a.montoEjecutado ?? a.monto_ejecutado),
    fecha_inicio: a.fechaInicio ?? a.fecha_inicio,
    fecha_fin: a.fechaFin ?? a.fecha_fin,
  };

  const { data } = await api("/avaluos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });

  return toUI(data);
};

export const updateAvaluo = async (id, a) => {
  const body = {
    ...(a.proyectoId && { proyecto_id: Number(a.proyectoId) }),
    ...(a.descripcion && { descripcion: a.descripcion }),
    ...(a.montoEjecutado && { monto_ejecutado: parseFloat(a.montoEjecutado) }),
    ...(a.fechaInicio && { fecha_inicio: a.fechaInicio }),
    ...(a.fechaFin && { fecha_fin: a.fechaFin }),
  };

  const { data } = await api(`/avaluos/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body,
  });

  return toUI(data);
};

export const deleteAvaluo = async (id) => {
  await api(`/avaluos/${id}`, { method: "DELETE" });
  return true;
};
