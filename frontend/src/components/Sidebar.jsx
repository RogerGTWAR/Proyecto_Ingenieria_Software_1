import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const [openRegistro, setOpenRegistro] = useState(false);
  const [permisos, setPermisos] = useState([]);

  const loadPermisos = () => {
    try {
      const raw = localStorage.getItem("menu");
      if (!raw) {
        setPermisos([]);
        return;
      }

      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        setPermisos([]);
        return;
      }

      const flatten = (items = []) =>
        items.flatMap((m) => [m, ...(m.children ? flatten(m.children) : [])]);

      const flat = flatten(parsed);

      const urls = flat
        .map((x) => x.url || x.menu?.url || x.path || null)
        .filter((u) => typeof u === "string" && u.trim() !== "");

      console.log("PERMISOS ACTIVOS:", urls);
      setPermisos(urls);
    } catch (e) {
      console.error("Error cargando permisos:", e);
      setPermisos([]);
    }
  };

  useEffect(() => {
    loadPermisos();
    const listener = () => loadPermisos();
    window.addEventListener("storage", listener);
    return () => window.removeEventListener("storage", listener);
  }, []);


  const tienePermiso = (url) => {
    if (!url) return false;
    return permisos.includes(url);
  };

  const navigationItems = [
    { id: "dashboard", link: "/", label: "Dashboard", icon: "icons/dashboard.svg" },
    { id: "proyectos", link: "/proyectos", label: "Proyectos", icon: "icons/projects.svg" },
    { id: "vehiculos", link: "/vehiculos", label: "Vehículos", icon: "icons/car.svg" },
    { id: "compras", link: "/compras", label: "Compras", icon: "icons/buy.svg" },
    { id: "inventario", link: "/materiales", label: "Inventario", icon: "icons/inventory.svg" },
    { id: "avaluos", link: "/avaluos", label: "Avalúos", icon: "icons/avaluos.svg" },
    { id: "servicios", link: "/servicios", label: "Servicios", icon: "icons/tool.svg" },
    { id: "menus", link: "/menus", label: "Menús", icon: "icons/menu.svg" },
  ];

  const registroItems = [
    { id: "empleados", link: "/empleados", label: "Empleados", icon: "icons/employee.svg" },
    { id: "clientes", link: "/clientes", label: "Clientes", icon: "icons/clients.svg" },
    { id: "proveedores", link: "/proveedores", label: "Proveedores", icon: "icons/suppliers.svg" },
    { id: "permisos", link: "/permisos", label: "Permisos", icon: "icons/permisos.svg" },
    { id: "reportes", link: "/reportes", label: "Reportes", icon: "icons/suppliers.svg" },
    { id: "usuarios", link: "/usuarios", label: "Usuarios", icon: "icons/user.svg" },
  ];

  const registroFiltrado = registroItems.filter((r) =>
    tienePermiso(r.link)
  );

  return (
    <>
      <div
        className="hidden lg:flex lg:flex-col lg:w-52 lg:fixed lg:left-0 lg:top-0 lg:h-screen lg:z-50"
        style={{ backgroundColor: "#1A2E81" }}
      >
        <div className="px-3 py-8 flex items-center gap-3">
          <img src="/Logo.jpg" className="w-14 h-14 rounded-md" alt="" />
          <div className="flex flex-col text-white">
            <span className="text-sm">Asesoría &</span>
            <span className="text-sm font-semibold">Construcción S.A.</span>
          </div>
        </div>

        <nav className="flex-1 px-1 pt-4">
          <ul className="space-y-1">

            {registroFiltrado.length > 0 && (
              <li>
                <button
                  onClick={() => setOpenRegistro(!openRegistro)}
                  className="flex items-center gap-3 w-full px-3 py-3 text-white hover:bg-[#253C9C]"
                >
                  <img className="size-5 filter invert brightness-0" src="icons/menu.svg" />
                  <span>Registro</span>
                  <span className="ml-auto">{openRegistro ? "❯" : ""}</span>
                </button>

                {openRegistro && (
                  <ul className="ml-8 mt-1 space-y-1">
                    {registroFiltrado.map((sub) => (
                      <li key={sub.id}>
                        <Link
                          to={sub.link}
                          className={`flex items-center gap-3 px-3 py-2 text-white ${
                            location.pathname === sub.link ? "bg-[#253C9C]" : "hover:bg-[#253C9C]"
                          }`}
                        >
                          <img className="size-4 filter invert brightness-0" src={sub.icon} />
                          {sub.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            )}

            {navigationItems
              .filter((i) => tienePermiso(i.link))
              .map((item) => (
                <li key={item.id}>
                  <Link
                    to={item.link}
                    className={`flex items-center gap-3 px-3 py-3 text-white ${
                      location.pathname === item.link ? "bg-[#253C9C]" : "hover:bg-[#253C9C]"
                    }`}
                  >
                    <img className="size-5 filter invert brightness-0" src={item.icon} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
          </ul>
        </nav>
      </div>

      <div
        className="lg:hidden fixed bottom-0 left-0 right-0 shadow-lg z-50"
        style={{ backgroundColor: "#1A2E81" }}
      >
        <div className="flex justify-around items-center">
          {navigationItems
            .filter((i) => tienePermiso(i.link))
            .map((item) => (
              <Link key={item.id} to={item.link} className="py-4 flex-1 text-center">
                <img className="size-6 filter invert brightness-0 mx-auto" src={item.icon} />
              </Link>
            ))}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
