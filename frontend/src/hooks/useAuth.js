import { useEffect, useState } from "react";
import {
  loginRequest,
  registerRequest,
  autoRegisterRequest,
  forgotPasswordRequest,
  resetPasswordRequest,
  meRequest,
  logoutRequest,
} from "../data/auth.js";

import { fetchMenuByUser } from "../data/menus.js";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    try {
      const res = await meRequest(); 

      if (res?.ok && res.user) {
        const usr = res.user;

        setUser(usr);
        localStorage.setItem("user", JSON.stringify(usr));

        const menu = await fetchMenuByUser(usr.usuario_id);
        localStorage.setItem("menu", JSON.stringify(menu));
      } else {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("menu");
      }
    } catch (e) {
      console.error("loadUser error:", e);
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("menu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

 
  const login = async (payload) => {
    await loginRequest(payload);
    await loadUser();
  };

  const register = async (payload) => await registerRequest(payload);

  const autoRegister = async (payload) =>
    await autoRegisterRequest(payload);

  const sendForgotPassword = async (usuario) =>
    await forgotPasswordRequest({ usuario });

  const resetPassword = async (token, contrasena) =>
    await resetPasswordRequest({ token, contrasena });

  const logout = async () => {
    await logoutRequest();
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("menu");
  };

  return {
    user,
    loading,
    login,
    register,
    autoRegister,
    sendForgotPassword,
    resetPassword,
    logout,
    reload: loadUser,
  };
}
