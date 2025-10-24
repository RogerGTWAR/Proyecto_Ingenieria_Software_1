import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import ProyectosPage from './pages/ProyectosPage.jsx'
import InventarioPage from './pages/InventarioPage.jsx'
import VehiculosPage from './pages/VehiculosPage.jsx'
import ServiciosPage from './pages/ServiciosPage.jsx'
import EmpleadosPage from './pages/EmpleadosPage.jsx'
import ComprasPage from './pages/ComprasPage.jsx'
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
        <Route path="inventario" element={<InventarioPage />} />
        <Route path="vehiculos" element={<VehiculosPage />} />
        <Route path="servicios" element={<ServiciosPage />} />
        <Route path="empleados" element={<EmpleadosPage />} />
        <Route path="compras" element={<ComprasPage />} />
      </Route>
    </Routes>
  )
}

export default App
