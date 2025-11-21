// data/menus.js
import { api } from "./api.js";

/* ============================================
   Conversión BACKEND → UI (para MenúsPage)
   ============================================ */
const toUI = (d) => ({
  id: d.id_menu,
  nombre: d.nombre ?? "",
  esSubmenu: d.es_submenu ?? false,
  url: d.url ?? "",
  parentId: d.id_menu_parent ?? null,
  estado: d.estado ?? true,
  show: d.show ?? true,
});

/* ============================================
   Helper para listas
   ============================================ */
function extract(res) {
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res)) return res;
  return [];
}

/* ============================================
   1. Obtener menús (plano) → MenúsPage
   ============================================ */
export const fetchMenus = async () => {
  const res = await api("/menus");
  const list = extract(res);
  return list.map(toUI);
};

/* ============================================
   2. Crear menú
   ============================================ */
export const createMenu = async (d) => {
  const body = {
    nombre: d.nombre,
    es_submenu: !!d.esSubmenu,
    url: d.url || null,
    id_menu_parent: d.parentId || null,
    estado: d.estado ?? true,
    show: d.show ?? true,
  };

  const res = await api("/menus", {
    method: "POST",
    body,
  });

  return toUI(res.data);
};

/* ============================================
   3. Actualizar menú
   ============================================ */
export const updateMenu = async (id, d) => {
  const body = {
    nombre: d.nombre,
    es_submenu: d.esSubmenu,
    url: d.url ?? undefined,
    id_menu_parent: d.parentId ?? undefined,
    estado: d.estado ?? undefined,
    show: d.show ?? undefined,
  };

  const res = await api(`/menus/${id}`, {
    method: "PATCH",
    body,
  });

  return toUI(res.data);
};

/* ============================================
   4. Eliminar menú
   ============================================ */
export const deleteMenu = async (id) => {
  await api(`/menus/${id}`, { method: "DELETE" });
  return true;
};

/* ============================================
   5. OBTENER ÁRBOL COMPLETO → si lo necesitas
   ============================================ */
export const fetchMenuTree = async () => {
  const res = await api("/menus/tree/all/data");
  // aquí el backend ya da data en formato árbol, lo devolvemos tal cual
  return res.data ?? [];
};

/* ============================================
   6. OBTENER MENÚ POR USUARIO → permisos
   ============================================ */
export const fetchMenuByUser = async (usuarioId) => {
  const res = await api(`/menus/usuario/${usuarioId}`);
  // esto también viene como { ok, data: tree }
  return res.data ?? [];
};
