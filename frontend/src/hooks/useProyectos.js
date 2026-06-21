import { useEffect, useState } from "react";

import {
  fetchProyectos,
  createProyecto,
  updateProyecto,
  deleteProyecto,
} from "../data/proyectos.js";

export function useProyectos() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError("");

      const list = await fetchProyectos();
      const safeList = Array.isArray(list) ? list : [];

      setItems(safeList);

      return safeList;
    } catch (error) {
      setError(error.message || "Error al cargar proyectos");
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const add = async (payload) => {
    const created = await createProyecto(payload);

    setItems((prev) => [created, ...prev]);

    return created;
  };

  const edit = async (id, payload) => {
    const updated = await updateProyecto(id, payload);

    setItems((prev) =>
      prev.map((proyecto) =>
        Number(proyecto.id) === Number(id) ? updated : proyecto
      )
    );

    return updated;
  };

  const remove = async (id) => {
    await deleteProyecto(id);

    setItems((prev) =>
      prev.filter((proyecto) => Number(proyecto.id) !== Number(id))
    );

    return true;
  };

  return {
    items,
    loading,
    error,
    reload: load,
    add,
    edit,
    remove,
  };
}