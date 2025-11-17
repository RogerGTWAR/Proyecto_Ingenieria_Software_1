import { api } from "./api.js";

const toMenuUI = (m) => ({
  id: m.id_menu,
  nombre: m.nombre,
  icono: m.icono,
  path: m.path,
  categoria: m.categoria,
});

const toPermisoUI = (p) => ({
  id: p.permiso_id,
  usuarioId: p.usuario_id,
  menuId: p.id_menu,
  estado: p.estado ?? true,
  fechaCreacion: p.fecha_creacion,
  menu: p.menu ? toMenuUI(p.menu) : null,
});

export const fetchMenu = async () => {
  const { data } = await api("/permisos/menu");
  const list = Array.isArray(data.data) ? data.data : data;
  return list.map(toMenuUI);
};

export const fetchPermisosByUsuario = async (usuarioId) => {
  const { data } = await api(`/permisos/${usuarioId}`);
  const list = Array.isArray(data.data) ? data.data : data;
  return list.map(toPermisoUI);
};

export const fetchMenuNoAsignado = async (usuarioId) => {
  const { data } = await api(`/permisos/no-asignados/${usuarioId}`);
  const list = Array.isArray(data.data) ? data.data : data;
  return list.map(toMenuUI);
};

export const asignarPermisos = async (usuarioId, menusIds = []) => {
  const body = {
    usuario_id: usuarioId,
    menus: menusIds,
  };

  const { data } = await api("/permisos/asignar", {
    method: "POST",
    body,
  });

  return data.data ?? data;
};

export const removerPermisos = async (usuarioId, menusIds = []) => {
  const body = {
    usuario_id: usuarioId,
    menus: menusIds,
  };

  const { data } = await api("/permisos/remover", {
    method: "POST",
    body,
  });

  return data.data ?? data;
};
