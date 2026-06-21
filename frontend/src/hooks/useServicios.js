import { useEffect, useState } from "react";

import {
  fetchServicios,
  createServicio,
  updateServicio,
  deleteServicio,
} from "../data/servicios.js";

export function useServicios() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError("");

      const list = await fetchServicios();
      const safeList = Array.isArray(list) ? list : [];

      setItems(safeList);
      return safeList;
    } catch (error) {
      setError(error.message || "Error al cargar servicios");
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

    setItems((prev) =>
      prev.map((servicio) =>
        servicio.id === id ? updated : servicio
      )
    );

    return updated;
  };

  const remove = async (id) => {
    await deleteServicio(id);

    setItems((prev) =>
      prev.filter((servicio) => servicio.id !== id)
    );

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