import { api } from "./api.js";

const toUI = (e) => ({
  id: e.empleado_id,
  nombres: e.nombres ?? "",
  apellidos: e.apellidos ?? "",
  cedula: e.cedula ?? "",
  rolId: e.rol_id ?? e.roles?.rol_id ?? null,
  rolNombre: e.roles?.cargo ?? "Sin rol",
  fecha_nacimiento: e.fecha_nacimiento ?? "",
  fecha_contratacion: e.fecha_contratacion ?? "",
  direccion: e.direccion ?? "",
  pais: e.pais ?? "",
  telefono: e.telefono ?? "",
  correo: e.correo ?? "",
  reportes: e.reportes ?? null,
  estado: e.fecha_eliminacion ? "Inactivo" : "Activo",
});

const extractPayload = (res) => {
  if (res?.data?.data) return res.data.data;
  if (res?.data) return res.data;
  return res;
};

export const fetchEmpleados = async () => {
  const res = await api("/empleados");

  const data = extractPayload(res);
  const list = Array.isArray(data) ? data : [];

  return list.map(toUI);
};

export const createEmpleado = async (empleado) => {
  const body = {
    nombres: empleado.nombres,
    apellidos: empleado.apellidos,
    cedula: empleado.cedula,
    rol_id: Number(empleado.rol_id ?? empleado.rolId),
    fecha_nacimiento: empleado.fecha_nacimiento,
    fecha_contratacion: empleado.fecha_contratacion,
    direccion: empleado.direccion,
    pais: empleado.pais,
    telefono: empleado.telefono,
    correo: empleado.correo,
    reportes: empleado.reportes ? Number(empleado.reportes) : null,
  };

  const res = await api("/empleados", {
    method: "POST",
    body,
  });

  const payload = extractPayload(res);
  return toUI(payload);
};

export const updateEmpleado = async (id, empleado) => {
  const body = {
    nombres: empleado.nombres,
    apellidos: empleado.apellidos,
    cedula: empleado.cedula,
    rol_id: Number(empleado.rol_id ?? empleado.rolId),
    fecha_nacimiento: empleado.fecha_nacimiento,
    fecha_contratacion: empleado.fecha_contratacion,
    direccion: empleado.direccion,
    pais: empleado.pais,
    telefono: empleado.telefono,
    correo: empleado.correo,
    reportes: empleado.reportes ? Number(empleado.reportes) : null,
  };

  const res = await api(`/empleados/${id}`, {
    method: "PATCH",
    body,
  });

  const payload = extractPayload(res);
  return toUI(payload);
};

export const deleteEmpleado = async (id) => {
  await api(`/empleados/${id}`, {
    method: "DELETE",
  });

  return true;
};