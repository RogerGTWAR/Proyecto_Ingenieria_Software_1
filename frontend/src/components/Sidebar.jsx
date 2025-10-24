import React from 'react';
import { useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const navigationItems = [
    { id: 'dashboard', link: '/', label: 'Dashboard', icon: "icons/dashboard.svg" },
    { id: 'proyectos', link: '/proyectos', label: 'Proyectos', icon: "icons/projects.svg" },
    { id: 'inventario', link: '/inventario', label: 'Inventario', icon: "icons/inventory.svg" },
    { id: 'empleados', link: '/empleados', label: 'Empleados', icon: "icons/employee.svg" },
    { id: 'vehiculos', link: '/vehiculos', label: 'Vehículos', icon: "icons/car.svg"},
    { id: 'compras', link: '/compras', label: 'Compras', icon: "icons/buy.svg" },
    { id: 'servicios', link: '/servicios', label: 'Servicios', icon: "icons/tool.svg" },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-48 lg:bg-[var(--color-primary)]  lg:fixed lg:left-0 lg:top-0 lg:h-screen lg:z-50">
        {/* Logo Section */}
        <div className="px-1 py-8">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="ACONSA Logo"
              className="w-16 h-16 object-contain"
            />
            <div className="flex flex-col text-white">
              <span className="body-2 uppercase leading-tight ">Asesoría &</span>
              <span className="heading-4 uppercase leading-tight body-2 ">Construcción</span>
              <span className="heading-4 uppercase leading-tight body-2">S.A.</span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-0.5 pt-8">
          <ul className="space-y-1">
            {navigationItems.map((item) => (
              <li key={item.id}>
                <a
                  href={item.link}
                  className={`flex items-center gap-3 px-3 py-3 rounded-none border-r-4 border-transparent hover:border-r-black hover:scale-105 transition-all duration-200 group filter-white ${location.pathname === item.link ? 'border-r-black scale-105 filter-blue' : ''}`}
                >
                  <img className="size-6" src={item.icon} alt={item.label} />
                  <span className="title-1 ">{item.label}</span>
                </a>

              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Mobile Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[var(--color-primary)] shadow-lg z-50 ">
        <div className="flex justify-around items-center px-2 ">
          {navigationItems.map((item) => (
            <a
              key={item.id}
              href={item.link}
              className={`flex flex-col items-center justify-center m-0 rounded-none border-t-4 border-transparent hover:scale-110 hover:border-t-black transition-all duration-200 flex-1 min-w-0 py-4 filter-white ${location.pathname === item.link ? 'scale-110 border-t-black filter-blue' : ''}`}
              aria-label={item.label}
            >
              <img className="size-6" src={item.icon} alt={item.label}></img>
            </a>
          ))}
        </div>
      </div>
    </>
  );
};

export default Sidebar;







