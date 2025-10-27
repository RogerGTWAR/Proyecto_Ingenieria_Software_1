import { useEffect, useState } from "react";
import {
  fetchCategorias,
  createCategoria,
  updateCategoria,
  deleteCategoria,
} from "../data/categorias.js";

export function useCategorias() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const list = await fetchCategorias();
      setItems(list);
    } catch (e) {
      setError(e.message || "Error al cargar categorías");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const add = async (payload) => {
    const created = await createCategoria(payload);
    setItems((prev) => [created, ...prev]);
  };

  const edit = async (id, payload) => {
    const updated = await updateCategoria(id, payload);
    setItems((prev) => prev.map((c) => (c.id === id ? updated : c)));
  };

  const remove = async (id) => {
    await deleteCategoria(id);
    setItems((prev) => prev.filter((c) => c.id !== id));
  };

  return { items, loading, error, reload: load, add, edit, remove };
}
