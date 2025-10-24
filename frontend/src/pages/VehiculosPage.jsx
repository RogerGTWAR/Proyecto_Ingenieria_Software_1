import DataTable from '../components/DataTable';
import ButtonList from '../components/ButtonList';
import { mockDb } from '../../data/mockDb';

function VehiculosPage() {
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
      action: () => console.log('Add clicked'),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-6">
        <div className="mb-8">
          <h1 className="heading-1 text-[var(--color-primary)] mb-2">
            Vehículos
          </h1>
          <p className="body-1 text-[var(--color-gray)]">
            Gestión de flota vehicular
          </p>
        </div>
        <ButtonList buttons={buttons} />
        <DataTable headers={tableHeaders} data={tableData} />
      </main>
    </div>
  );
}

export default VehiculosPage;
