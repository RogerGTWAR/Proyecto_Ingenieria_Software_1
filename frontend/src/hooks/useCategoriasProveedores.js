import { useEffect, useState } from "react";
import {
  fetchCategoriasProveedor,
  createCategoriaProveedor,
  updateCategoriaProveedor,
  deleteCategoriaProveedor,
} from "../data/categoriasProveedores.js";

export function useCategoriasProveedor() {
  const [items, setItems] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const list = await fetchCategoriasProveedor();
      setItems(list);
    } catch (e) {
      setError(e.message || "Error al cargar categorías de proveedor");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const add = async (payloadUI) => {
    const created = await createCategoriaProveedor(payloadUI);
    setItems((prev) => [created, ...prev]);
  };

  const edit = async (id, payloadUI) => {
    const updated = await updateCategoriaProveedor(id, payloadUI);
    setItems((prev) => prev.map((c) => (c.id === id ? updated : c)));
  };

  const remove = async (id) => {
    await deleteCategoriaProveedor(id);
    setItems((prev) => prev.filter((c) => c.id !== id));
  };

  return { items, loading, error, reload: load, add, edit, remove };
}
