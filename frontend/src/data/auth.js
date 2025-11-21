import { api } from "./api.js";

/* ============================================================
   LOGIN
   ============================================================ */
export const loginRequest = async ({ usuario, contrasena }) => {
  return await api("/auth/login", {
    method: "POST",
    body: { usuario, contrasena },
  });
};

/* ============================================================
   REGISTRO NORMAL
   ============================================================ */
export const registerRequest = async ({ empleado_id, usuario, contrasena }) => {
  return await api("/auth/register", {
    method: "POST",
    body: { empleado_id, usuario, contrasena },
  });
};

/* ============================================================
   AUTO-REGISTER
   ============================================================ */
export const autoRegisterRequest = async ({ empleado_id }) => {
  return await api("/auth/auto-register", {
    method: "POST",
    body: { empleado_id },
  });
};

/* ============================================================
   RECUPERAR CONTRASEÑA
   ============================================================ */
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

/* ============================================================
   ME  ← ← ←  AQUI ESTABA EL ERROR
   ============================================================ */
export const meRequest = async () => {
  const res = await api("/auth/me");

  // res debe ser { ok: true, user: {...} }
  return res; 
};

/* ============================================================
   LOGOUT
   ============================================================ */
export const logoutRequest = async () => {
  await api("/auth/logout", { method: "POST" });
  return true;
};

/* ============================================================
   CONSULTAR USUARIOS
   ============================================================ */
export const fetchUsuarios = async () => {
  const res = await api("/auth/usuarios");
  return res.usuarios ?? [];
};

export const fetchUsuarioById = async (id) => {
  const res = await api(`/auth/usuarios/${id}`);
  return res.usuario ?? null;
};
