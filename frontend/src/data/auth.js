import { api } from "./api.js";

export const loginRequest = async ({ usuario, contrasena }) => {
  return await api("/auth/login", {
    method: "POST",
    body: { usuario, contrasena },
  });
};

export const registerRequest = async ({ empleado_id, usuario, contrasena }) => {
  return await api("/auth/register", {
    method: "POST",
    body: { empleado_id, usuario, contrasena },
  });
};

export const autoRegisterRequest = async ({ empleado_id }) => {
  return await api("/auth/auto-register", {
    method: "POST",
    body: { empleado_id },
  });
};

export const forgotPasswordRequest = async ({ usuario }) => {
  return await api("/auth/forgot-password", {
    method: "POST",
    body: { usuario },
  });
};

export const resetPasswordRequest = async ({ token, contrasena }) => {
  return await api("/auth/reset-password", {
    method: "POST",
    body: { token, contrasena },
  });
};

export const meRequest = async () => {
  const res = await api("/auth/me");
  return res; 
};

export const logoutRequest = async () => {
  await api("/auth/logout", { method: "POST" });
  return true;
};

export const fetchUsuarios = async () => {
  const res = await api("/auth/usuarios");
  return res.usuarios ?? [];
};

export const fetchUsuarioById = async (id) => {
  const res = await api(`/auth/usuarios/${id}`);
  return res.usuario ?? null;
};
