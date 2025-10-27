// Listo
import { useEffect, useState } from "react";
import {
  fetchEmpleados,
  createEmpleado,
  updateEmpleado,
  deleteEmpleado,
} from "../data/empleados.js";

export function useEmpleados() {
  const [items, setItems] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const list = await fetchEmpleados();
      setItems(list);
    } catch (e) {
      setError(e.message || "Error al cargar empleados");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const add = async (payloadUI) => {
    const created = await createEmpleado(payloadUI);
    setItems((prev) => [created, ...prev]);
  };

  const edit = async (id, payloadUI) => {
    const updated = await updateEmpleado(id, payloadUI);
    setItems((prev) => prev.map((e) => (e.id === id ? updated : e)));
  };

  const remove = async (id) => {
    await deleteEmpleado(id);
    setItems((prev) => prev.filter((e) => e.id !== id));
  };

  return { items, loading, error, reload: load, add, edit, remove };
}
