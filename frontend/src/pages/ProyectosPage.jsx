import DataTable from '../components/DataTable';
import ButtonList from '../components/ButtonList';
import { mockDb } from '../../data/mockDb';

function ProyectosPage() {
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
      action: () => console.log('Add clicked'),
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



  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-6">
        <div className="mb-8">
          <h1 className="heading-1 text-[var(--color-primary)] mb-2">
            Proyectos
          </h1>
          <p className="body-1 text-[var(--color-gray)]">
            Gestión de proyectos y avances
          </p>
        </div>
        <ButtonList buttons={buttons} />

        <DataTable headers={tableHeaders} data={tableData} />
      </main>
    </div>
  );
}

export default ProyectosPage;
