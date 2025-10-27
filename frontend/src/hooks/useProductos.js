import { useEffect, useState } from "react";
import {
  fetchProductos,
  createProducto,
  updateProducto,
  deleteProducto,
} from "../data/productos.js";

export function useProductos() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const list = await fetchProductos();
      setItems(list);
    } catch (e) {
      setError(e.message || "Error al cargar productos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const add = async (payload) => {
    const created = await createProducto(payload);
    setItems((prev) => [created, ...prev]);
  };

  const edit = async (id, payload) => {
    const updated = await updateProducto(id, payload);
    setItems((prev) => prev.map((p) => (p.id === id ? updated : p)));
  };

  const remove = async (id) => {
    await deleteProducto(id);
    setItems((prev) => prev.filter((p) => p.id !== id));
  };

  return { items, loading, error, reload: load, add, edit, remove };
}
