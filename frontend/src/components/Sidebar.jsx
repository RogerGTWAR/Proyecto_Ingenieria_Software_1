import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  const [openAdministracion, setOpenAdministracion] = useState(false);
  const [openClientesProyectos, setOpenClientesProyectos] = useState(false);
  const [openInventarioCompras, setOpenInventarioCompras] = useState(false);
  const [openSistema, setOpenSistema] = useState(false);

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

  const administracionItems = [
    {
      id: "empleados",
      link: "/empleados",
      label: "Empleados",
      icon: "icons/employee.svg",
    },
    {
      id: "usuarios",
      link: "/usuarios",
      label: "Usuarios",
      icon: "icons/user.svg",
    },
    {
      id: "permisos",
      link: "/permisos",
      label: "Permisos",
      icon: "icons/permisos.svg",
    },
  ];

  const clientesProyectosItems = [
    {
      id: "clientes",
      link: "/clientes",
      label: "Clientes",
      icon: "icons/clients.svg",
    },
    {
      id: "proyectos",
      link: "/proyectos",
      label: "Proyectos",
      icon: "icons/projects.svg",
    },
    {
      id: "avaluos",
      link: "/avaluos",
      label: "Avalúos",
      icon: "icons/avaluos.svg",
    },
    {
      id: "servicios",
      link: "/servicios",
      label: "Servicios",
      icon: "icons/tool.svg",
    },
  ];

  const inventarioComprasItems = [
    {
      id: "proveedores",
      link: "/proveedores",
      label: "Proveedores",
      icon: "icons/suppliers.svg",
    },
    {
      id: "compras",
      link: "/compras",
      label: "Compras",
      icon: "icons/buy.svg",
    },
    {
      id: "inventario",
      link: "/materiales",
      label: "Inventario",
      icon: "icons/inventory.svg",
    },
    {
      id: "vehiculos",
      link: "/vehiculos",
      label: "Vehículos",
      icon: "icons/car.svg",
    },
  ];

  const sistemaItems = [
    {
      id: "dashboard",
      link: "/",
      label: "Dashboard",
      icon: "icons/dashboard.svg",
    },
    {
      id: "menus",
      link: "/menus",
      label: "Menús",
      icon: "icons/menu.svg",
    },
    {
      id: "reportes",
      link: "/reportes",
      label: "Reportes",
      icon: "icons/suppliers.svg",
    },
  ];

  const filtrarPorPermiso = (items) => {
    return items.filter((item) => tienePermiso(item.link));
  };

  const administracionFiltrado = filtrarPorPermiso(administracionItems);
  const clientesProyectosFiltrado = filtrarPorPermiso(clientesProyectosItems);
  const inventarioComprasFiltrado = filtrarPorPermiso(inventarioComprasItems);
  const sistemaFiltrado = filtrarPorPermiso(sistemaItems);

  const renderGrupo = (titulo, icono, abierto, cambiarEstado, items) => {
    if (items.length === 0) return null;

    return (
      <li>
        <button
          onClick={() => cambiarEstado(!abierto)}
          className="flex items-center gap-3 w-full px-3 py-3 text-white hover:bg-[#253C9C] rounded-md"
        >
          <img
            className="size-5 filter invert brightness-0"
            src={icono}
            alt=""
          />

          <span className="text-sm">{titulo}</span>

          <span className="ml-auto text-xs">
            {abierto ? "⌃" : "⌄"}
          </span>
        </button>

        {abierto && (
          <ul className="ml-6 mt-1 space-y-1">
            {items.map((sub) => (
              <li key={sub.id}>
                <Link
                  to={sub.link}
                  className={`flex items-center gap-3 px-3 py-2 text-white rounded-md text-sm ${
                    location.pathname === sub.link
                      ? "bg-[#253C9C]"
                      : "hover:bg-[#253C9C]"
                  }`}
                >
                  <img
                    className="size-4 filter invert brightness-0"
                    src={sub.icon}
                    alt=""
                  />

                  <span>{sub.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </li>
    );
  };

  const mobileItems = [
    ...clientesProyectosFiltrado,
    ...inventarioComprasFiltrado,
    ...sistemaFiltrado,
  ];

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

        <nav className="flex-1 px-1 pt-4 overflow-y-auto">
          <ul className="space-y-1">
            {renderGrupo(
              "Administración",
              "icons/menu.svg",
              openAdministracion,
              setOpenAdministracion,
              administracionFiltrado
            )}

            {renderGrupo(
              "Clientes y Proyectos",
              "icons/projects.svg",
              openClientesProyectos,
              setOpenClientesProyectos,
              clientesProyectosFiltrado
            )}

            {renderGrupo(
              "Inventario y Compras",
              "icons/inventory.svg",
              openInventarioCompras,
              setOpenInventarioCompras,
              inventarioComprasFiltrado
            )}

            {renderGrupo(
              "Sistema",
              "icons/dashboard.svg",
              openSistema,
              setOpenSistema,
              sistemaFiltrado
            )}
          </ul>
        </nav>
      </div>

      <div
        className="lg:hidden fixed bottom-0 left-0 right-0 shadow-lg z-50"
        style={{ backgroundColor: "#1A2E81" }}
      >
        <div className="flex justify-around items-center">
          {mobileItems.slice(0, 5).map((item) => (
            <Link
              key={item.id}
              to={item.link}
              className="py-4 flex-1 text-center"
            >
              <img
                className="size-6 filter invert brightness-0 mx-auto"
                src={item.icon}
                alt=""
              />
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default Sidebar;