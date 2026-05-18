import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  const [openSistema, setOpenSistema] = useState(false);
  const [openProyectos, setOpenProyectos] = useState(false);
  const [openInventario, setOpenInventario] = useState(false);
  const [openAdministracion, setOpenAdministracion] = useState(false);
  const [openPanelReportes, setOpenPanelReportes] = useState(false);

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

  const sistemaItems = [
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
    {
      id: "menus",
      link: "/menus",
      label: "Menús",
      icon: "icons/menu.svg",
    },
  ];

  const proyectosItems = [
    {
      id: "clientes",
      link: "/clientes",
      label: "Clientes",
      icon: "icons/clients.svg",
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
    {
      id: "proyectos",
      link: "/proyectos",
      label: "Proyectos",
      icon: "icons/projects.svg",
    },
  ];

  const inventarioItems = [
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
  ];

  const administracionItems = [
    {
      id: "empleados",
      link: "/empleados",
      label: "Empleados",
      icon: "icons/employee.svg",
    },
    {
      id: "vehiculos",
      link: "/vehiculos",
      label: "Vehículos",
      icon: "icons/car.svg",
    },
  ];

  const panelReportesItems = [
    {
      id: "dashboard",
      link: "/dashboard",
      label: "Dashboard",
      icon: "icons/dashboard.svg",
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

  const sistemaFiltrado = filtrarPorPermiso(sistemaItems);
  const proyectosFiltrado = filtrarPorPermiso(proyectosItems);
  const inventarioFiltrado = filtrarPorPermiso(inventarioItems);
  const administracionFiltrado = filtrarPorPermiso(administracionItems);
  const panelReportesFiltrado = filtrarPorPermiso(panelReportesItems);

  const isGroupActive = (items) => {
    return items.some((item) => location.pathname === item.link);
  };

  const isInicioActive =
    location.pathname === "/" || location.pathname === "/inicio";

  const renderGrupo = (titulo, icono, abierto, cambiarEstado, items) => {
    if (items.length === 0) return null;

    const activoGrupo = isGroupActive(items);

    return (
      <li>
        <button
          type="button"
          onClick={() => cambiarEstado(!abierto)}
          title={titulo}
          className={`
            flex
            w-full
            items-center
            gap-2
            rounded-2xl
            px-2.5
            py-3
            text-left
            text-sm
            font-bold
            transition
            ${
              activoGrupo || abierto
                ? "bg-white/15 text-white shadow-sm"
                : "text-blue-100 hover:bg-white/10 hover:text-white"
            }
          `}
        >
          <span
            className={`
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-2xl
              ${activoGrupo || abierto ? "bg-cyan-400/20" : "bg-white/10"}
            `}
          >
            <img
              className="h-5 w-5 brightness-0 invert"
              src={icono}
              alt=""
            />
          </span>

          <span className="min-w-0 flex-1 whitespace-normal break-words leading-4">
            {titulo}
          </span>

          <svg
            width="18"
            height="18"
            fill="none"
            viewBox="0 0 24 24"
            className={`
              shrink-0
              transition-transform
              duration-200
              ${abierto ? "rotate-180" : ""}
            `}
          >
            <path
              d="M6 9l6 6 6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {abierto && (
          <ul className="ml-4 mt-2 space-y-1 border-l border-white/10 pl-2">
            {items.map((sub) => {
              const activo = location.pathname === sub.link;

              return (
                <li key={sub.id}>
                  <Link
                    to={sub.link}
                    title={sub.label}
                    className={`
                      flex
                      items-center
                      gap-2
                      rounded-2xl
                      px-2.5
                      py-2.5
                      text-sm
                      font-semibold
                      transition
                      ${
                        activo
                          ? "bg-cyan-400/20 text-white shadow-sm"
                          : "text-blue-100 hover:bg-white/10 hover:text-white"
                      }
                    `}
                  >
                    <img
                      className="h-4 w-4 shrink-0 brightness-0 invert"
                      src={sub.icon}
                      alt=""
                    />

                    <span className="min-w-0 whitespace-normal break-words leading-4">
                      {sub.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </li>
    );
  };

  const mobileItems = [
    {
      id: "inicio",
      link: "/inicio",
      label: "Inicio",
      icon: "icons/dashboard.svg",
    },
    ...proyectosFiltrado,
    ...inventarioFiltrado,
    ...administracionFiltrado,
    ...sistemaFiltrado,
    ...panelReportesFiltrado,
  ];

  return (
    <>
      <aside
        className="
          hidden
          lg:fixed
          lg:left-0
          lg:top-0
          lg:z-50
          lg:flex
          lg:h-screen
          lg:w-48
          lg:flex-col
          lg:overflow-hidden
          lg:border-r
          lg:border-white/10
          lg:bg-gradient-to-b
          lg:from-slate-950
          lg:via-blue-950
          lg:to-blue-900
          lg:shadow-2xl
        "
      >
        <div className="shrink-0 px-3 py-5">
          <div className="flex items-center gap-2 rounded-3xl border border-white/10 bg-white/10 p-2.5 shadow-sm">
            <img
              src="/Logo.jpg"
              className="h-11 w-11 shrink-0 rounded-2xl object-cover"
              alt="Logo"
            />

            <div className="min-w-0 text-white">
              <p className="text-sm font-medium leading-4 text-blue-100">
                Asesoría &
              </p>

              <p className="text-sm font-bold leading-4">
                Construcción S.A.
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-2.5 pb-5">
          <ul className="space-y-2">
            <li>
              <Link
                to="/inicio"
                title="Inicio"
                className={`
                  flex
                  w-full
                  items-center
                  gap-2
                  rounded-2xl
                  px-2.5
                  py-3
                  text-left
                  text-sm
                  font-bold
                  transition
                  ${
                    isInicioActive
                      ? "bg-white/15 text-white shadow-sm"
                      : "text-blue-100 hover:bg-white/10 hover:text-white"
                  }
                `}
              >
                <span
                  className={`
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-2xl
                    ${isInicioActive ? "bg-cyan-400/20" : "bg-white/10"}
                  `}
                >
                  <img
                    className="h-5 w-5 brightness-0 invert"
                    src="icons/dashboard.svg"
                    alt=""
                  />
                </span>

                <span className="min-w-0 flex-1 whitespace-normal break-words leading-4">
                  Inicio
                </span>
              </Link>
            </li>

            {renderGrupo(
              "Sistema",
              "icons/menu.svg",
              openSistema,
              setOpenSistema,
              sistemaFiltrado
            )}

            {renderGrupo(
              "Proyectos",
              "icons/projects.svg",
              openProyectos,
              setOpenProyectos,
              proyectosFiltrado
            )}

            {renderGrupo(
              "Inventario",
              "icons/inventory.svg",
              openInventario,
              setOpenInventario,
              inventarioFiltrado
            )}

            {renderGrupo(
              "Administración",
              "icons/employee.svg",
              openAdministracion,
              setOpenAdministracion,
              administracionFiltrado
            )}

            {renderGrupo(
              "Panel y reportes",
              "icons/dashboard.svg",
              openPanelReportes,
              setOpenPanelReportes,
              panelReportesFiltrado
            )}
          </ul>
        </nav>

        <div className="shrink-0 border-t border-white/10 px-3 py-4">
          <div className="rounded-3xl border border-white/10 bg-white/10 p-3">
            <p className="text-sm font-bold leading-4 text-white">
              Sistema ACSA
            </p>

            <p className="mt-1 text-sm leading-4 text-blue-100">
              Panel de gestión
            </p>
          </div>
        </div>
      </aside>

      <nav
        className="
          fixed
          bottom-0
          left-0
          right-0
          z-50
          border-t
          border-white/10
          bg-gradient-to-r
          from-slate-950
          via-blue-950
          to-cyan-900
          px-2
          py-2
          shadow-2xl
          lg:hidden
        "
      >
        <div className="grid grid-cols-5 gap-2">
          {mobileItems.slice(0, 5).map((item) => {
            const activo =
              location.pathname === item.link ||
              (item.id === "inicio" && location.pathname === "/");

            return (
              <Link
                key={item.id}
                to={item.link}
                title={item.label}
                className={`
                  flex
                  flex-col
                  items-center
                  justify-center
                  gap-1
                  rounded-2xl
                  px-2
                  py-2
                  text-sm
                  font-semibold
                  transition
                  ${
                    activo
                      ? "bg-cyan-400/20 text-white"
                      : "text-blue-100 hover:bg-white/10 hover:text-white"
                  }
                `}
              >
                <img
                  className="h-5 w-5 brightness-0 invert"
                  src={item.icon}
                  alt=""
                />

                <span className="max-w-full truncate text-[11px]">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default Sidebar;