import { useEffect, useState } from "react";
import { fetchServicios, createServicio, updateServicio, deleteServicio } from "../data/servicios.js";

export function useServicios() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      const list = await fetchServicios();
      setItems(list);
      return list;
    } catch (err) {
      setError(err.message);
      return [];
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
    return created;
  };

  const edit = async (id, payload) => {
    const updated = await updateServicio(id, payload);
    setItems((prev) => prev.map((s) => (s.id === id ? updated : s)));
    return updated;
  };

  const remove = async (id) => {
    await deleteServicio(id);
    setItems((prev) => prev.filter((s) => s.id !== id));
  };

  return { items, loading, error, reload: load, add, edit, remove };
}
