import { api } from "./api.js";

export const buscarEmpleado = async (usuario) => {
  const res = await api(`/permisos/empleado/${usuario}`);
  return res.data;
};

export const fetchMenusAll = async () => {
  const res = await api(`/permisos/menus`);
  return Array.isArray(res.data) ? res.data : [];
};

export const fetchPermisosAsignados = async (usuarioId) => {
  const res = await api(`/permisos/asignados/${usuarioId}`);
  const list = res.data ?? [];

  return list.map((d) => ({
    permisoId: d.permisoId ?? d.permiso_id,
    menuId: d.menuId ?? d.id_menu,
    nombre: d.nombre ?? d.menu?.nombre ?? "",
    url: d.url ?? d.menu?.url ?? "",
    esSubmenu: d.esSubmenu ?? d.menu?.es_submenu ?? false,
  }));
};

export const fetchMenusSinAsignar = async (usuarioId) => {
  const res = await api(`/permisos/no-asignados/${usuarioId}`);
  const list = res.data ?? [];

  return list.map((m) => ({
    id: m.id_menu,
    nombre: m.nombre,
    url: m.url ?? "",
    esSubmenu: Boolean(m.es_submenu),
  }));
};

export const asignarPermisos = async (usuarioId, menus) => {
  const body = {
    usuario_id: Number(usuarioId),
    menus: menus.map((id) => Number(id)),
  };

  const res = await api(`/permisos/asignar`, {
    method: "POST",
    body,
  });

  return res.data;
};

export const removerPermisos = async (usuarioId, menus) => {
  const body = {
    usuario_id: Number(usuarioId),
    menus: menus.map((id) => Number(id)),
  };

  const res = await api(`/permisos/remover`, {
    method: "POST",
    body,
  });

  return res.data;
};

export const fetchMenuByUser = async (usuarioId) => {
  const res = await api(`/menus/usuario/${usuarioId}`);
  return res.data ?? [];
};
