import { useEffect, useState } from "react";
import {
  fetchAvaluos,
  createAvaluo,
  updateAvaluo,
  deleteAvaluo,
} from "../data/avaluos.js";

export function useAvaluos() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      const list = await fetchAvaluos();
      setItems(list);
    } catch (e) {
      setError(e.message || "Error al cargar avalúos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const add = async (payload) => {
    const created = await createAvaluo(payload);
    setItems((prev) => [created, ...prev]);
  };

  const edit = async (id, payload) => {
    const updated = await updateAvaluo(id, payload);
    setItems((prev) => prev.map((p) => (p.id === id ? updated : p)));
  };

  const remove = async (id) => {
    await deleteAvaluo(id);
    setItems((prev) => prev.filter((p) => p.id !== id));
  };

  return { items, loading, error, reload: load, add, edit, remove };
}
