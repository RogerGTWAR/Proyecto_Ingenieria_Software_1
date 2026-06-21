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
      const safeList = Array.isArray(list) ? list : [];

      setItems(safeList);
      return safeList;
    } catch (error) {
      setError(error.message || "Error al cargar empleados");
      return [];
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

    return created;
  };

  const edit = async (id, payloadUI) => {
    const updated = await updateEmpleado(id, payloadUI);

    setItems((prev) =>
      prev.map((empleado) => (empleado.id === id ? updated : empleado))
    );

    return updated;
  };

  const remove = async (id) => {
    await deleteEmpleado(id);

    setItems((prev) => prev.filter((empleado) => empleado.id !== id));

    return true;
  };

  return {
    items,
    loading,
    error,
    reload: load,
    add,
    edit,
    remove,
  };
}