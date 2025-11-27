import { api } from "./api.js";

const toUI = (d) => ({
  id: d.detalle_empleado_id,
  empleadoId: d.empleado_id,
  proyectoId: d.proyecto_id,
  fechaProyecto: d.fecha_de_proyecto ? d.fecha_de_proyecto.split("T")[0] : "",
  empleadoNombre: d.empleados
    ? `${d.empleados.nombres} ${d.empleados.apellidos}`
    : "—",
  proyectoNombre: d.proyectos?.nombre_proyecto ?? "—",
});

export const fetchDetallesEmpleados = async () => {
  const { data } = await api("/detalle_empleados");
  const list = Array.isArray(data.data) ? data.data : data;
  return list.map(toUI);
};

export const createDetalleEmpleado = async (d) => {
  const body = {
    empleado_id: Number(d.empleado_id),
    proyecto_id: Number(d.proyecto_id),
    fecha_de_proyecto: d.fecha_de_proyecto || null,
  };


  const data = await api("/detalle_empleados", {
    method: "POST",
    body,
  });

  return toUI(data.data || data);
};



export const updateDetalleEmpleado = async (id, d) => {
  const body = {
    empleado_id: d.empleadoId ? Number(d.empleadoId) : undefined,
    proyecto_id: d.proyectoId ? Number(d.proyectoId) : undefined,
    fecha_de_proyecto: d.fechaProyecto || null,
  };

  const data = await api(`/detalle_empleados/${id}`, {
    method: "PATCH",
    body, 
  });

  const payload = data.data || data;
  return toUI(payload);
};

export const deleteDetalleEmpleado = async (id) => {
  await api(`/detalle_empleados/${id}`, { method: "DELETE" });
  return true;
};
