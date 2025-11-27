import { useCallback, useEffect, useState } from "react";
import { fetchRoles, createRole, updateRole, deleteRole } from "../data/roles.js";

export default function useRoles() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetchRoles();
      setItems(res ?? []);
    } catch (e) {
      setError(e.message || "Error al cargar roles");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const add = async (dto) => {
    const res = await createRole(dto);
    await load();
    return res;
  };

  const edit = async (id, dto) => {
    const res = await updateRole(id, dto);
    await load();
    return res;
  };

  const remove = async (id) => {
    const res = await deleteRole(id);
    await load();
    return res;
  };

  return { items, loading, error, reload: load, add, edit, remove };
}
