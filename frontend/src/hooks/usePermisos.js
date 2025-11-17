import { useEffect, useState } from "react";
import {
  fetchMenu,
  fetchPermisosByUsuario,
  fetchMenuNoAsignado,
  asignarPermisos,
  removerPermisos,
} from "../data/permisos.js";

export function usePermisos(usuarioId) {
  const [menu, setMenu] = useState([]);
  const [asignados, setAsignados] = useState([]);
  const [noAsignados, setNoAsignados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);

      const [allMenu, permisosUser, sinAsignar] = await Promise.all([
        fetchMenu(),
        usuarioId ? fetchPermisosByUsuario(usuarioId) : [],
        usuarioId ? fetchMenuNoAsignado(usuarioId) : [],
      ]);

      setMenu(allMenu);
      setAsignados(permisosUser);
      setNoAsignados(sinAsignar);

      return { allMenu, permisosUser, sinAsignar };
    } catch (e) {
      console.error("Error al cargar permisos:", e);
      setError(e.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [usuarioId]);

  const asignar = async (menusIds) => {
    await asignarPermisos(usuarioId, menusIds);
    return load(); 
  };

  const remover = async (menusIds) => {
    await removerPermisos(usuarioId, menusIds);
    return load();
  };

  return {
    menu,         
    asignados,   
    noAsignados,   
    loading,
    error,
    reload: load,
    asignar,
    remover,
  };
}
