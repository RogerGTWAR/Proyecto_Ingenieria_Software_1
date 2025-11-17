import { useEffect, useState } from "react";

import {
  fetchCostosDirectos,        
  createCostoDirecto,        
  updateCostoDirecto,      
  deleteCostoDirecto,       
} from "../data/costosDirectos.js";

export function useCostosDirectos() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      const list = await fetchCostosDirectos();
      setItems(list);
      return list;
    } catch (e) {
      console.error("Error al cargar costos directos:", e);
      setError(e.message || "Error al cargar costos directos");
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
      material_id: payload.material_id ?? payload.materialId,
      cantidad_material:
        payload.cantidad_material ?? payload.cantidadMaterial ?? 0,
      unidad_de_medida:
        payload.unidad_de_medida ?? payload.unidadDeMedida ?? "",
      precio_unitario:
        payload.precio_unitario ?? payload.precioUnitario ?? 0,
    };

    const created = await createCostoDirecto(body);
    setItems((prev) => [created, ...prev]);
    return created;
  };

  const edit = async (id, payload) => {
    const updated = await updateCostoDirecto(id, payload);
    setItems((prev) => prev.map((d) => (d.id === id ? updated : d)));
    return updated;
  };

  const remove = async (id) => {
    await deleteCostoDirecto(id);
    setItems((prev) => prev.filter((d) => d.id !== id));
  };

  return { items, loading, error, reload: load, add, edit, remove };
}
