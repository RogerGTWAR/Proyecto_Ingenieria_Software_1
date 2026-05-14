import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { api } from "../data/api";

export default function PrivateRoute({ permiso, element }) {
  const [allowed, setAllowed] = useState(null); // null = cargando

  useEffect(() => {
    const checkPermiso = async () => {
      try {
        // 1️⃣ Intentar obtener menú del localStorage
        let menu = [];
        const rawMenu = localStorage.getItem("menu");

        if (rawMenu) {
          try {
            menu = JSON.parse(rawMenu) || [];
          } catch {
            menu = [];
          }
        }

        // 2️⃣ Si no hay menú → cargar desde backend
        if (!menu.length) {
          const rawUser = localStorage.getItem("user");
          if (!rawUser) {
            setAllowed(false);
            return;
          }

          const user = JSON.parse(rawUser);

          const res = await api(`/menus/usuario/${user.usuario_id}`);
          menu = Array.isArray(res.data) ? res.data : [];

          localStorage.setItem("menu", JSON.stringify(menu));
        }

        // 3️⃣ Aplanar árbol padre/hijos
        const flatten = (items = []) =>
          items.flatMap((m) => [
            m,
            ...(Array.isArray(m.children) ? flatten(m.children) : []),
          ]);

        const allMenus = flatten(menu);

        // 4️⃣ Revisar permiso por URL
        const hasPermiso = allMenus.some(
          (m) => m.url === permiso || m.menu?.url === permiso
        );

        setAllowed(hasPermiso);
      } catch (e) {
        console.error("❌ Error verificando permiso:", e);
        setAllowed(false);
      }
    };

    checkPermiso();
  }, [permiso]);

  if (allowed === null) {
    return (
      <div className="flex justify-center items-center min-h-screen font-semibold">
        Verificando permisos...
      </div>
    );
  }

  if (!allowed) {
    return <Navigate to="/no-autorizado" replace />;
  }

  return element;
}
