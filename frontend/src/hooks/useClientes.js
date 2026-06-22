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
      const safeList = Array.isArray(list) ? list : [];

      setItems(safeList);
      return safeList;
    } catch (error) {
      setError(error.message || "Error al cargar clientes");
      return [];
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
    return created;
  };

  const edit = async (id, payloadUI) => {
    const updated = await updateCliente(id, payloadUI);

    setItems((prev) =>
      prev.map((cliente) => (cliente.id === id ? updated : cliente))
    );

    return updated;
  };

  const remove = async (id) => {
    await deleteCliente(id);

    setItems((prev) => prev.filter((cliente) => cliente.id !== id));

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