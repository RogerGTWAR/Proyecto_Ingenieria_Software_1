// hooks/usePermisos.js
import { useEffect, useState } from "react";

import {
  buscarEmpleado,
  fetchMenusAll,
  fetchPermisosAsignados,
  fetchMenusSinAsignar,
  asignarPermisos,
  removerPermisos,
} from "../data/permisos.js";

export function usePermisos() {
  const [empleado, setEmpleado] = useState(null);
  const [menus, setMenus] = useState([]);
  const [asignados, setAsignados] = useState([]);
  const [noAsignados, setNoAsignados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ============================================================
     1. Buscar empleado por cédula
     ============================================================ */
  const buscar = async (documento) => {
    try {
      setLoading(true);
      setError("");

      const result = await buscarEmpleado(documento);

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

  /* ============================================================
     2. Cargar menús completos
     ============================================================ */
  const loadMenus = async () => {
    try {
      const list = await fetchMenusAll();
      setMenus(list);
    } catch (e) {
      setError(e.message);
    }
  };

  /* ============================================================
     3. Permisos asignados al usuario
     ============================================================ */
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

  /* ============================================================
     4. Menús NO asignados
     ============================================================ */
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

  /* ============================================================
     5. ASIGNAR permisos
     ============================================================ */
  const asignar = async (usuarioId, idsMenus) => {
    await asignarPermisos(usuarioId, idsMenus);
    await loadAsignados(usuarioId);
    await loadNoAsignados(usuarioId);
  };

  /* ============================================================
     6. REMOVER permisos
     ============================================================ */
  const remover = async (usuarioId, idsMenus) => {
    await removerPermisos(usuarioId, idsMenus);
    await loadAsignados(usuarioId);
    await loadNoAsignados(usuarioId);
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
