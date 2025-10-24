import { useState } from 'react';
import DataTable from '../components/DataTable';
import ButtonList from '../components/ButtonList';
import Modal from '../components/Modal';
import { mockDb } from '../../data/mockDb';

function ServiciosPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    proyectoId: '',
    nombreServicio: '',
    descripcion: '',
    precioUnitario: '',
    cantidad: 1,
    fechaInicio: '',
    fechaFin: '',
    unidadDeMedida: '',
    estado: 'Programado'
  });

  const tableHeaders = ['Proyecto', 'Nombre', 'Estado', 'Total'];
  const tableData = mockDb.servicios.map(servicio => ({
    id: servicio.servicioId,
    'Proyecto': mockDb.proyectos.find(p => p.proyectoId === servicio.proyectoId)?.nombreProyecto || 'N/A',
    'Nombre': servicio.nombreServicio,
    'Estado': servicio.estado,
    'Total': servicio.total.toLocaleString(),
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
    console.log('Nuevo servicio:', formData);
    // Aquí iría la lógica para guardar en la base de datos
    setIsModalOpen(false);
    setFormData({
      proyectoId: '',
      nombreServicio: '',
      descripcion: '',
      precioUnitario: '',
      cantidad: 1,
      fechaInicio: '',
      fechaFin: '',
      unidadDeMedida: '',
      estado: 'Programado'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-6">
        <div className=" ">
          <h1 className="heading-1 text-[var(--color-primary)] mb-2">
            Servicios
          </h1>
          <p className="body-1 text-[var(--color-gray)]">
            Gestión de servicios y contratos
          </p>
        </div>
        <ButtonList buttons={buttons} />
        <DataTable headers={tableHeaders} data={tableData} />

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Añadir Nuevo Servicio"
          onSubmit={handleSubmit}
        >
          <div className="space-y-4">
            <div>
              <label className="block body-2 text-[var(--color-gray)] mb-1">Proyecto</label>
              <select
                name="proyectoId"
                value={formData.proyectoId}
                onChange={handleInputChange}
                className="w-full p-2 border    border-gray-450 rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                required
              >
                <option value="">Seleccionar proyecto</option>
                {mockDb.proyectos.map(proyecto => (
                  <option key={proyecto.proyectoId} value={proyecto.proyectoId}>
                    {proyecto.nombreProyecto}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block body-2 text-[var(--color-gray)] mb-1">Nombre del Servicio</label>
              <input
                type="text"
                name="nombreServicio"
                value={formData.nombreServicio}
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block body-2 text-[var(--color-gray)] mb-1">Precio Unitario</label>
                <input
                  type="number"
                  name="precioUnitario"
                  value={formData.precioUnitario}
                  onChange={handleInputChange}
                  className="w-full p-2 border    border-gray-450 rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
              <div>
                <label className="block body-2 text-[var(--color-gray)] mb-1">Cantidad</label>
                <input
                  type="number"
                  name="cantidad"
                  value={formData.cantidad}
                  onChange={handleInputChange}
                  className="w-full p-2 border    border-gray-450 rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  min="1"
                  required
                />
              </div>
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
              <label className="block body-2 text-[var(--color-gray)] mb-1">Unidad de Medida</label>
              <select
                name="unidadDeMedida"
                value={formData.unidadDeMedida}
                onChange={handleInputChange}
                className="w-full p-2 border    border-gray-450 rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                required
              >
                <option value="">Seleccionar unidad</option>
                <option value="visita técnica">Visita técnica</option>
                <option value="m²">Metro cuadrado</option>
                <option value="hora">Hora</option>
                <option value="día">Día</option>
                <option value="unidad">Unidad</option>
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
                <option value="Programado">Programado</option>
                <option value="En progreso">En progreso</option>
                <option value="Completado">Completado</option>
                <option value="Cancelado">Cancelado</option>
              </select>
            </div>
          </div>
        </Modal>
      </main>
    </div>
  );
}

export default ServiciosPage;
