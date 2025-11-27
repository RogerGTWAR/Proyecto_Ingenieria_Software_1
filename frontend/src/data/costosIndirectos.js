import { api } from "./api.js";

const toUI = (d) => ({
  id: d.costo_indirecto_id,

  servicioId: d.servicio_id ?? 0,
  costoDirectoId: d.costo_directo_id ?? 0,

  totalCostoDirecto: Number(d.total_costo_directo ?? 0),

  administracion: Number(d.administracion ?? 0),
  operacion: Number(d.operacion ?? 0),
  utilidad: Number(d.utilidad ?? 0),

  precioUnitario: Number(d.precio_unitario ?? 0),
  totalCostoIndirecto: Number(d.total_costo_indirecto ?? 0),

  servicioNombre: d.servicio_id_servicios?.nombre_servicio ?? "",

  costoDirectoData: d.costo_directo_id_costos_directos_servicios ?? {
    cantidad_material: 0,
    precio_unitario: 0,
  },

  fechaCreacion: d.fecha_creacion ?? "",
  fechaActualizacion: d.fecha_actualizacion ?? "",
});

export const fetchCostosIndirectos = async () => {
  const { data } = await api("/costos_indirectos");
  const list = Array.isArray(data.data) ? data.data : data;
  return list.map(toUI);
};

export const createCostoIndirecto = async (d) => {
  const body = {
    servicio_id: Number(d.servicio_id ?? d.servicioId),
    costo_directo_id: Number(d.costo_directo_id ?? d.costoDirectoId),
    total_costo_directo: Number(
      d.total_costo_directo ?? d.totalCostoDirecto ?? 0
    ),
  };

  const response = await api("/costos_indirectos", {
    method: "POST",
    body,
  });

  return toUI(response.data || response);
};

export const updateCostoIndirecto = async (id, d) => {
  const body = {
    servicio_id: d.servicioId ? Number(d.servicioId) : undefined,
    costo_directo_id: d.costoDirectoId ? Number(d.costoDirectoId) : undefined,
    total_costo_directo:
      d.totalCostoDirecto !== undefined
        ? Number(d.totalCostoDirecto)
        : undefined,
  };

  const response = await api(`/costos_indirectos/${id}`, {
    method: "PATCH",
    body,
  });

  return toUI(response.data || response);
};

export const deleteCostoIndirecto = async (id) => {
  await api(`/costos_indirectos/${id}`, { method: "DELETE" });
  return true;
};
