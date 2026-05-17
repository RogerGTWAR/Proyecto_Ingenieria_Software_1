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
      setItems(list);

      return list;
    } catch (e) {
      console.error("Error al cargar proyectos:", e);
      setError(e.message);
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
      prev.map((p) => (Number(p.id) === Number(id) ? updated : p))
    );

    return updated;
  };

  const remove = async (id) => {
    await deleteProyecto(id);

    setItems((prev) => prev.filter((p) => Number(p.id) !== Number(id)));
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