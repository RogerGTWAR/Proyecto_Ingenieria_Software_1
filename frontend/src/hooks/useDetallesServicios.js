import { useEffect, useState } from "react";

import {
  fetchDetallesServicios,
  createDetalleServicio,
  updateDetalleServicio,
  deleteDetalleServicio,
} from "../data/detallesServicios.js";

export function useDetallesServicios() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      const list = await fetchDetallesServicios();
      setItems(list);
      return list;
    } catch (err) {
      console.error("Error al cargar detalles servicios:", err);
      setError(err.message);
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
      descripcion: payload.descripcion ?? "",
      cantidad: payload.cantidad,
      unidad_de_medida: payload.unidad_de_medida,
      precio_unitario: payload.precio_unitario,
    };

    const existente = items.find(
      (d) =>
        Number(d.servicioId) === Number(body.servicio_id) &&
        Number(d.materialId) === Number(body.material_id)
    );

    if (existente) {
      const updated = await updateDetalleServicio(existente.id, body);
      setItems((prev) =>
        prev.map((d) => (d.id === existente.id ? updated : d))
      );
      return updated;
    }

    const created = await createDetalleServicio(body);
    setItems((prev) => [created, ...prev]);
    return created;
  };

  const edit = async (id, payload) => {
    const updated = await updateDetalleServicio(id, payload);
    setItems((prev) => prev.map((d) => (d.id === id ? updated : d)));
    return updated;
  };

  const remove = async (id) => {
    await deleteDetalleServicio(id);
    setItems((prev) => prev.filter((d) => d.id !== id));
  };

  return { items, loading, error, reload: load, add, edit, remove };
}
