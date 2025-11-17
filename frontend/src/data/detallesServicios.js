import { api } from "./api.js";

const toUI = (d) => ({
  id: d.detalle_servicio_id,
  servicioId: d.servicio_id,
  materialId: d.material_id,

  descripcion: d.descripcion ?? "",
  cantidad: Number(d.cantidad),
  unidadDeMedida: d.unidad_de_medida ?? "",
  precioUnitario: Number(d.precio_unitario),
  total: Number(d.total ?? d.cantidad * d.precio_unitario),

  servicioNombre: d.servicio_id_servicios?.nombre_servicio ?? "—",
  materialNombre: d.material_id_materiales?.nombre_material ?? "—",
});

export const fetchDetallesServicios = async () => {
  const { data } = await api("/detalles_servicios");
  const list = Array.isArray(data.data) ? data.data : data;
  return list.map(toUI);
};

export const createDetalleServicio = async (d) => {
  const body = {
    servicio_id: Number(d.servicio_id),
    material_id: Number(d.material_id),
    descripcion: d.descripcion ?? "",
    cantidad: Number(d.cantidad),
    unidad_de_medida: d.unidad_de_medida,
    precio_unitario: Number(d.precio_unitario),
  };

  const data = await api("/detalles_servicios", {
    method: "POST",
    body,
  });

  return toUI(data.data);
};

export const updateDetalleServicio = async (id, d) => {
  const body = {
    servicio_id: d.servicioId ? Number(d.servicioId) : undefined,
    material_id: d.materialId ? Number(d.materialId) : undefined,
    descripcion: d.descripcion,
    cantidad: d.cantidad,
    unidad_de_medida: d.unidadDeMedida,
    precio_unitario: d.precioUnitario,
  };

  const data = await api(`/detalles_servicios/${id}`, {
    method: "PATCH",
    body,
  });

  return toUI(data.data);
};

export const deleteDetalleServicio = async (id) => {
  await api(`/detalles_servicios/${id}`, { method: "DELETE" });
  return true;
};
