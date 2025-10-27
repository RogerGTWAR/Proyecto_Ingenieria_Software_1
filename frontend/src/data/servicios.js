import { api } from "./api.js";

const toUI = (s) => ({
  id: s.servicio_id,
  nombreServicio: s.nombre_servicio,
  descripcion: s.descripcion ?? "",
  precioUnitario: parseFloat(s.precio_unitario ?? 0),
  cantidad: parseInt(s.cantidad ?? 0),
  total: parseFloat(s.total ?? 0),
  fechaInicio: s.fecha_inicio ? s.fecha_inicio.split("T")[0] : "",
  fechaFin: s.fecha_fin ? s.fecha_fin.split("T")[0] : "",
  tiempoTotalDias: s.tiempo_total_dias ?? 0,
  unidadDeMedida: s.unidad_de_medida ?? "",
  estado: s.estado ?? "Activo",
});

export const fetchServicios = async () => {
  const { data } = await api("/servicios");
  return (data ?? []).map(toUI);
};

export const createServicio = async (s) => {
  const body = {
    nombre_servicio: s.nombreServicio,
    descripcion: s.descripcion,
    precio_unitario: parseFloat(s.precioUnitario),
    cantidad: parseInt(s.cantidad),
    unidad_de_medida: s.unidadDeMedida,
    estado: s.estado,
    fecha_inicio: s.fechaInicio,
    fecha_fin: s.fechaFin,
  };

  const { data } = await api("/servicios", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });

  return toUI(data);
};

export const updateServicio = async (id, s) => {
  const body = {
    nombre_servicio: s.nombreServicio,
    descripcion: s.descripcion,
    precio_unitario: parseFloat(s.precioUnitario),
    cantidad: parseInt(s.cantidad),
    unidad_de_medida: s.unidadDeMedida,
    estado: s.estado,
    fecha_inicio: s.fechaInicio,
    fecha_fin: s.fechaFin,
  };

  const { data } = await api(`/servicios/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body,
  });

  return toUI(data);
};

export const deleteServicio = async (id) => {
  await api(`/servicios/${id}`, { method: "DELETE" });
  return true;
};
