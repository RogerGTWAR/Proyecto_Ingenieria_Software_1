import { useEffect, useState } from "react";

import {
  fetchCostosIndirectos,       
  createCostoIndirecto,       
  updateCostoIndirecto,        
  deleteCostoIndirecto,        
} from "../data/costosIndirectos.js";

export function useCostosIndirectos() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      const list = await fetchCostosIndirectos();
      setItems(list);
      return list;
    } catch (e) {
      console.error("Error al cargar costos indirectos:", e);
      setError(e.message || "Error al cargar costos indirectos");
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const add = async (payload) => {
    const body = {
      servicio_id: payload.servicio_id ?? payload.servicioId,
      costo_directo_id:
        payload.costo_directo_id ?? payload.costoDirectoId,
      total_costo_directo:
        payload.total_costo_directo ?? payload.totalCostoDirecto ?? 0,
    };

    const created = await createCostoIndirecto(body);
    setItems((prev) => [created, ...prev]);
    return created;
  };

  const edit = async (id, payload) => {
    const updated = await updateCostoIndirecto(id, payload);
    setItems((prev) => prev.map((c) => (c.id === id ? updated : c)));
    return updated;
  };

  const remove = async (id) => {
    await deleteCostoIndirecto(id);
    setItems((prev) => prev.filter((c) => c.id !== id));
  };

  return { items, loading, error, reload: load, add, edit, remove };
}
