import { api } from "./api.js";

const unwrap = (res) => {
  const body = res?.data ?? res;
  return body?.data ?? body;
};

const toUI = (d) => ({
  id: d.detalle_empleado_id ?? d.id,

  empleadoId: d.empleado_id ?? d.empleadoId,
  proyectoId: d.proyecto_id ?? d.proyectoId,

  fechaProyecto: d.fecha_de_proyecto
    ? d.fecha_de_proyecto.split("T")[0]
    : d.fechaProyecto || "",

  empleadoNombre: d.empleados
    ? `${d.empleados.nombres} ${d.empleados.apellidos}`
    : d.empleadoNombre || "—",

  proyectoNombre:
    d.proyectos?.nombre_proyecto ??
    d.proyectoNombre ??
    "—",
});

const toApi = (d) => ({
  empleado_id: Number(d.empleado_id ?? d.empleadoId),
  proyecto_id: Number(d.proyecto_id ?? d.proyectoId),
  fecha_de_proyecto:
    d.fecha_de_proyecto ??
    d.fechaProyecto ??
    null,
});

export const fetchDetallesEmpleados = async () => {
  const res = await api("/detalle_empleados");
  const payload = unwrap(res);
  const list = Array.isArray(payload) ? payload : [];
  return list.map(toUI);
};

export const createDetalleEmpleado = async (d) => {
  const res = await api("/detalle_empleados", {
    method: "POST",
    body: toApi(d),
  });

  return toUI(unwrap(res));
};

export const updateDetalleEmpleado = async (id, d) => {
  const res = await api(`/detalle_empleados/${id}`, {
    method: "PATCH",
    body: toApi(d),
  });

  return toUI(unwrap(res));
};

export const deleteDetalleEmpleado = async (id) => {
  await api(`/detalle_empleados/${id}`, {
    method: "DELETE",
  });

  return true;
};