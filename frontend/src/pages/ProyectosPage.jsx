import { useState } from 'react';
import DataTable from '../components/DataTable';
import ButtonList from '../components/ButtonList';
import Modal from '../components/Modal';
import { mockDb } from '../../data/mockDb';

function ProyectosPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    clienteId: '',
    nombreProyecto: '',
    descripcion: '',
    ubicacion: '',
    fechaInicio: '',
    fechaFin: '',
    presupuestoInicial: '',
    estado: 'Planificado'
  });

  const tableHeaders = ['Nombre', 'Cliente', 'Ubicacion', 'Estado', 'Presupuesto'];
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
  const tableData = mockDb.proyectos.map(proyecto => ({
    id: proyecto.proyectoId,
    'Nombre': proyecto.nombreProyecto,
    'Cliente': mockDb.clientes.find(c => c.clienteId === proyecto.clienteId)?.nombreEmpresa || 'N/A',
    'Ubicacion': proyecto.ubicacion,
    'Estado': proyecto.estado,
    'Presupuesto': proyecto.presupuestoInicial.toLocaleString(),
  }));

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    console.log('Nuevo proyecto:', formData);
    // Aquí iría la lógica para guardar en la base de datos
    setIsModalOpen(false);
    setFormData({
      clienteId: '',
      nombreProyecto: '',
      descripcion: '',
      ubicacion: '',
      fechaInicio: '',
      fechaFin: '',
      presupuestoInicial: '',
      estado: 'Planificado'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-6">
        <div className=" ">
          <h1 className="heading-1 text-[var(--color-primary)] mb-2">
            Proyectos
          </h1>
          <p className="body-1 text-[var(--color-gray)]">
            Gestión de proyectos y avances
          </p>
        </div>
        <ButtonList buttons={buttons} />

        <DataTable headers={tableHeaders} data={tableData} />

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Añadir Nuevo Proyecto"
          onSubmit={handleSubmit}
        >
          <div className="space-y-4">
            <div>
              <label className="block body-2 text-[var(--color-gray)] mb-1">Cliente</label>
              <select
                name="clienteId"
                value={formData.clienteId}
                onChange={handleInputChange}
                className="w-full p-2 border    border-gray-450 rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                required
              >
                <option value="">Seleccionar cliente</option>
                {mockDb.clientes.map(cliente => (
                  <option key={cliente.clienteId} value={cliente.clienteId}>
                    {cliente.nombreEmpresa}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block body-2 text-[var(--color-gray)] mb-1">Nombre del Proyecto</label>
              <input
                type="text"
                name="nombreProyecto"
                value={formData.nombreProyecto}
                onChange={handleInputChange}
                className="w-full p-2 border    border-gray-450 rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                required
              />
            </div>
            <div>
              <label className="block body-2 text-[var(--color-gray)] mb-1">Descripción</label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                className="w-full p-2 border    border-gray-450 rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                rows="3"
              />
            </div>
            <div>
              <label className="block body-2 text-[var(--color-gray)] mb-1">Ubicación</label>
              <input
                type="text"
                name="ubicacion"
                value={formData.ubicacion}
                onChange={handleInputChange}
                className="w-full p-2 border    border-gray-450 rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block body-2 text-[var(--color-gray)] mb-1">Fecha Inicio</label>
                <input
                  type="date"
                  name="fechaInicio"
                  value={formData.fechaInicio}
                  onChange={handleInputChange}
                  className="w-full p-2 border    border-gray-450 rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  required
                />
              </div>
              <div>
                <label className="block body-2 text-[var(--color-gray)] mb-1">Fecha Fin</label>
                <input
                  type="date"
                  name="fechaFin"
                  value={formData.fechaFin}
                  onChange={handleInputChange}
                  className="w-full p-2 border    border-gray-450 rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block body-2 text-[var(--color-gray)] mb-1">Presupuesto Inicial</label>
              <input
                type="number"
                name="presupuestoInicial"
                value={formData.presupuestoInicial}
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
                <option value="Planificado">Planificado</option>
                <option value="En ejecución">En ejecución</option>
                <option value="Completado">Completado</option>
                <option value="Suspendido">Suspendido</option>
              </select>
            </div>
          </div>
        </Modal>
      </main>
    </div>
  );
}

export default ProyectosPage;
