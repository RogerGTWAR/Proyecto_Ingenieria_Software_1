import { api } from "./api.js";

export const getUsuariosRequest = async () => {
  const res = await api("/auth/usuarios");
  return res.usuarios ?? [];
};

export const getUsuarioRequest = async (id) => {
  const res = await api(`/auth/usuarios/${id}`);
  return res.usuario ?? null;
};

export const createUsuarioRequest = async (data) => {
  const res = await api("/auth/register", {
    method: "POST",
    body: data,
  });

  return res.usuario ?? null;
};

export const updateUsuarioRequest = async (id, data) => {
  const res = await api(`/auth/usuarios/${id}`, {
    method: "PUT",
    body: data,
  });

  return res.usuario ?? null;
};

export const deleteUsuarioRequest = async (id) => {
  const res = await api(`/auth/usuarios/${id}`, {
    method: "DELETE",
  });

  return res.ok ?? false;
};
