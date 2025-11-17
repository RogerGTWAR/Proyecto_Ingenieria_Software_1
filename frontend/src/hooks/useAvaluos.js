// hooks/useAvaluos.js
import { useEffect, useState } from "react";

import {
  fetchAvaluos,
  createAvaluo,
  updateAvaluo,
  deleteAvaluo,
} from "../data/avaluos.js";

export function useAvaluos() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // -------------------------------------------------------------
  // LOAD
  // -------------------------------------------------------------
  const load = async () => {
    try {
      setLoading(true);
      const list = await fetchAvaluos();
      setItems(list);
      return list;
    } catch (e) {
      console.error("Error al cargar avaluos:", e);
      setError(e.message || "Error al cargar avaluos");
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // -------------------------------------------------------------
  // CREATE
  // -------------------------------------------------------------
  const add = async (payload) => {

    const created = await createAvaluo({
      proyectoId: payload.proyectoId,
      descripcion: payload.descripcion,
      fechaInicio: payload.fechaInicio,
      fechaFin: payload.fechaFin,
    });

    setItems((prev) => [created, ...prev]);
    return created;
  };

  // -------------------------------------------------------------
  // UPDATE
  // -------------------------------------------------------------
  const edit = async (id, payload) => {
    const updated = await updateAvaluo(id, payload);

    setItems((prev) =>
      prev.map((a) => (a.id === id ? updated : a))
    );

    return updated;
  };

  // -------------------------------------------------------------
  // DELETE
  // -------------------------------------------------------------
  const remove = async (id) => {
    await deleteAvaluo(id);
    setItems((prev) => prev.filter((a) => a.id !== id));
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
