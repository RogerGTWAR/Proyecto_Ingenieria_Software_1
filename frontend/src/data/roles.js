import { api } from "./api.js";

const normalizeKey = (s = "") =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\s+/g, "");

const toUI = (r) => ({
  id: r.rol_id,
  nombre: r.cargo ?? "",
  descripcion: r.descripcion ?? "",
  clave: normalizeKey(r.cargo ?? ""),
});

export const fetchRoles = async () => {
  const { data } = await api("/roles");
  return data.map(toUI);
};

export const createRole = async (u) => {
  const body = {
    cargo: u.nombre,
    descripcion: u.descripcion ?? "",
  };
  const { data } = await api("/roles", { method: "POST", body });
  return toUI(data);
};

export const updateRole = async (id, u) => {
  const body = {
    ...(u.nombre !== undefined ? { cargo: u.nombre } : {}),
    ...(u.descripcion !== undefined ? { descripcion: u.descripcion } : {}),
  };
  const { data } = await api(`/roles/${id}`, { method: "PATCH", body });
  return toUI(data);
};

export const deleteRole = async (id) => {
  await api(`/roles/${id}`, { method: "DELETE" });
  return true;
};
