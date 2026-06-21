import { api } from "./api.js";

const extract = (res) => {
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data?.data)) return res.data.data;
  return [];
};

const toUI = (a) => ({
  id: a.alerta_id,
  material_id: a.material_id,
  materialNombre: a.materiales?.nombre_material ?? "Sin material",
  unidadMedida: a.materiales?.unidad_de_medida ?? "",
  cantidadActualMaterial: Number(a.materiales?.cantidad_en_stock ?? 0),
  tipoAlerta: a.tipo_alerta ?? "",
  mensaje: a.mensaje ?? "",
  stockActual: Number(a.stock_actual ?? 0),
  stockMinimo: Number(a.stock_minimo ?? 10),
  estado: a.estado ?? "Pendiente",
  fechaCreacion: a.fecha_creacion ?? "",
  fechaAtendida: a.fecha_atendida ?? "",
});

export const fetchAlertasInventario = async () => {
  const res = await api("/alertas_inventario");
  const list = extract(res);
  return list.map(toUI);
};

export const fetchAlertasPendientes = async () => {
  const res = await api("/alertas_inventario/pendientes");
  const list = extract(res);
  return list.map(toUI);
};

export const fetchAlertaInventarioById = async (id) => {
  const { data } = await api(`/alertas_inventario/${id}`);
  const payload = data?.data || data;
  return toUI(payload);
};

export const fetchAlertasPorMaterial = async (materialId) => {
  const res = await api(`/alertas_inventario/material/${materialId}`);
  const list = extract(res);
  return list.map(toUI);
};

export const atenderAlertaInventario = async (id) => {
  const { data } = await api(`/alertas_inventario/${id}/atender`, {
    method: "PATCH",
  });

  const payload = data?.data || data;
  return toUI(payload);
};

export const cancelarAlertaInventario = async (id) => {
  const { data } = await api(`/alertas_inventario/${id}/cancelar`, {
    method: "PATCH",
  });

  const payload = data?.data || data;
  return toUI(payload);
};

export const deleteAlertaInventario = async (id) => {
  await api(`/alertas_inventario/${id}`, { method: "DELETE" });
  return true;
};