import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.jsx";

import InicioPage from "./pages/InicioPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import ProyectosPage from "./pages/ProyectosPage.jsx";
import VehiculosPage from "./pages/VehiculosPage.jsx";
import EmpleadosPage from "./pages/EmpleadosPage.jsx";
import ComprasPage from "./pages/ComprasPage.jsx";
import ClientesPage from "./pages/ClientesPage.jsx";
import ProveedoresPage from "./pages/ProveedoresPage.jsx";
import MaterialesPage from "./pages/MaterialesPage.jsx";
import MovimientosInventarioPage from "./pages/MovimientosInventarioPage.jsx";
import AvaluosPage from "./pages/AvaluosPage.jsx";
import ServiciosPage from "./pages/ServiciosPage.jsx";
import PermisosPage from "./pages/PermisosPage.jsx";
import MenusPage from "./pages/MenusPage.jsx";
import UsuariosPage from "./pages/UsuariosPage.jsx";
import Notificaciones from "./pages/Notificaciones.jsx";

import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.jsx";

import ProtectedRoute from "./components/ProtectedRoute.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import NoAutorizado from "./pages/NoAutorizado.jsx";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      <Route path="/no-autorizado" element={<NoAutorizado />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Layout />}>
          <Route index element={<InicioPage />} />

          <Route path="inicio" element={<InicioPage />} />

          <Route
            path="dashboard"
            element={
              <PrivateRoute permiso="/dashboard" element={<DashboardPage />} />
            }
          />

          <Route
            path="proyectos"
            element={
              <PrivateRoute permiso="/proyectos" element={<ProyectosPage />} />
            }
          />

          <Route
            path="vehiculos"
            element={
              <PrivateRoute permiso="/vehiculos" element={<VehiculosPage />} />
            }
          />

          <Route
            path="empleados"
            element={
              <PrivateRoute permiso="/empleados" element={<EmpleadosPage />} />
            }
          />

          <Route
            path="compras"
            element={
              <PrivateRoute permiso="/compras" element={<ComprasPage />} />
            }
          />

          <Route
            path="clientes"
            element={
              <PrivateRoute permiso="/clientes" element={<ClientesPage />} />
            }
          />

          <Route
            path="proveedores"
            element={
              <PrivateRoute
                permiso="/proveedores"
                element={<ProveedoresPage />}
              />
            }
          />

          <Route
            path="materiales"
            element={
              <PrivateRoute permiso="/materiales" element={<MaterialesPage />} />
            }
          />

          <Route
            path="movimientos_inventario"
            element={
              <PrivateRoute
                permiso="/movimientos_inventario"
                element={<MovimientosInventarioPage />}
              />
            }
          />

          <Route
            path="avaluos"
            element={
              <PrivateRoute permiso="/avaluos" element={<AvaluosPage />} />
            }
          />

          <Route
            path="servicios"
            element={
              <PrivateRoute permiso="/servicios" element={<ServiciosPage />} />
            }
          />

          <Route
            path="menus"
            element={
              <PrivateRoute permiso="/menus" element={<MenusPage />} />
            }
          />

          <Route
            path="permisos"
            element={
              <PrivateRoute permiso="/permisos" element={<PermisosPage />} />
            }
          />

          <Route
            path="usuarios"
            element={
              <PrivateRoute permiso="/usuarios" element={<UsuariosPage />} />
            }
          />

          <Route
            path="notificaciones"
            element={<Notificaciones />}
          />

        </Route>
      </Route>
    </Routes>
  );
}

export default App;