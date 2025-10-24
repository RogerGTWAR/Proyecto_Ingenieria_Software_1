import DataTable from '../components/DataTable';
import ButtonList from '../components/ButtonList';
import { mockDb } from '../../data/mockDb';

function ServiciosPage() {
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
      action: () => console.log('Add clicked'),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-6">
        <div className="mb-8">
          <h1 className="heading-1 text-[var(--color-primary)] mb-2">
            Servicios
          </h1>
          <p className="body-1 text-[var(--color-gray)]">
            Gestión de servicios y contratos
          </p>
        </div>
        <ButtonList buttons={buttons} />
        <DataTable headers={tableHeaders} data={tableData} />
      </main>
    </div>
  );
}

export default ServiciosPage;
