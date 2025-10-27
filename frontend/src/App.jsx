import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import ProyectosPage from './pages/ProyectosPage.jsx'
import VehiculosPage from './pages/VehiculosPage.jsx'
import ServiciosPage from './pages/ServiciosPage.jsx'
import EmpleadosPage from './pages/EmpleadosPage.jsx'
import ComprasPage from './pages/ComprasPage.jsx'
import ClientesPage from './pages/ClientesPage.jsx'
import ProveedoresPage from './pages/ProveedoresPage.jsx'
import ProductosPage from './pages/ProductosPage.jsx'
import AvaluosPage  from './pages/AvaluosPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SignupPage from './pages/SignupPage.jsx'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<DashboardPage />} />
        <Route path="proyectos" element={<ProyectosPage />} />
        <Route path="vehiculos" element={<VehiculosPage />} />
        <Route path="servicios" element={<ServiciosPage />} />
        <Route path="empleados" element={<EmpleadosPage />} />
        <Route path="compras" element={<ComprasPage />} />
        <Route path="clientes" element={<ClientesPage/>} />
        <Route path="proveedores" element={<ProveedoresPage/>} />
        <Route path="productos" element={<ProductosPage />} />
        <Route path="avaluos" element={<AvaluosPage />} />
      </Route>
    </Routes>
  )
}

export default App
