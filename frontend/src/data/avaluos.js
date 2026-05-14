import { api } from "./api.js";

const toUI = (d) => ({
  id: d.avaluo_id,

  proyectoId: d.proyecto_id ?? 0,
  descripcion: d.descripcion ?? "",
  montoEjecutado: Number(d.monto_ejecutado ?? 0),

  fechaInicio: d.fecha_inicio ?? "",
  fechaFin: d.fecha_fin ?? "",
  tiempoTotalDias: Number(d.tiempo_total_dias ?? 0),

  fechaCreacion: d.fecha_creacion ?? "",
  fechaActualizacion: d.fecha_actualizacion ?? "",
});

const getResponseData = (response) => {
  return response?.data?.data ?? response?.data ?? response;
};

export const fetchAvaluos = async () => {
  const response = await api("/avaluos");

  const list = Array.isArray(response.data?.data)
    ? response.data.data
    : Array.isArray(response.data)
    ? response.data
    : [];

  return list.map(toUI);
};

export const createAvaluo = async (d) => {
  const body = {
    proyecto_id: Number(d.proyecto_id ?? d.proyectoId),
    descripcion: d.descripcion ?? null,
    fecha_inicio: d.fecha_inicio ?? d.fechaInicio,
    fecha_fin: d.fecha_fin ?? d.fechaFin,
  };

  const response = await api("/avaluos", {
    method: "POST",
    body,
  });

  return toUI(getResponseData(response));
};

export const updateAvaluo = async (id, d) => {
  const body = {
    proyecto_id:
      d.proyectoId !== undefined ? Number(d.proyectoId) : undefined,

    descripcion:
      d.descripcion !== undefined ? d.descripcion : undefined,

    fecha_inicio:
      d.fechaInicio !== undefined ? d.fechaInicio : undefined,

    fecha_fin:
      d.fechaFin !== undefined ? d.fechaFin : undefined,
  };

  const response = await api(`/avaluos/${id}`, {
    method: "PATCH",
    body,
  });

  return toUI(getResponseData(response));
};

export const deleteAvaluo = async (id) => {
  await api(`/avaluos/${id}`, {
    method: "DELETE",
  });

  return true;
};