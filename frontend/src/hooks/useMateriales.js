import { useEffect, useState } from "react";
import {
  fetchMateriales,
  createMaterial,
  updateMaterial,
  deleteMaterial,
} from "../data/materiales.js";

export function useMateriales() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const list = await fetchMateriales();
      setItems(list);
    } catch (e) {
      setError(e.message || "Error al cargar materiales");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const add = async (payload) => {
    const created = await createMaterial(payload);
    setItems((prev) => [created, ...prev]);
  };

  const edit = async (id, payload) => {
    const updated = await updateMaterial(id, payload);
    setItems((prev) => prev.map((m) => (m.id === id ? updated : m)));
  };

  const remove = async (id) => {
    await deleteMaterial(id);
    setItems((prev) => prev.filter((m) => m.id !== id));
  };

  return { items, loading, error, reload: load, add, edit, remove };
}
