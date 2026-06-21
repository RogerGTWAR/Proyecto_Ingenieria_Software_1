import { api } from "./api.js";

const toUI = (s) => ({
  id: s.servicio_id,
  nombreServicio: s.nombre_servicio ?? "",
  descripcion: s.descripcion ?? "",
  totalCostoDirecto: Number(s.total_costo_directo ?? 0),
  totalCostoIndirecto: Number(s.total_costo_indirecto ?? 0),
  costoVenta: Number(s.costo_venta ?? 0),
  fechaCreacion: s.fecha_creacion ?? null,
  fechaActualizacion: s.fecha_actualizacion ?? null,
});

const extractPayload = (res) => {
  if (res?.data?.data) return res.data.data;
  if (res?.data) return res.data;
  return res;
};

export const fetchServicios = async () => {
  const res = await api("/servicios");

  const data = extractPayload(res);
  const list = Array.isArray(data) ? data : [];

  return list.map(toUI);
};

export const createServicio = async (servicio) => {
  const body = {
    nombre_servicio: servicio.nombreServicio,
    descripcion: servicio.descripcion ?? null,
    total_costo_directo: Number(servicio.totalCostoDirecto ?? 0),
    total_costo_indirecto: Number(servicio.totalCostoIndirecto ?? 0),
  };

  const res = await api("/servicios", {
    method: "POST",
    body,
  });

  const payload = extractPayload(res);
  return toUI(payload);
};

export const updateServicio = async (id, servicio) => {
  const body = {
    nombre_servicio: servicio.nombreServicio,
    descripcion: servicio.descripcion ?? null,
    total_costo_directo: Number(servicio.totalCostoDirecto ?? 0),
    total_costo_indirecto: Number(servicio.totalCostoIndirecto ?? 0),
  };

  const res = await api(`/servicios/${id}`, {
    method: "PATCH",
    body,
  });

  const payload = extractPayload(res);
  return toUI(payload);
};

export const deleteServicio = async (id) => {
  await api(`/servicios/${id}`, {
    method: "DELETE",
  });

  return true;
};