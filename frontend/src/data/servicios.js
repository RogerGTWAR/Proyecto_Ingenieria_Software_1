import { api } from "./api.js";

const toUI = (s) => ({
  id: s.servicio_id,
  nombreServicio: s.nombre_servicio,
  descripcion: s.descripcion ?? "",
  totalCostoDirecto: Number(s.total_costo_directo ?? 0),
  totalCostoIndirecto: Number(s.total_costo_indirecto ?? 0),
  costoVenta: Number(s.costo_venta ?? 0),
  fechaCreacion: s.fecha_creacion,
  fechaActualizacion: s.fecha_actualizacion,
});

// GET
export const fetchServicios = async () => {
  const { data } = await api("/servicios");
  const list = Array.isArray(data.data) ? data.data : data;
  return list.map(toUI);
};

// POST — CORRECTO FINAL
export const createServicio = async (data) => {
  const body = {
    nombre_servicio: data.nombreServicio,
    descripcion: data.descripcion ?? null,
    total_costo_directo: Number(data.totalCostoDirecto ?? 0),
    total_costo_indirecto: Number(data.totalCostoIndirecto ?? 0),
  };

  const result = await api("/servicios", {
    method: "POST",
    body,
  });

  return toUI(result.data || result);
};

// PATCH — CORRECTO
export const updateServicio = async (id, data) => {
  const body = {
    ...(data.nombreServicio && { nombre_servicio: data.nombreServicio }),
    ...(data.descripcion !== undefined && { descripcion: data.descripcion }),
    ...(data.totalCostoDirecto !== undefined && {
      total_costo_directo: Number(data.totalCostoDirecto),
    }),
    ...(data.totalCostoIndirecto !== undefined && {
      total_costo_indirecto: Number(data.totalCostoIndirecto),
    }),
  };

  const result = await api(`/servicios/${id}`, {
    method: "PATCH",
    body,
  });

  return toUI(result.data || result);
};

export const deleteServicio = async (id) => {
  await api(`/servicios/${id}`, { method: "DELETE" });
  return true;
};
