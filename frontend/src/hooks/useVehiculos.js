import { useEffect, useState } from "react";
import {
  fetchVehiculos,
  createVehiculo,
  updateVehiculo,
  deleteVehiculo,
} from "../data/vehiculos.js";

export function useVehiculos() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      const list = await fetchVehiculos();
      setItems(list);
      return list;
    } catch (e) {
      console.error("Error al cargar vehículos:", e);
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
    const created = await createVehiculo(payload);
    setItems((prev) => [created, ...prev]);
    return created;
  };

  const edit = async (id, payload) => {
    const updated = await updateVehiculo(id, payload);
    setItems((prev) => prev.map((v) => (v.id === id ? updated : v)));
    return updated;
  };

  const remove = async (id) => {
    await deleteVehiculo(id);
    setItems((prev) => prev.filter((v) => v.id !== id));
  };

  return { items, loading, error, reload: load, add, edit, remove };
}
