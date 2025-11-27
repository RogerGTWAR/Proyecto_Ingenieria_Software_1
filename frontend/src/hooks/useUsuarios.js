import { useEffect, useState } from "react";
import {
  getUsuariosRequest,
  getUsuarioRequest,
  createUsuarioRequest,
  updateUsuarioRequest,
  deleteUsuarioRequest,
} from "../data/usuarios.js";

export function useUsuarios() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getUsuariosRequest();
      setItems(data);
    } catch (error) {
      console.error("Error cargando usuarios:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const add = async (data) => {
    try {
      const nuevo = await createUsuarioRequest(data);
      if (nuevo) setItems((prev) => [nuevo, ...prev]);
      return nuevo;
    } catch (error) {
      console.error("Error al crear usuario:", error);
      return null;
    }
  };

  const edit = async (id, data) => {
    try {
      const actualizado = await updateUsuarioRequest(id, data);
      if (actualizado) {
        setItems((prev) =>
          prev.map((u) =>
            u.usuario_id === id ? actualizado : u
          )
        );
      }
      return actualizado;
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      return null;
    }
  };

  const remove = async (id) => {
    try {
      const ok = await deleteUsuarioRequest(id);
      if (ok) {
        setItems((prev) => prev.filter((u) => u.usuario_id !== id));
      }
      return ok;
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      return false;
    }
  };

  return {
    items,
    loading,
    add,
    edit,
    remove,
    reload: load,
  };
}
