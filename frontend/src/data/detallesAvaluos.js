import { api } from "./api.js";

const toUI = (d) => ({
  id: d.detalle_avaluo_id,

  avaluoId: d.avaluo_id,
  servicioId: d.servicio_id,

  actividad: d.actividad,
  unidadMedida: d.unidad_de_medida,
  cantidad: Number(d.cantidad),
  precioUnitario: Number(d.precio_unitario),

  costoVenta: Number(d.costo_venta),
  iva: Number(d.iva),
  totalCostoVenta: Number(d.total_costo_venta),

  servicioNombre: d.Servicios?.nombre_servicio ?? "",
  servicioDescripcion: d.Servicios?.descripcion ?? "",
});

export const fetchDetallesAvaluos = async () => {
  const { data } = await api("/detalle_avaluos");
  const list = Array.isArray(data.data) ? data.data : data;
  return list.map(toUI);
};

export const createDetalleAvaluo = async (payload) => {
  const body = {
    avaluo_id: Number(payload.avaluoId),
    servicio_id: Number(payload.servicioId),
    actividad: payload.actividad,
    unidad_de_medida: payload.unidadMedida,
    cantidad: Number(payload.cantidad),
  };


  const res = await api("/detalle_avaluos", {
    method: "POST",
    body,
  });

  return toUI(res.data);
};

export const updateDetalleAvaluo = async (id, payload) => {
  const body = {
    servicio_id:
      payload.servicioId !== undefined
        ? Number(payload.servicioId)
        : undefined,
    actividad: payload.actividad ?? undefined,
    unidad_de_medida: payload.unidadMedida ?? undefined,
    cantidad:
      payload.cantidad !== undefined
        ? Number(payload.cantidad)
        : undefined,
  };

  const res = await api(`/detalle_avaluos/${id}`, {
    method: "PATCH",
    body,
  });

  return toUI(res.data);
};

export const deleteDetalleAvaluo = async (id) => {
  await api(`/detalle_avaluos/${id}`, { method: "DELETE" });
  return true;
};
