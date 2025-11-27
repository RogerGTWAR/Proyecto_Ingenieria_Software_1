import { api } from "./api.js";


const toUI = (d) => ({
  id: d.id_menu,
  nombre: d.nombre ?? "",
  esSubmenu: d.es_submenu ?? false,
  url: d.url ?? "",
  parentId: d.id_menu_parent ?? null,
  estado: d.estado ?? true,
  show: d.show ?? true,
});


function extract(res) {
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res)) return res;
  return [];
}

export const fetchMenus = async () => {
  const res = await api("/menus");
  const list = extract(res);
  return list.map(toUI);
};


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

export const deleteMenu = async (id) => {
  await api(`/menus/${id}`, { method: "DELETE" });
  return true;
};


export const fetchMenuTree = async () => {
  const res = await api("/menus/tree/all/data");
  return res.data ?? [];
};


export const fetchMenuByUser = async (usuarioId) => {
  const res = await api(`/menus/usuario/${usuarioId}`);
  return res.data ?? [];
};
