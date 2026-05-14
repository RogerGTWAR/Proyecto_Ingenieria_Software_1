import { api } from "./api.js";

const toUI = (d) => ({
  id: d.detalle_avaluo_id,

  avaluoId: d.avaluo_id,
  servicioId: d.servicio_id,

  actividad: d.actividad,
  unidadMedida: d.unidad_de_medida,
  cantidad: Number(d.cantidad),

  precioUnitario: Number(d.precio_unitario ?? 0),

  costoVenta: Number(d.costo_venta ?? 0),
  iva: Number(d.iva ?? 0),
  totalCostoVenta: Number(d.total_costo_venta ?? 0),

  servicioNombre: d.Servicios?.nombre_servicio ?? "",
  servicioDescripcion: d.Servicios?.descripcion ?? "",
});

const getResponseData = (response) => {
  return response?.data?.data ?? response?.data ?? response;
};

export const fetchDetallesAvaluos = async () => {
  const response = await api("/detalle_avaluos");

  const list = Array.isArray(response.data?.data)
    ? response.data.data
    : Array.isArray(response.data)
    ? response.data
    : [];

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

  const response = await api("/detalle_avaluos", {
    method: "POST",
    body,
  });

  return toUI(getResponseData(response));
};

export const updateDetalleAvaluo = async (id, payload) => {
  const body = {
    servicio_id:
      payload.servicioId !== undefined
        ? Number(payload.servicioId)
        : undefined,

    actividad:
      payload.actividad !== undefined
        ? payload.actividad
        : undefined,

    unidad_de_medida:
      payload.unidadMedida !== undefined
        ? payload.unidadMedida
        : undefined,

    cantidad:
      payload.cantidad !== undefined
        ? Number(payload.cantidad)
        : undefined,
  };

  const response = await api(`/detalle_avaluos/${id}`, {
    method: "PATCH",
    body,
  });

  return toUI(getResponseData(response));
};

export const deleteDetalleAvaluo = async (id) => {
  await api(`/detalle_avaluos/${id}`, {
    method: "DELETE",
  });

  return true;
};