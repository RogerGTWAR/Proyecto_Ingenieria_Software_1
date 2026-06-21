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
      const safeList = Array.isArray(list) ? list : [];

      setItems(safeList);
      return safeList;
    } catch (error) {
      setError(error.message || "Error al cargar materiales");
      return [];
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

    return created;
  };

  const edit = async (id, payload) => {
    const updated = await updateMaterial(id, payload);

    setItems((prev) =>
      prev.map((material) =>
        Number(material.id) === Number(id) ? updated : material
      )
    );

    return updated;
  };

  const remove = async (id) => {
    await deleteMaterial(id);

    setItems((prev) =>
      prev.filter((material) => Number(material.id) !== Number(id))
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