import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { api } from "../data/api";

export default function PrivateRoute({ permiso, element }) {
  const [allowed, setAllowed] = useState(null);

  useEffect(() => {
    const checkPermiso = async () => {
      try {
        let menu = JSON.parse(localStorage.getItem("menu") || "[]");

        if (!menu.length) {
          const rawUser = localStorage.getItem("user");
          if (!rawUser) return setAllowed(false);

          const user = JSON.parse(rawUser);
          const res = await api(`/menus/usuario/${user.usuario_id}`);
          menu = res.data ?? [];

          localStorage.setItem("menu", JSON.stringify(menu));
        }

        const flatten = (items = []) =>
          items.flatMap((m) => [m, ...(m.children ? flatten(m.children) : [])]);

        const urls = flatten(menu)
          .map((m) => m.url)
          .filter((u) => typeof u === "string" && u.length > 0);

        setAllowed(urls.includes(permiso));

      } catch (e) {
        console.error("PRIVATE ROUTE ERROR:", e);
        setAllowed(false);
      }
    };

    checkPermiso();

  }, [permiso]);

  if (allowed === null)
    return <div className="p-10">Verificando permisos...</div>;

  if (!allowed)
    return <Navigate to="/no-autorizado" replace />;

  return element;
}
