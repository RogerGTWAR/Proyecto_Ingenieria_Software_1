// hooks/useDetallesAvaluos.js
import { useEffect, useState } from "react";

import {
  fetchDetallesAvaluos,
  createDetalleAvaluo,
  updateDetalleAvaluo,
  deleteDetalleAvaluo,
} from "../data/detallesAvaluos.js";

export function useDetallesAvaluos() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      const list = await fetchDetallesAvaluos();
      setItems(list);
      return list;
    } catch (e) {
      console.error("Error al cargar detalles avaluos:", e);
      setError(e.message || "Error al cargar los detalles del avalúo");
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // CREATE
  const add = async (payload) => {
    const created = await createDetalleAvaluo({
      avaluoId: payload.avaluo_id ?? payload.avaluoId,
      servicioId: payload.servicio_id ?? payload.servicioId,
      actividad: payload.actividad,
      unidadMedida: payload.unidadMedida, // <-- CORREGIDO
      cantidad: Number(payload.cantidad > 0 ? payload.cantidad : 1), // <-- CORREGIDO
    });

    setItems((prev) => [created, ...prev]);
    return created;
  };

  // UPDATE
  const edit = async (id, payload) => {
    const updated = await updateDetalleAvaluo(id, payload);

    setItems((prev) =>
      prev.map((d) => (d.id === id ? updated : d))
    );

    return updated;
  };

  // DELETE
  const remove = async (id) => {
    await deleteDetalleAvaluo(id);
    setItems((prev) => prev.filter((d) => d.id !== id));
  };

  return { items, loading, error, reload: load, add, edit, remove };
}
