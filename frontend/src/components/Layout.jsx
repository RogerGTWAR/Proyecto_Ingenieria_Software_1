import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Upbar from "./upbar";

const Layout = () => {
  const location = useLocation();

  const getTitle = (pathname) => {
    switch (pathname) {
      case "/":
        return "Inicio";
      case "/inicio":
        return "Inicio";
      case "/dashboard":
        return "Dashboard";
      case "/proyectos":
        return "Proyectos";
      case "/empleados":
        return "Empleados";
      case "/vehiculos":
        return "Vehículos";
      case "/servicios":
        return "Servicios";
      case "/compras":
        return "Compras";
      case "/clientes":
        return "Clientes";
      case "/proveedores":
        return "Proveedores";
      case "/materiales":
        return "Inventario";
      case "/movimientos_inventario":
        return "Movimientos de Inventario";
      case "/alertas_inventario":
        return "Alertas de Inventario";
      case "/avaluos":
        return "Avalúos";
      case "/permisos":
        return "Permisos";
      case "/menus":
        return "Menús";
      case "/reportes":
        return "Reportes";
      case "/usuarios":
        return "Usuarios";
      case "/notificaciones":
        return "Notificaciones";
      default:
        return "Inicio";
    }
  };

  return (
    <div className="min-h-screen bg-slate-200">
      <Sidebar />

      <Upbar title={getTitle(location.pathname)} />

      <main
        className="
          min-h-screen
          w-full
          overflow-x-hidden
          bg-slate-200
          pt-16
          md:pl-20
          lg:pl-48
        "
      >
        <div className="min-h-[calc(100dvh-64px)] w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;