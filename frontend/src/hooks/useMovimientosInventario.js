import { useEffect, useState } from "react";

import {
  fetchMovimientosInventario,
  fetchMovimientosPorMaterial,
  registrarEntradaInventario,
  registrarSalidaInventario,
  registrarAjusteInventario,
  deleteMovimientoInventario,
} from "../data/movimientosInventario.js";

export function useMovimientosInventario(materialId = null) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError("");

      const list = materialId
        ? await fetchMovimientosPorMaterial(materialId)
        : await fetchMovimientosInventario();

      const safeList = Array.isArray(list) ? list : [];

      setItems(safeList);

      return safeList;
    } catch (error) {
      setError(error.message || "Error al cargar movimientos de inventario");
      setItems([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [materialId]);

  const entrada = async (payload) => {
    const result = await registrarEntradaInventario(payload);
    await load();
    return result;
  };

  const salida = async (payload) => {
    const result = await registrarSalidaInventario(payload);
    await load();
    return result;
  };

  const ajuste = async (payload) => {
    const result = await registrarAjusteInventario(payload);
    await load();
    return result;
  };

  const remove = async (id) => {
    await deleteMovimientoInventario(id);
    await load();
    return true;
  };

  return {
    items,
    loading,
    error,
    reload: load,
    entrada,
    salida,
    ajuste,
    remove,
  };
}