import { useState } from 'react';
import DataTable from '../components/DataTable';
import ButtonList from '../components/ButtonList';
import Modal from '../components/Modal';
import { mockDb } from '../../data/mockDb';

function VehiculosPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    proveedorId: '',
    marca: '',
    modelo: '',
    anio: '',
    placa: '',
    tipoDeVehiculo: '',
    tipoDeCombustible: 'Diesel',
    estado: 'Operativo',
    fechaRegistro: ''
  });

  const tableHeaders = ['Marca', 'Modelo', 'Placa', 'Tipo', 'Estado'];
  const tableData = mockDb.vehiculos.map(vehiculo => ({
    id: vehiculo.vehiculoId,
    'Marca': vehiculo.marca,
    'Modelo': vehiculo.modelo,
    'Placa': vehiculo.placa,
    'Tipo': vehiculo.tipoDeVehiculo,
    'Estado': vehiculo.estado,
  }));

  const buttons = [
    {
      id: 'filter',
      name: 'Filtrar',
      icon: '/icons/filter.svg',
      coordinate: 3,
      action: () => console.log('Filter clicked'),
    },
    {
      id: 'add',
      name: 'Añadir',
      icon: '/icons/add.svg',
      coordinate: 4,
      action: () => setIsModalOpen(true),
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    console.log('Nuevo vehículo:', formData);
    // Aquí iría la lógica para guardar en la base de datos
    setIsModalOpen(false);
    setFormData({
      proveedorId: '',
      marca: '',
      modelo: '',
      anio: '',
      placa: '',
      tipoDeVehiculo: '',
      tipoDeCombustible: 'Diesel',
      estado: 'Operativo',
      fechaRegistro: ''
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-6">
        <div className=" ">
          <h1 className="heading-1 text-[var(--color-primary)] mb-2">
            Vehículos
          </h1>
          <p className="body-1 text-[var(--color-gray)]">
            Gestión de flota vehicular
          </p>
        </div>
        <ButtonList buttons={buttons} />
        <DataTable headers={tableHeaders} data={tableData} />

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Añadir Nuevo Vehículo"
          onSubmit={handleSubmit}
        >
          <div className="space-y-4">
            <div>
              <label className="block body-2 text-[var(--color-gray)] mb-1">Proveedor</label>
              <select
                name="proveedorId"
                value={formData.proveedorId}
                onChange={handleInputChange}
                className="w-full p-2 border    border-gray-450 rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                required
              >
                <option value="">Seleccionar proveedor</option>
                {mockDb.proveedores.map(proveedor => (
                  <option key={proveedor.proveedorId} value={proveedor.proveedorId}>
                    {proveedor.nombreEmpresa}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block body-2 text-[var(--color-gray)] mb-1">Marca</label>
                <input
                  type="text"
                  name="marca"
                  value={formData.marca}
                  onChange={handleInputChange}
                  className="w-full p-2 border    border-gray-450 rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  required
                />
              </div>
              <div>
                <label className="block body-2 text-[var(--color-gray)] mb-1">Modelo</label>
                <input
                  type="text"
                  name="modelo"
                  value={formData.modelo}
                  onChange={handleInputChange}
                  className="w-full p-2 border    border-gray-450 rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block body-2 text-[var(--color-gray)] mb-1">Año</label>
                <input
                  type="number"
                  name="anio"
                  value={formData.anio}
                  onChange={handleInputChange}
                  className="w-full p-2 border    border-gray-450 rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  required
                />
              </div>
              <div>
                <label className="block body-2 text-[var(--color-gray)] mb-1">Placa</label>
                <input
                  type="text"
                  name="placa"
                  value={formData.placa}
                  onChange={handleInputChange}
                  className="w-full p-2 border    border-gray-450 rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block body-2 text-[var(--color-gray)] mb-1">Tipo de Vehículo</label>
              <select
                name="tipoDeVehiculo"
                value={formData.tipoDeVehiculo}
                onChange={handleInputChange}
                className="w-full p-2 border    border-gray-450 rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                required
              >
                <option value="">Seleccionar tipo</option>
                <option value="Pickup 4x4">Pickup 4x4</option>
                <option value="Camión de volteo">Camión de volteo</option>
                <option value="Camión mixer">Camión mixer</option>
                <option value="Excavadora">Excavadora</option>
                <option value="Retroexcavadora">Retroexcavadora</option>
                <option value="Bulldozer">Bulldozer</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block body-2 text-[var(--color-gray)] mb-1">Tipo de Combustible</label>
                <select
                  name="tipoDeCombustible"
                  value={formData.tipoDeCombustible}
                  onChange={handleInputChange}
                  className="w-full p-2 border    border-gray-450 rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                >
                  <option value="Diesel">Diesel</option>
                  <option value="Gasolina">Gasolina</option>
                  <option value="Eléctrico">Eléctrico</option>
                </select>
              </div>
              <div>
                <label className="block body-2 text-[var(--color-gray)] mb-1">Estado</label>
                <select
                  name="estado"
                  value={formData.estado}
                  onChange={handleInputChange}
                  className="w-full p-2 border    border-gray-450 rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                >
                  <option value="Operativo">Operativo</option>
                  <option value="Mantenimiento">Mantenimiento</option>
                  <option value="Fuera de servicio">Fuera de servicio</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block body-2 text-[var(--color-gray)] mb-1">Fecha de Registro</label>
              <input
                type="date"
                name="fechaRegistro"
                value={formData.fechaRegistro}
                onChange={handleInputChange}
                className="w-full p-2 border    border-gray-450 rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                required
              />
            </div>
          </div>
        </Modal>
      </main>
    </div>
  );
}

export default VehiculosPage;
