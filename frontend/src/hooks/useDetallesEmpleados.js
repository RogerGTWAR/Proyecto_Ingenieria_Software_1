import { useEffect, useState } from "react";
import {
  fetchDetallesEmpleados,
  createDetalleEmpleado,
  updateDetalleEmpleado,
  deleteDetalleEmpleado,
} from "../data/detallesEmpleados.js";

export function useDetallesEmpleados() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError("");

      const list = await fetchDetallesEmpleados();
      setItems(list);

      return list;
    } catch (e) {
      console.error("Error al cargar detalles de empleados:", e);
      setError(e.message);
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
      empleado_id: payload.empleado_id ?? payload.empleadoId,
      proyecto_id: payload.proyecto_id ?? payload.proyectoId,
      fecha_de_proyecto:
        payload.fecha_de_proyecto ??
        payload.fechaProyecto ??
        new Date().toISOString().split("T")[0],
    };

    const existente = items.find(
      (d) =>
        Number(d.empleadoId) === Number(body.empleado_id) &&
        Number(d.proyectoId) === Number(body.proyecto_id)
    );

    if (existente) {
      const updated = await updateDetalleEmpleado(existente.id, body);

      setItems((prev) =>
        prev.map((d) => (Number(d.id) === Number(existente.id) ? updated : d))
      );

      return updated;
    }

    const created = await createDetalleEmpleado(body);

    setItems((prev) => [created, ...prev]);

    return created;
  };

  const edit = async (id, payload) => {
    const updated = await updateDetalleEmpleado(id, payload);

    setItems((prev) =>
      prev.map((d) => (Number(d.id) === Number(id) ? updated : d))
    );

    return updated;
  };

  const remove = async (id) => {
    await deleteDetalleEmpleado(id);

    setItems((prev) => prev.filter((d) => Number(d.id) !== Number(id)));
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