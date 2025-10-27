//Listo
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
      const list = await fetchProyectos();
      setItems(list);
    } catch (e) {
      console.error("Error al cargar proyectos:", e);
      setError(e.message);
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
    setItems((prev) => prev.map((p) => (p.id === id ? updated : p)));
    return updated;
  };

  const remove = async (id) => {
    await deleteProyecto(id);
    setItems((prev) => prev.filter((p) => p.id !== id));
  };

  return { items, loading, error, reload: load, add, edit, remove };
}
