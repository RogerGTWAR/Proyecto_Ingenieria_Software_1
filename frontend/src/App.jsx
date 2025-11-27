import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'

import DashboardPage from './pages/DashboardPage.jsx'
import ProyectosPage from './pages/ProyectosPage.jsx'
import VehiculosPage from './pages/VehiculosPage.jsx'
import EmpleadosPage from './pages/EmpleadosPage.jsx'
import ComprasPage from './pages/ComprasPage.jsx'
import ClientesPage from './pages/ClientesPage.jsx'
import ProveedoresPage from './pages/ProveedoresPage.jsx'
import MaterialesPage from './pages/MaterialesPage.jsx'
import AvaluosPage from './pages/AvaluosPage.jsx'
import ServiciosPage from './pages/ServiciosPage.jsx'
import PermisosPage from './pages/PermisosPage.jsx'
import MenusPage from './pages/MenusPage.jsx'

import LoginPage from './pages/LoginPage.jsx'
import SignupPage from './pages/SignupPage.jsx'

import ProtectedRoute from "./components/ProtectedRoute.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import NoAutorizado from "./pages/NoAutorizado.jsx"

import ReportesPage from './pages/ReportesPage.jsx'
import UsuariosPage from './pages/UsuariosPage.jsx'

function App() {
  return (
    <Routes>
      {/* LOGIN / SIGNUP */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* PÁGINA DE ACCESO DENEGADO */}
      <Route path="/no-autorizado" element={<NoAutorizado />} />

      {/* TODAS LAS DEMÁS RUTAS REQUIEREN LOGIN */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Layout />}>

          {/* Dashboard — No requiere permisos especiales */}
          <Route index element={<DashboardPage />} />

          {/* 🔥 TODAS ESTAS RUTAS YA VAN PROTEGIDAS POR PERMISOS 🔥 */}
          <Route path="proyectos"
            element={<PrivateRoute permiso="/proyectos" element={<ProyectosPage />} />}
          />

          <Route path="vehiculos"
            element={<PrivateRoute permiso="/vehiculos" element={<VehiculosPage />} />}
          />

          <Route path="empleados"
            element={<PrivateRoute permiso="/empleados" element={<EmpleadosPage />} />}
          />

          <Route path="compras"
            element={<PrivateRoute permiso="/compras" element={<ComprasPage />} />}
          />

          <Route path="clientes"
            element={<PrivateRoute permiso="/clientes" element={<ClientesPage />} />}
          />

          <Route path="proveedores"
            element={<PrivateRoute permiso="/proveedores" element={<ProveedoresPage />} />}
          />

          <Route path="materiales"
            element={<PrivateRoute permiso="/materiales" element={<MaterialesPage />} />}
          />

          <Route path="avaluos"
            element={<PrivateRoute permiso="/avaluos" element={<AvaluosPage />} />}
          />

          <Route path="servicios"
            element={<PrivateRoute permiso="/servicios" element={<ServiciosPage />} />}
          />

          <Route path="menus"
            element={<PrivateRoute permiso="/menus" element={<MenusPage />} />}
          />

          <Route path="permisos"
            element={<PrivateRoute permiso="/permisos" element={<PermisosPage />} />}
          />

          <Route path="usuarios"
            element={<PrivateRoute permiso="/usuarios" element={<UsuariosPage />} />}
          />
          
          <Route path="reportes" element={<ReportesPage />} />

        </Route>
      </Route>
    </Routes>
  );
}

export default App;