import { useEffect, useState } from "react";
import {
  fetchDetallesVehiculos,
  createDetalleVehiculo,
  updateDetalleVehiculo,
  deleteDetalleVehiculo,
} from "../data/detalleVehiculos.js";

export function useDetallesVehiculos() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      const list = await fetchDetallesVehiculos();
      setItems(list);
      return list;
    } catch (e) {
      console.error("Error al cargar detalles de vehículos:", e);
      setError(e.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // 🟢 Agregar o actualizar una asignación
  const add = async (payload) => {
    const body = {
      vehiculo_id: payload.vehiculo_id ?? payload.vehiculoId,
      empleado_id: payload.empleado_id ?? payload.empleadoId,
      fecha_asignacion:
        payload.fecha_asignacion ?? payload.fechaAsignacion ?? new Date().toISOString(),
      fecha_fin_asignacion:
        payload.fecha_fin_asignacion ?? payload.fechaFinAsignacion ?? null,
      descripcion: payload.descripcion ?? "Asignación inicial",
    };

    // Evitar duplicados
    const existente = items.find(
      (d) =>
        Number(d.vehiculoId) === Number(body.vehiculo_id) &&
        Number(d.empleadoId) === Number(body.empleado_id)
    );

    if (existente) {
      console.log("🔄 Actualizando detalle existente:", existente.id);
      const updated = await updateDetalleVehiculo(existente.id, body);
      setItems((prev) =>
        prev.map((d) => (d.id === existente.id ? updated : d))
      );
      return updated;
    }

    console.log("🆕 Creando nuevo detalle de vehículo:", body);
    const created = await createDetalleVehiculo(body);
    setItems((prev) => [created, ...prev]);
    return created;
  };

  const edit = async (id, payload) => {
    const updated = await updateDetalleVehiculo(id, payload);
    setItems((prev) => prev.map((d) => (d.id === id ? updated : d)));
    return updated;
  };

  const remove = async (id) => {
    await deleteDetalleVehiculo(id);
    setItems((prev) => prev.filter((d) => d.id !== id));
  };

  return { items, loading, error, reload: load, add, edit, remove };
}
