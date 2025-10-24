import { useState } from 'react';
import DataTable from '../components/DataTable';
import ButtonList from '../components/ButtonList';
import Modal from '../components/Modal';
import { mockDb } from '../../data/mockDb';

function ComprasPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    proveedorId: '',
    empleadoId: '',
    numeroFactura: '',
    fechaCompra: '',
    montoTotal: '',
    estado: 'Pendiente',
    observaciones: ''
  });

  const tableHeaders = ['Proveedor', 'Empleado', 'Factura', 'Fecha', 'Monto', 'Estado'];
  const tableData = mockDb.compras.map(compra => ({
    id: compra.compraId,
    'Proveedor': mockDb.proveedores.find(p => p.proveedorId === compra.proveedorId)?.nombreEmpresa || 'N/A',
    'Empleado': mockDb.empleados.find(e => e.empleadoId === compra.empleadoId)?.nombres + ' ' + mockDb.empleados.find(e => e.empleadoId === compra.empleadoId)?.apellidos || 'N/A',
    'Factura': compra.numeroFactura,
    'Fecha': compra.fechaCompra,
    'Monto': compra.montoTotal.toLocaleString(),
    'Estado': compra.estado,
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
    console.log('Nueva compra:', formData);
    // Aquí iría la lógica para guardar en la base de datos
    setIsModalOpen(false);
    setFormData({
      proveedorId: '',
      empleadoId: '',
      numeroFactura: '',
      fechaCompra: '',
      montoTotal: '',
      estado: 'Pendiente',
      observaciones: ''
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-6">
        <div className=" ">
          <h1 className="heading-1 text-[var(--color-primary)] mb-2">
            Compras
          </h1>
          <p className="body-1 text-[var(--color-gray)]">
            Gestión de compras y proveedores
          </p>
        </div>
        <ButtonList buttons={buttons} />
        <DataTable headers={tableHeaders} data={tableData} />

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Añadir Nueva Compra"
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
            <div>
              <label className="block body-2 text-[var(--color-gray)] mb-1">Empleado</label>
              <select
                name="empleadoId"
                value={formData.empleadoId}
                onChange={handleInputChange}
                className="w-full p-2 border    border-gray-450 rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                required
              >
                <option value="">Seleccionar empleado</option>
                {mockDb.empleados.map(empleado => (
                  <option key={empleado.empleadoId} value={empleado.empleadoId}>
                    {empleado.nombres} {empleado.apellidos}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block body-2 text-[var(--color-gray)] mb-1">Número de Factura</label>
              <input
                type="text"
                name="numeroFactura"
                value={formData.numeroFactura}
                onChange={handleInputChange}
                className="w-full p-2 border    border-gray-450 rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                required
              />
            </div>
            <div>
              <label className="block body-2 text-[var(--color-gray)] mb-1">Fecha de Compra</label>
              <input
                type="date"
                name="fechaCompra"
                value={formData.fechaCompra}
                onChange={handleInputChange}
                className="w-full p-2 border    border-gray-450 rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                required
              />
            </div>
            <div>
              <label className="block body-2 text-[var(--color-gray)] mb-1">Monto Total</label>
              <input
                type="number"
                name="montoTotal"
                value={formData.montoTotal}
                onChange={handleInputChange}
                className="w-full p-2 border    border-gray-450 rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                required
              />
            </div>
            <div>
              <label className="block body-2 text-[var(--color-gray)] mb-1">Estado</label>
              <select
                name="estado"
                value={formData.estado}
                onChange={handleInputChange}
                className="w-full p-2 border    border-gray-450 rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              >
                <option value="Pendiente">Pendiente</option>
                <option value="Pagada">Pagada</option>
                <option value="Cancelada">Cancelada</option>
              </select>
            </div>
            <div>
              <label className="block body-2 text-[var(--color-gray)] mb-1">Observaciones</label>
              <textarea
                name="observaciones"
                value={formData.observaciones}
                onChange={handleInputChange}
                className="w-full p-2 border    border-gray-450 rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                rows="3"
              />
            </div>
          </div>
        </Modal>
      </main>
    </div>
  );
}

export default ComprasPage;
