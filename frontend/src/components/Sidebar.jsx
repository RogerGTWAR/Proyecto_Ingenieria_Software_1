import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const [openRegistro, setOpenRegistro] = useState(false);

  /* ===============================
     LEER PERMISOS DEL USUARIO
  ================================== */
  const raw = localStorage.getItem("menu");
  let permisos = [];

  try {
    const parsed = JSON.parse(raw) || [];

    const flatten = (items = []) =>
      items.flatMap((m) => [m, ...(m.children ? flatten(m.children) : [])]);

    permisos = flatten(parsed);
  } catch {
    permisos = [];
  }

  const tienePermiso = (url) =>
    permisos.some(
      (m) => m.url === url || m.menu?.url === url
    );

  /* ===============================
     ITEMS DEL SIDEBAR
  ================================== */
  const navigationItems = [
    { id: 'dashboard', link: '/', label: 'Dashboard', icon: "icons/dashboard.svg" },
    { id: 'proyectos', link: '/proyectos', label: 'Proyectos', icon: "icons/projects.svg" },
    { id: 'vehiculos', link: '/vehiculos', label: 'Vehículos', icon: "icons/car.svg" },
    { id: 'compras', link: '/compras', label: 'Compras', icon: "icons/buy.svg" },
    { id: 'inventario', link: '/materiales', label: 'Inventario', icon: "icons/inventory.svg" },
    { id: 'avaluos', link: '/avaluos', label: 'Avalúos', icon: "icons/suppliers.svg" },
    { id: 'servicios', link: '/servicios', label: 'Servicios', icon: "icons/tool.svg" },
    { id: 'menus', link: '/menus', label: 'Menús' },
  ];

  const registroItems = [
    { id: 'empleados', link: '/empleados', label: 'Empleados', icon: "icons/employee.svg" },
    { id: 'clientes', link: '/clientes', label: 'Clientes', icon: "icons/clients.svg" },
    { id: 'proveedores', link: '/proveedores', label: 'Proveedores', icon: "icons/suppliers.svg" },
    { id: 'permisos', link: '/permisos', label: 'Permisos', icon: "icons/suppliers.svg" },
  ];

  const registroFiltrado = registroItems.filter(
    (sub) => tienePermiso(sub.link)
  );

  return (
    <>
      <div
        className="hidden lg:flex lg:flex-col lg:w-52 lg:fixed lg:left-0 lg:top-0 lg:h-screen lg:z-50"
        style={{ backgroundColor: "#1A2E81", fontFamily: "'Poppins', sans-serif" }}
      >
        <div className="px-3 py-8 flex items-center gap-3">
          <img src="/Logo.jpg" alt="ACONSA Logo" className="w-14 h-14 object-contain rounded-md" />
          <div className="flex flex-col text-white leading-tight">
            <span className="uppercase text-sm font-medium">Asesoría &</span>
            <span className="uppercase text-sm font-semibold">Construcción</span>
            <span className="uppercase text-sm font-semibold">S.A.</span>
          </div>
        </div>

        <nav className="flex-1 px-1 pt-4">
          <ul className="space-y-1">

            {/* 🔵 SUBMENÚ REGISTRO */}
            {registroFiltrado.length > 0 && (
              <li>
                <button
                  onClick={() => setOpenRegistro(!openRegistro)}
                  className={`flex items-center gap-3 w-full px-3 py-3 rounded-md transition-all duration-200 text-white hover:bg-[#253C9C] ${
                    openRegistro ? "bg-[#253C9C] scale-105 shadow-md" : ""
                  }`}
                >
                  <img className="size-5 filter invert brightness-0" src="icons/menu.svg" />
                  <span className="text-[15px] font-medium">Registro</span>
                  <span className={`ml-auto transition-transform ${openRegistro ? "rotate-90" : ""}`}>
                    ❯
                  </span>
                </button>

                {openRegistro && (
                  <ul className="ml-8 mt-1 space-y-1">
                    {registroFiltrado.map((sub) => (
                      <li key={sub.id}>
                        <Link
                          to={sub.link}
                          className={`flex items-center gap-3 px-3 py-2 rounded-md text-white text-sm transition-all duration-200 ${
                            location.pathname === sub.link
                              ? "bg-[#253C9C] scale-105 shadow-md"
                              : "hover:bg-[#253C9C]"
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

            {/* 🔵 MENÚS PRINCIPALES */}
            {navigationItems
              .filter((item) => tienePermiso(item.link))
              .map((item) => (
                <li key={item.id}>
                  <Link
                    to={item.link}
                    className={`flex items-center gap-3 px-3 py-3 rounded-md transition-all duration-200 text-white ${
                      location.pathname === item.link
                        ? "bg-[#253C9C] scale-105 shadow-md"
                        : "hover:bg-[#253C9C]"
                    }`}
                  >
                    <img className="size-5 filter invert brightness-0" src={item.icon} />
                    <span className="text-[15px] font-medium">{item.label}</span>
                  </Link>
                </li>
              ))}

          </ul>
        </nav>
      </div>

      {/* Móvil */}
      <div
        className="lg:hidden fixed bottom-0 left-0 right-0 shadow-lg z-50"
        style={{ backgroundColor: "#1A2E81" }}
      >
        <div className="flex justify-around items-center px-2">
          {navigationItems
            .filter((item) => tienePermiso(item.link))
            .map((item) => (
              <Link
                key={item.id}
                to={item.link}
                className={`flex flex-col items-center justify-center border-t-4 border-transparent hover:scale-110 transition-all duration-200 flex-1 py-4 ${
                  location.pathname === item.link ? "scale-110 border-t-white" : ""
                }`}
              >
                <img className="size-6 filter invert brightness-0" src={item.icon} />
              </Link>
            ))}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
