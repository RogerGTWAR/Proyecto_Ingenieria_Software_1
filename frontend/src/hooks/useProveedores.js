import { useEffect, useState } from "react";
import {
  fetchProveedores,
  createProveedor,
  updateProveedor,
  deleteProveedor,
} from "../data/proveedores.js";

export function useProveedores() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const list = await fetchProveedores();
      setItems(list);
    } catch (e) {
      setError(e.message || "Error al cargar proveedores");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const add = async (payloadUI) => {
    const created = await createProveedor(payloadUI);
    setItems((prev) => [created, ...prev]);
  };

  const edit = async (id, payloadUI) => {
    const updated = await updateProveedor(id, payloadUI);
    setItems((prev) => prev.map((p) => (p.id === id ? updated : p)));
  };

  const remove = async (id) => {
    await deleteProveedor(id);
    setItems((prev) => prev.filter((p) => p.id !== id));
  };

  return { items, loading, error, reload: load, add, edit, remove };
}
