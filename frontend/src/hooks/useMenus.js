import { useEffect, useState } from "react";
import {
  fetchMenus,
  createMenu,
  updateMenu,
  deleteMenu,
} from "../data/menus.js";

export function useMenus() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError("");

      const list = await fetchMenus();

      setItems(Array.isArray(list) ? list : []);
    } catch (e) {
      setError(e.message || "Error al cargar menús");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const add = async (payloadUI) => {
    const created = await createMenu(payloadUI);
    setItems((prev) => [created, ...prev]);
    return created;
  };

  const edit = async (id, payloadUI) => {
    const updated = await updateMenu(id, payloadUI);
    setItems((prev) => prev.map((m) => (Number(m.id) === Number(id) ? updated : m)));
    return updated;
  };

  const remove = async (id) => {
    await deleteMenu(id);
    setItems((prev) => prev.filter((m) => Number(m.id) !== Number(id)));
    return true;
  };

  return { items, loading, error, reload: load, add, edit, remove };
}