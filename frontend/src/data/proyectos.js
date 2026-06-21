import { api } from "./api.js";

const toUI = (p) => ({
  id: p.proyecto_id ?? p.id,

  clienteId: p.cliente_id ?? p.clienteId ?? "",

  clienteNombre:
    p.cliente_nombre ??
    p.clientes?.nombre_empresa ??
    p.cliente?.nombre_empresa ??
    p.clienteNombre ??
    "—",

  nombreProyecto:
    p.nombre_proyecto ??
    p.nombreProyecto ??
    "—",

  descripcion: p.descripcion ?? "",

  ubicacion:
    p.ubicacion ??
    "—",

  fechaInicio: p.fecha_inicio
    ? p.fecha_inicio.split("T")[0]
    : p.fechaInicio ?? "",

  fechaFin: p.fecha_fin
    ? p.fecha_fin.split("T")[0]
    : p.fechaFin ?? "",

  presupuestoTotal: Number(
    p.presupuesto_total ??
      p.presupuestoTotal ??
      0
  ),

  estado: p.estado ?? "En Espera",
});

const toApi = (p) => ({
  cliente_id: p.cliente_id ?? p.clienteId,
  nombre_proyecto: p.nombre_proyecto ?? p.nombreProyecto,
  descripcion: p.descripcion || null,
  ubicacion: p.ubicacion || null,
  fecha_inicio: p.fecha_inicio ?? p.fechaInicio,
  fecha_fin: p.fecha_fin ?? p.fechaFin,
  presupuesto_total: Number(p.presupuesto_total ?? p.presupuestoTotal ?? 0),
  estado: p.estado ?? "En Espera",
});

const unwrap = (res) => {
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.data?.data)) return res.data.data;
  if (res?.data?.data) return res.data.data;
  if (res?.data) return res.data;
  return res;
};

export const fetchProyectos = async () => {
  const res = await api("/proyectos");

  const payload = unwrap(res);
  const list = Array.isArray(payload) ? payload : [];

  return list.map(toUI);
};

export const createProyecto = async (proyecto) => {
  const res = await api("/proyectos", {
    method: "POST",
    body: toApi(proyecto),
  });

  return toUI(unwrap(res));
};

export const updateProyecto = async (id, proyecto) => {
  const res = await api(`/proyectos/${id}`, {
    method: "PATCH",
    body: toApi(proyecto),
  });

  return toUI(unwrap(res));
};

export const deleteProyecto = async (id) => {
  await api(`/proyectos/${id}`, {
    method: "DELETE",
  });

  return true;
};