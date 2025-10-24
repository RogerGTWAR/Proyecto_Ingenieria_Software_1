import ButtonList from '../components/ButtonList';
import DataTable from '../components/DataTable';
import Card from '../components/Card';
import { mockDb } from '../../data/mockDb';

function DashboardPage() {


  const tableHeaders = ['Nombre', 'Cliente', 'Estado', 'Presupuesto'];
  const tableData = mockDb.proyectos.map(proyecto => ({
    id: proyecto.proyectoId,
    'Nombre': proyecto.nombreProyecto,
    'Cliente': mockDb.clientes.find(c => c.clienteId === proyecto.clienteId)?.nombreEmpresa || 'N/A',
    'Estado': proyecto.estado,
    'Presupuesto': proyecto.presupuestoInicial.toLocaleString(),
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-6">
        <div className=" ">
          <h1 className="heading-1 text-[var(--color-primary)] mb-2">
            Dashboard Principal
          </h1>
          <p className="body-1 text-[var(--color-gray)]">
            Bienvenido al sistema de gestión ACONSA
          </p>
        </div>


        {/* Data Table Component */}
        <div className="mt-8">
          <DataTable headers={tableHeaders} data={tableData} />
        </div>

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6  ">
          <Card title="Proyectos Activos">
            <p className="body-2 text-[var(--color-gray)]">
              Total de proyectos: {mockDb.proyectos.length}
            </p>
            <p className="body-2 text-[var(--color-gray)]">
              En ejecución: {mockDb.proyectos.filter(p => p.estado === 'En ejecución').length}
            </p>
          </Card>

          <Card title="Empleados">
            <p className="body-2 text-[var(--color-gray)]">
              Total de empleados: {mockDb.empleados.length}
            </p>
            <p className="body-2 text-[var(--color-gray)]">
              Activos: {mockDb.empleados.filter(e => e.fechaEliminacion === null).length}
            </p>
          </Card>

          <Card title="Vehículos">
            <p className="body-2 text-[var(--color-gray)]">
              Total de vehículos: {mockDb.vehiculos.length}
            </p>
            <p className="body-2 text-[var(--color-gray)]">
              Operativos: {mockDb.vehiculos.filter(v => v.estado === 'Operativo').length}
            </p>
          </Card>
        </div>

        
      </main>
    </div>
  );
}

export default DashboardPage;
