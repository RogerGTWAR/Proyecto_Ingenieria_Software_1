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
      console.log("✔ Menús cargados:", list);

      setItems(Array.isArray(list) ? list : []);

    } catch (e) {
      console.error("❌ Error en useMenus:", e);
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
  };

  const edit = async (id, payloadUI) => {
    const updated = await updateMenu(id, payloadUI);
    setItems((prev) => prev.map((m) => (m.id === id ? updated : m)));
  };

  const remove = async (id) => {
    await deleteMenu(id);
    setItems((prev) => prev.filter((m) => m.id !== id));
  };

  return { items, loading, error, reload: load, add, edit, remove };
}
