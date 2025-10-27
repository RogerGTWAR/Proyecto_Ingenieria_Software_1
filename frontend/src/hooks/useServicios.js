import { useEffect, useState } from "react";
import {
  fetchServicios,
  createServicio,
  updateServicio,
  deleteServicio,
} from "../data/servicios.js";

export function useServicios() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      const list = await fetchServicios();
      setItems(list);
    } catch (e) {
      setError(e.message || "Error al cargar servicios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const add = async (payload) => {
    const created = await createServicio(payload);
    setItems((prev) => [created, ...prev]);
  };

  const edit = async (id, payload) => {
    const updated = await updateServicio(id, payload);
    setItems((prev) => prev.map((p) => (p.id === id ? updated : p)));
    return updated;
  };

  const remove = async (id) => {
    await deleteServicio(id);
    setItems((prev) => prev.filter((p) => p.id !== id));
  };

  return { items, loading, error, reload: load, add, edit, remove };
}
