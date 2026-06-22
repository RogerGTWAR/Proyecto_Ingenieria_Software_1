import { api } from "./api.js";

const getToken = () => {
  return localStorage.getItem("token");
};

export const loginRequest = async ({ usuario, contrasena }) => {
  return await api("/auth/login", {
    method: "POST",
    body: { usuario, contrasena },
  });
};

export const registerRequest = async ({ cedula, usuario, contrasena }) => {
  return await api("/auth/register", {
    method: "POST",
    body: { cedula, usuario, contrasena },
  });
};

export const autoRegisterRequest = async ({ cedula }) => {
  return await api("/auth/auto-register", {
    method: "POST",
    body: { cedula },
  });
};

export const forgotPasswordRequest = async ({ usuario }) => {
  return await api("/auth/forgot-password", {
    method: "POST",
    body: { usuario },
  });
};

export const resetPasswordRequest = async ({ usuario, codigo, contrasena }) => {
  return await api("/auth/reset-password", {
    method: "POST",
    body: { usuario, codigo, contrasena },
  });
};

export const meRequest = async () => {
  const token = getToken();

  return await api("/auth/me", {
    method: "GET",
    token,
    showErrorAlert: false,
  });
};

export const logoutRequest = async () => {
  const token = getToken();

  await api("/auth/logout", {
    method: "POST",
    token,
    showErrorAlert: false,
  });

  localStorage.removeItem("token");
  localStorage.removeItem("user");

  return true;
};

export const fetchUsuarios = async () => {
  const token = getToken();

  const res = await api("/auth/usuarios", {
    token,
  });

  return res.usuarios ?? [];
};

export const fetchUsuarioById = async (id) => {
  const token = getToken();

  const res = await api(`/auth/usuarios/${id}`, {
    token,
  });

  return res.usuario ?? null;
};

export const updateUsuarioRequest = async (id, data) => {
  const token = getToken();

  const body = {
    empleado_id: data.empleado_id ? Number(data.empleado_id) : null,
    usuario: data.usuario?.trim(),
    contrasena: data.contrasena?.trim() || null,
    rol_id: data.rol_id ? Number(data.rol_id) : null,
  };

  const res = await api(`/auth/usuarios/${id}`, {
    method: "PATCH",
    body,
    token,
  });

  return res.usuario ?? null;
};

export const deleteUsuarioRequest = async (id) => {
  const token = getToken();

  await api(`/auth/usuarios/${id}`, {
    method: "DELETE",
    token,
  });

  return true;
};