import { useEffect, useState } from "react";
import {
  fetchDetallesCompras,
  createDetalleCompra,
  updateDetalleCompra,
  deleteDetalleCompra,
} from "../data/detallesCompras.js";

export function useDetallesCompras() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      const list = await fetchDetallesCompras();
      setItems(list);
      return list;
    } catch (e) {
      console.error("Error al cargar detalles compras:", e);
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
    await createDetalleCompra(payload);
    return await load();
  };

  const edit = async (id, payload) => {
    await updateDetalleCompra(id, payload);
    return await load();
  };

  const remove = async (id) => {
    await deleteDetalleCompra(id);
    return await load();
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
