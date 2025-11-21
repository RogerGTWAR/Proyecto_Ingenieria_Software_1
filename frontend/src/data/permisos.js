// data/permisos.js
import { api } from "./api.js";

/* ============================================================
   1. Buscar empleado por documento
   ============================================================ */
export const buscarEmpleado = async (documento) => {
  const res = await api(`/permisos/empleado/${documento}`);
  return res.data;
};

/* ============================================================
   2. Obtener todos los menús
   ============================================================ */
export const fetchMenusAll = async () => {
  const res = await api(`/permisos/menus`);
  return Array.isArray(res.data) ? res.data : [];
};

/* ============================================================
   3. Permisos asignados
   ============================================================ */
export const fetchPermisosAsignados = async (usuarioId) => {
  const res = await api(`/permisos/asignados/${usuarioId}`);
  const list = res.data ?? [];

  return list.map((d) => ({
    permisoId: d.permiso_id,
    menuId: d.id_menu,
    nombre: d.menu?.nombre ?? "",
    url: d.menu?.url ?? "",
    esSubmenu: Boolean(d.menu?.es_submenu),
  }));
};

/* ============================================================
   4. Menús NO asignados
   ============================================================ */
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

/* ============================================================
   5. ASIGNAR permisos
   ============================================================ */
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

/* ============================================================
   6. REMOVER permisos
   ============================================================ */
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
