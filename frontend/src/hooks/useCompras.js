import { useState, useEffect } from "react";
import {
  fetchCompras,
  createCompra,
  updateCompra,
  deleteCompra,
} from "../data/compras.js";

export function useCompras() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      const list = await fetchCompras();
      setItems(list);
      return list;
    } catch (e) {
      console.error("Error al cargar compras:", e);
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
    const created = await createCompra(payload);
    setItems((prev) => [created, ...prev]);
    return created;
  };

  const edit = async (id, payload) => {
    const updated = await updateCompra(id, payload);
    setItems((prev) => prev.map((c) => (c.id === id ? updated : c)));
    return updated;
  };

  const remove = async (id) => {
    await deleteCompra(id);
    setItems((prev) => prev.filter((c) => c.id !== id));
  };

  return { items, loading, error, reload: load, add, edit, remove };
}
