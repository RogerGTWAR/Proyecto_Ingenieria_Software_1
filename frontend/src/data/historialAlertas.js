import { api } from "./api.js";

const toUI = (a) => ({
  id: a.alerta_id,
  usuarioId: a.usuario_id ?? null,
  tipo: a.tipo ?? "General",
  titulo: a.titulo ?? "Notificación",
  mensaje: a.mensaje ?? "",
  modulo: a.modulo ?? "Sistema",
  referenciaId: a.referencia_id ?? null,
  prioridad: a.prioridad ?? "Media",
  leida: a.leida ?? false,
  fechaCreacion: a.fecha_creacion ?? null,
  usuarioNombre: a.usuarioNombre ?? "Sistema",
});

const extract = (res) => {
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.data?.data)) return res.data.data;
  if (Array.isArray(res)) return res;
  return [];
};

export const fetchHistorialAlertas = async () => {
  const res = await api("/historial_alertas");
  return extract(res).map(toUI);
};

export const fetchAlertasNoLeidas = async () => {
  const res = await api("/historial_alertas?soloNoLeidas=true");
  return extract(res).map(toUI);
};

export const marcarAlertaLeida = async (id) => {
  const res = await api(`/historial_alertas/${id}/leida`, {
    method: "PATCH",
  });

  return res;
};

export const marcarTodasAlertasLeidas = async () => {
  const res = await api("/historial_alertas/marcar-todas/leidas", {
    method: "PATCH",
  });

  return res;
};

export const eliminarAlerta = async (id) => {
  const res = await api(`/historial_alertas/${id}`, {
    method: "DELETE",
  });

  return res;
};