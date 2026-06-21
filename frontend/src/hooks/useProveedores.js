import { useEffect, useState } from "react";

import {
  fetchProveedores,
  createProveedor,
  updateProveedor,
  deleteProveedor,
} from "../data/proveedores.js";

export function useProveedores() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError("");

      const list = await fetchProveedores();
      const safeList = Array.isArray(list) ? list : [];

      setItems(safeList);
      return safeList;
    } catch (error) {
      setError(error.message || "Error al cargar proveedores");
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const add = async (payloadUI) => {
    const created = await createProveedor(payloadUI);

    setItems((prev) => [created, ...prev]);

    return created;
  };

  const edit = async (id, payloadUI) => {
    const updated = await updateProveedor(id, payloadUI);

    setItems((prev) =>
      prev.map((proveedor) =>
        proveedor.id === id ? updated : proveedor
      )
    );

    return updated;
  };

  const remove = async (id) => {
    await deleteProveedor(id);

    setItems((prev) =>
      prev.filter((proveedor) => proveedor.id !== id)
    );

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