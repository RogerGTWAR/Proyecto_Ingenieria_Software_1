import { api } from "./api.js";

const toUI = (d) => ({
  id: d.detalle_vehiculo_id,
  vehiculoId: d.vehiculo_id,
  empleadoId: d.empleado_id,
  fechaAsignacion: d.fecha_asignacion
    ? d.fecha_asignacion.split("T")[0]
    : "",
  fechaFinAsignacion: d.fecha_fin_asignacion
    ? d.fecha_fin_asignacion.split("T")[0]
    : "",
  descripcion: d.descripcion || "—",
  empleadoNombre: d.empleados
    ? `${d.empleados.nombres} ${d.empleados.apellidos}`
    : "—",
  vehiculoNombre: d.vehiculos
    ? `${d.vehiculos.placa} (${d.vehiculos.marca} ${d.vehiculos.modelo})`
    : "—",
});

export const fetchDetallesVehiculos = async () => {
  const { data } = await api("/detalle_vehiculos");
  const list = Array.isArray(data.data) ? data.data : data;
  return list.map(toUI);
};

export const createDetalleVehiculo = async (d) => {
  const body = {
    vehiculo_id: Number(d.vehiculo_id ?? d.vehiculoId),
    empleado_id: Number(d.empleado_id ?? d.empleadoId),
    fecha_asignacion:
      d.fecha_asignacion ??
      d.fechaAsignacion ??
      new Date().toISOString(),
    fecha_fin_asignacion:
      d.fecha_fin_asignacion ??
      d.fechaFinAsignacion ??
      null,
    descripcion: d.descripcion ?? null,
  };

  const data = await api("/detalle_vehiculos", {
    method: "POST",
    body,
  });

  return toUI(data.data || data);
};

export const updateDetalleVehiculo = async (id, d) => {
  const body = {
    vehiculo_id: d.vehiculo_id ?? d.vehiculoId,
    empleado_id: d.empleado_id ?? d.empleadoId,
    fecha_asignacion: d.fecha_asignacion ?? d.fechaAsignacion,
    fecha_fin_asignacion: d.fecha_fin_asignacion ?? d.fechaFinAsignacion,
    descripcion: d.descripcion ?? undefined,
  };

  const data = await api(`/detalle_vehiculos/${id}`, {
    method: "PATCH",
    body,
  });

  const payload = data.data || data;
  return toUI(payload);
};

export async function deleteDetalleVehiculo(id) {
  if (!id) throw new Error("ID de detalle inválido");
  const res = await fetch(`/api/detalle_vehiculos/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error al eliminar detalle del vehículo");
  return true;
}

