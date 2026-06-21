import { useEffect, useState } from "react";

import {
  fetchCompras,
  createCompra,
  updateCompra,
  deleteCompra,
} from "../data/compras.js";

export function useCompras() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError("");

      const list = await fetchCompras();
      const safeList = Array.isArray(list) ? list : [];

      setItems(safeList);
      return safeList;
    } catch (error) {
      setError(error.message || "Error al cargar compras");
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const add = async (payload) => {
    const created = await createCompra(payload);

    setItems((prev) => [created, ...prev]);

    return created;
  };

  const edit = async (id, payload) => {
    const updated = await updateCompra(id, payload);

    setItems((prev) =>
      prev.map((compra) =>
        Number(compra.id) === Number(id) ? updated : compra
      )
    );

    return updated;
  };

  const remove = async (id) => {
    await deleteCompra(id);

    setItems((prev) =>
      prev.filter((compra) => Number(compra.id) !== Number(id))
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