import DataTable from '../components/DataTable';
import ButtonList from '../components/ButtonList';
import { mockDb } from '../../data/mockDb';

function ComprasPage() {
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
      action: () => console.log('Add clicked'),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-6">
        <div className="mb-8">
          <h1 className="heading-1 text-[var(--color-primary)] mb-2">
            Compras
          </h1>
          <p className="body-1 text-[var(--color-gray)]">
            Gestión de compras y proveedores
          </p>
        </div>
        <ButtonList buttons={buttons} />
        <DataTable headers={tableHeaders} data={tableData} />
      </main>
    </div>
  );
}

export default ComprasPage;
