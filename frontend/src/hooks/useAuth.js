import { useEffect, useState } from "react";

import {
  loginRequest,
  registerRequest,
  autoRegisterRequest,
  forgotPasswordRequest,
  resetPasswordRequest,
  meRequest,
  logoutRequest,
  fetchUsuarios,
  fetchUsuarioById,
  updateUsuarioRequest,
  deleteUsuarioRequest,
} from "../data/auth.js";

import { fetchMenuByUser } from "../data/menus.js";

const toUsuarioUI = (u) => ({
  usuario_id: u.usuario_id,
  id: u.usuario_id,

  usuario: u.usuario ?? "",
  empleado_id: u.empleado_id ?? null,

  nombres: u.nombres ?? "",
  apellidos: u.apellidos ?? "",
  rol_id: u.rol_id ?? null,
  cargo: u.cargo ?? "",

  cedula: u.cedula ?? "",
  empleado: u.empleado ?? "",
});

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [usuarios, setUsuarios] = useState([]);
  const [usuariosLoading, setUsuariosLoading] = useState(false);
  const [usuariosError, setUsuariosError] = useState("");

  const clearSession = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("menu");
  };

  const saveSession = async (usr) => {
    setUser(usr);
    localStorage.setItem("user", JSON.stringify(usr));

    if (usr?.usuario_id) {
      const menu = await fetchMenuByUser(usr.usuario_id);
      localStorage.setItem("menu", JSON.stringify(menu));
    }
  };

  const loadUser = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        clearSession();
        return;
      }

      const res = await meRequest();

      if (res?.ok && res.user) {
        await saveSession(res.user);
      } else {
        clearSession();
      }
    } catch (error) {
      console.error("loadUser error:", error);
      clearSession();
    } finally {
      setLoading(false);
    }
  };

  const loadUsuarios = async () => {
    try {
      setUsuariosLoading(true);
      setUsuariosError("");

      const list = await fetchUsuarios();
      const safeList = Array.isArray(list) ? list : [];

      const data = safeList.map(toUsuarioUI);

      setUsuarios(data);
      return data;
    } catch (error) {
      setUsuariosError(error.message || "Error al cargar usuarios");
      return [];
    } finally {
      setUsuariosLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const login = async (payload) => {
    const res = await loginRequest(payload);

    console.log("Respuesta login:", res);

    const token =
      res?.token ||
      res?.accessToken ||
      res?.data?.token ||
      res?.data?.accessToken;

    const usr =
      res?.user ||
      res?.usuario ||
      res?.data?.user ||
      res?.data?.usuario ||
      null;

    if (!token) {
      throw new Error("El backend no devolvió un token de autenticación.");
    }

    localStorage.setItem("token", token);

    if (usr) {
      await saveSession(usr);
    } else {
      await loadUser();
    }

    return res;
  };

  const register = async (payload) => {
    return await registerRequest(payload);
  };

  const autoRegister = async (payload) => {
    return await autoRegisterRequest(payload);
  };

  const sendForgotPassword = async (usuario) => {
    return await forgotPasswordRequest({ usuario });
  };

  const resetPassword = async (usuario, codigo, contrasena) => {
    return await resetPasswordRequest({
      usuario,
      codigo,
      contrasena,
    });
  };

  const logout = async () => {
    try {
      await logoutRequest();
    } catch (error) {
      console.error("logout error:", error);
    } finally {
      setUsuarios([]);
      clearSession();
    }
  };

  const addUsuario = async (payload) => {
    const created = await registerRequest({
      cedula: payload.cedula,
      usuario: payload.usuario,
      contrasena: payload.contrasena,
    });

    await loadUsuarios();

    return created?.usuario ? toUsuarioUI(created.usuario) : created;
  };

  const editUsuario = async (id, payload) => {
    const updated = await updateUsuarioRequest(id, {
      empleado_id: payload.empleado_id,
      usuario: payload.usuario,
      contrasena: payload.contrasena,
      rol_id: payload.rol_id,
    });

    await loadUsuarios();

    return updated ? toUsuarioUI(updated) : null;
  };

  const removeUsuario = async (id) => {
    await deleteUsuarioRequest(id);

    setUsuarios((prev) =>
      prev.filter((usuario) => Number(usuario.usuario_id) !== Number(id))
    );

    return true;
  };

  const getUsuarioById = async (id) => {
    const usuario = await fetchUsuarioById(id);
    return usuario ? toUsuarioUI(usuario) : null;
  };

  return {
    user,
    loading,

    usuarios,
    usuariosLoading,
    usuariosError,

    login,
    register,
    autoRegister,
    sendForgotPassword,
    resetPassword,
    logout,
    reload: loadUser,

    reloadUsuarios: loadUsuarios,
    addUsuario,
    editUsuario,
    removeUsuario,
    getUsuarioById,
  };
}