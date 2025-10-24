import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Upbar from './upbar';

const Layout = () => {
  const location = useLocation();

  const getTitle = (pathname) => {
    switch (pathname) {
      case '/': return 'Dashboard';
      case '/proyectos': return 'Proyectos';
      case '/inventario': return 'Inventario';
      case '/empleados': return 'Empleados';
      case '/vehiculos': return 'Vehículos';
      case '/servicios': return 'Servicios';
      case '/compras': return 'Compras';
      default: return 'Dashboard';
    }
  };

  return (
    <div className="min-h-screen">
      <Sidebar />
      <Upbar title={getTitle(location.pathname)} />
      <main className="lg:ml-48 pb-20 pt-16">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;