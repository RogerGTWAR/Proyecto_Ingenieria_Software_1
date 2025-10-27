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
});

export const fetchEmpleados = async () => {
  const { data } = await api("/empleados");
  return (data ?? []).map(toUI);
};

export const createEmpleado = async (u) => {
  const body = {
    nombres: u.nombres,
    apellidos: u.apellidos,
    cedula: u.cedula,
    rol_id: Number(u.rol_id ?? u.rolId),
    fecha_nacimiento: u.fecha_nacimiento,
    fecha_contratacion: u.fecha_contratacion,
    direccion: u.direccion,
    pais: u.pais,
    telefono: u.telefono,
    correo: u.correo,
    reportes: u.reportes ? Number(u.reportes) : null,
  };

  const { data } = await api("/empleados", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });

  return toUI(data);
};

export const updateEmpleado = async (id, u) => {
  const body = {
    ...(u.nombres && { nombres: u.nombres }),
    ...(u.apellidos && { apellidos: u.apellidos }),
    ...(u.cedula && { cedula: u.cedula }),
    ...(u.rol_id ?? u.rolId
      ? { rol_id: Number(u.rol_id ?? u.rolId) }
      : {}),
    ...(u.fecha_nacimiento && { fecha_nacimiento: u.fecha_nacimiento }),
    ...(u.fecha_contratacion && { fecha_contratacion: u.fecha_contratacion }),
    ...(u.direccion && { direccion: u.direccion }),
    ...(u.pais && { pais: u.pais }),
    ...(u.telefono && { telefono: u.telefono }),
    ...(u.correo && { correo: u.correo }),
    ...(u.reportes && { reportes: Number(u.reportes) }),
  };

  const { data } = await api(`/empleados/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body,
  });

  return toUI(data);
};

export const deleteEmpleado = async (id) => {
  await api(`/empleados/${id}`, { method: "DELETE" });
  return true;
};
