//Listo
import { useEffect, useState } from "react";
import {
  fetchClientes,
  createCliente,
  updateCliente,
  deleteCliente,
} from "../data/clientes.js";

export function useClientes() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const list = await fetchClientes();
      console.log("Clientes cargados:", list); 
      setItems(Array.isArray(list) ? list : []);
    } catch (e) {
      console.error("Error en useClientes:", e);
      setError(e.message || "Error al cargar clientes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const add = async (payloadUI) => {
    const created = await createCliente(payloadUI);
    setItems((prev) => [created, ...prev]);
  };

  const edit = async (id, payloadUI) => {
    const updated = await updateCliente(id, payloadUI);
    setItems((prev) => prev.map((c) => (c.id === id ? updated : c)));
  };

  const remove = async (id) => {
    await deleteCliente(id);
    setItems((prev) => prev.filter((c) => c.id !== id));
  };

  return { items, loading, error, reload: load, add, edit, remove };
}
