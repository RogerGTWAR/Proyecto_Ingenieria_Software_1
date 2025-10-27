import { api } from "./api.js";

const toUI = (p) => ({
  id: p.proyecto_id,
  clienteId: p.cliente_id,
  clienteNombre: p.cliente_nombre ?? p.clientes?.nombre_empresa ?? "—",
  nombreProyecto: p.nombre_proyecto,
  descripcion: p.descripcion,
  ubicacion: p.ubicacion,
  fechaInicio: p.fecha_inicio ? p.fecha_inicio.split("T")[0] : "",
  fechaFin: p.fecha_fin ? p.fecha_fin.split("T")[0] : "",
  presupuestoTotal: p.presupuesto_total,
  estado: p.estado,
});

export const fetchProyectos = async () => {
  const { data } = await api("/proyectos");
  const list = Array.isArray(data.data) ? data.data : data;
  return list.map(toUI);
};

export const createProyecto = async (p) => {
  const body = {
    cliente_id: p.clienteId,
    nombre_proyecto: p.nombreProyecto,
    descripcion: p.descripcion || null,
    ubicacion: p.ubicacion || null,
    fecha_inicio: p.fechaInicio,
    fecha_fin: p.fechaFin || null,
    presupuesto_total: Number(p.presupuestoTotal || 0),
    estado: p.estado,
  };

  const data = await api("/proyectos", {
    method: "POST",
    body,
  });

  const payload = data.data || data;
  return toUI(payload);
};

export const updateProyecto = async (id, p) => {
  const body = {
    cliente_id: p.clienteId,
    nombre_proyecto: p.nombreProyecto,
    descripcion: p.descripcion || null,
    ubicacion: p.ubicacion || null,
    fecha_inicio: p.fechaInicio,
    fecha_fin: p.fechaFin || null,
    presupuesto_total: Number(p.presupuestoTotal || 0),
    estado: p.estado,
  };

  const data = await api(`/proyectos/${id}`, {
    method: "PATCH",
    body, 
  });

  const payload = data.data || data;
  return toUI(payload);
};

export const deleteProyecto = async (id) => {
  await api(`/proyectos/${id}`, { method: "DELETE" });
  return true;
};
