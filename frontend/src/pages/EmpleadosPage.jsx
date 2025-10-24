import DataTable from '../components/DataTable';
import ButtonList from '../components/ButtonList';
import { mockDb } from '../../data/mockDb';

function EmpleadosPage() {
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
      action: () => console.log('Add clicked'),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-6">
        <div className="mb-8">
          <h1 className="heading-1 text-[var(--color-primary)] mb-2">
            Empleados
          </h1>
          <p className="body-1 text-[var(--color-gray)]">
            Gestión del personal de la empresa
          </p>
        </div>
        <ButtonList buttons={buttons} />
        <DataTable headers={tableHeaders} data={tableData} />
      </main>
    </div>
  );
}

export default EmpleadosPage;
