import DataTable from '../components/DataTable';
import ButtonList from '../components/ButtonList';
import { mockDb } from '../../data/mockDb';

function InventarioPage() {
  const tableHeaders = ['Nombre', 'Categoria', 'Stock', 'Precio'];
  const tableData = mockDb.productos.map(producto => ({
    id: producto.productoId,
    'Nombre': producto.nombreProducto,
    'Categoria': mockDb.categorias.find(c => c.categoriaId === producto.categoriaId)?.nombreCategoria || 'N/A',
    'Stock': producto.cantidadEnStock,
    'Precio': producto.precioUnitario.toLocaleString(),
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
            Inventario
          </h1>
          <p className="body-1 text-[var(--color-gray)]">
            Gestión de productos y stock
          </p>
        </div>
        <ButtonList buttons={buttons} />
        <DataTable headers={tableHeaders} data={tableData} />
      </main>
    </div>
  );
}

export default InventarioPage;
