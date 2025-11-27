// hooks/usePermisos.js
import { useState } from "react";
import {
  buscarEmpleado,
  fetchMenusAll,
  fetchPermisosAsignados,
  fetchMenusSinAsignar,
  asignarPermisos,
  removerPermisos,
  fetchMenuByUser,
} from "../data/permisos.js";

export function usePermisos() {
  const [empleado, setEmpleado] = useState(null);
  const [menus, setMenus] = useState([]);
  const [asignados, setAsignados] = useState([]);
  const [noAsignados, setNoAsignados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const refreshLocalMenus = async (usuarioId) => {
    const menuReal = await fetchMenuByUser(usuarioId);

    localStorage.setItem("menu", JSON.stringify(menuReal));
    window.dispatchEvent(new Event("storage"));
  };

  const buscar = async (usuario) => {
    try {
      setLoading(true);
      setError("");

      const result = await buscarEmpleado(usuario);

      if (!result) {
        setEmpleado(null);
        return null;
      }

      setEmpleado(result);
      return result;
    } catch (e) {
      setError(e.message);
      setEmpleado(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const loadMenus = async () => {
    try {
      const list = await fetchMenusAll();
      setMenus(list);
    } catch (e) {
      setError(e.message);
    }
  };

  const loadAsignados = async (usuarioId) => {
    try {
      const list = await fetchPermisosAsignados(usuarioId);
      setAsignados(list);
      return list;
    } catch (e) {
      setError(e.message);
      return [];
    }
  };

  const loadNoAsignados = async (usuarioId) => {
    try {
      const list = await fetchMenusSinAsignar(usuarioId);
      setNoAsignados(list);
      return list;
    } catch (e) {
      setError(e.message);
      return [];
    }
  };

  const asignar = async (usuarioId, idsMenus) => {
    await asignarPermisos(usuarioId, idsMenus);
    await loadAsignados(usuarioId);
    await loadNoAsignados(usuarioId);
    await refreshLocalMenus(usuarioId);
  };

  const remover = async (usuarioId, idsMenus) => {
    await removerPermisos(usuarioId, idsMenus);
    await loadAsignados(usuarioId);
    await loadNoAsignados(usuarioId);
    await refreshLocalMenus(usuarioId);
  };

  return {
    empleado,
    menus,
    asignados,
    noAsignados,
    loading,
    error,

    buscar,
    loadMenus,
    loadAsignados,
    loadNoAsignados,
    asignar,
    remover,
  };
}
