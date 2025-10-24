import { useState } from 'react';
import DataTable from '../components/DataTable';
import ButtonList from '../components/ButtonList';
import Modal from '../components/Modal';
import { mockDb } from '../../data/mockDb';

function EmpleadosPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    rolId: '',
    nombres: '',
    apellidos: '',
    cedula: '',
    inss: '',
    fechaNacimiento: '',
    fechaContratacion: '',
    direccion: '',
    pais: 'Nicaragua',
    telefono: '',
    correo: '',
    reportaA: ''
  });

  const tableHeaders = ['Nombres', 'Apellidos', 'Rol', 'Cedula', 'Correo'];
  const tableData = mockDb.empleados.map(empleado => ({
    id: empleado.empleadoId,
    'Nombres': empleado.nombres,
    'Apellidos': empleado.apellidos,
    'Rol': mockDb.roles.find(r => r.rolId === empleado.rolId)?.cargo || 'N/A',
    'Cedula': empleado.cedula,
    'Correo': empleado.correo,
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
    console.log('Nuevo empleado:', formData);
    // Aquí iría la lógica para guardar en la base de datos
    setIsModalOpen(false);
    setFormData({
      rolId: '',
      nombres: '',
      apellidos: '',
      cedula: '',
      inss: '',
      fechaNacimiento: '',
      fechaContratacion: '',
      direccion: '',
      pais: 'Nicaragua',
      telefono: '',
      correo: '',
      reportaA: ''
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-6">
        <div className=" ">
          <h1 className="heading-1 text-[var(--color-primary)] mb-2">
            Empleados
          </h1>
          <p className="body-1 text-[var(--color-gray)]">
            Gestión del personal de la empresa
          </p>
        </div>
        <ButtonList buttons={buttons} />
        <DataTable headers={tableHeaders} data={tableData} />

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Añadir Nuevo Empleado"
          onSubmit={handleSubmit}
        >
          <div className="space-y-4">
            <div>
              <label className="block body-2 text-[var(--color-gray)] mb-1">Rol</label>
              <select
                name="rolId"
                value={formData.rolId}
                onChange={handleInputChange}
                className="w-full p-2 border    border-gray-450 rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                required
              >
                <option value="">Seleccionar rol</option>
                {mockDb.roles.map(rol => (
                  <option key={rol.rolId} value={rol.rolId}>
                    {rol.cargo}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block body-2 text-[var(--color-gray)] mb-1">Nombres</label>
                <input
                  type="text"
                  name="nombres"
                  value={formData.nombres}
                  onChange={handleInputChange}
                  className="w-full p-2 border    border-gray-450 rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  required
                />
              </div>
              <div>
                <label className="block body-2 text-[var(--color-gray)] mb-1">Apellidos</label>
                <input
                  type="text"
                  name="apellidos"
                  value={formData.apellidos}
                  onChange={handleInputChange}
                  className="w-full p-2 border    border-gray-450 rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block body-2 text-[var(--color-gray)] mb-1">Cédula</label>
                <input
                  type="text"
                  name="cedula"
                  value={formData.cedula}
                  onChange={handleInputChange}
                  className="w-full p-2 border    border-gray-450 rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  required
                />
              </div>
              <div>
                <label className="block body-2 text-[var(--color-gray)] mb-1">INSS</label>
                <input
                  type="text"
                  name="inss"
                  value={formData.inss}
                  onChange={handleInputChange}
                  className="w-full p-2 border    border-gray-450 rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block body-2 text-[var(--color-gray)] mb-1">Fecha Nacimiento</label>
                <input
                  type="date"
                  name="fechaNacimiento"
                  value={formData.fechaNacimiento}
                  onChange={handleInputChange}
                  className="w-full p-2 border    border-gray-450 rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  required
                />
              </div>
              <div>
                <label className="block body-2 text-[var(--color-gray)] mb-1">Fecha Contratación</label>
                <input
                  type="date"
                  name="fechaContratacion"
                  value={formData.fechaContratacion}
                  onChange={handleInputChange}
                  className="w-full p-2 border    border-gray-450 rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block body-2 text-[var(--color-gray)] mb-1">Dirección</label>
              <input
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleInputChange}
                className="w-full p-2 border    border-gray-450 rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block body-2 text-[var(--color-gray)] mb-1">País</label>
                <input
                  type="text"
                  name="pais"
                  value={formData.pais}
                  onChange={handleInputChange}
                  className="w-full p-2 border    border-gray-450 rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  required
                />
              </div>
              <div>
                <label className="block body-2 text-[var(--color-gray)] mb-1">Teléfono</label>
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  className="w-full p-2 border    border-gray-450 rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block body-2 text-[var(--color-gray)] mb-1">Correo</label>
              <input
                type="email"
                name="correo"
                value={formData.correo}
                onChange={handleInputChange}
                className="w-full p-2 border    border-gray-450 rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                required
              />
            </div>
            <div>
              <label className="block body-2 text-[var(--color-gray)] mb-1">Reporta A</label>
              <select
                name="reportaA"
                value={formData.reportaA}
                onChange={handleInputChange}
                className="w-full p-2 border    border-gray-450 rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              >
                <option value="">Seleccionar supervisor</option>
                {mockDb.empleados.map(empleado => (
                  <option key={empleado.empleadoId} value={empleado.empleadoId}>
                    {empleado.nombres} {empleado.apellidos}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Modal>
      </main>
    </div>
  );
}

export default EmpleadosPage;
