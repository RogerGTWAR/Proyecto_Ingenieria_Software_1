import DataTable from "../components/DataTable";
import Card from "../components/Card";

import { useProyectos } from "../hooks/useProyectos";
import { useAvaluos } from "../hooks/useAvaluos";
import { useVehiculos } from "../hooks/useVehiculos";
import { useCompras } from "../hooks/useCompras";

export default function DashboardPage() {
  const { items: proyectos } = useProyectos();
  const { items: avaluos } = useAvaluos();
  const { items: vehiculos } = useVehiculos();
  const { items: compras } = useCompras();

  const tableHeaders = ["Nombre", "Estado", "Fecha Inicio", "Presupuesto", "Avalúos"];

  const tableData = proyectos.map((p) => {
    const cantidadAvaluos = avaluos.filter(
      (a) => Number(a.proyectoId) === Number(p.id)
    ).length;

    return {
      id: p.id,
      Nombre: p.nombreProyecto,
      Estado: p.estado,
      "Fecha Inicio": p.fechaInicio ?? "—",
      Presupuesto: `C$ ${ (p.presupuestoTotal ?? 0).toLocaleString("es-NI") }`,
      Avaluos: cantidadAvaluos,
    };
  });

  const proyectosActivos = proyectos.filter(
    (p) => p.estado === "En ejecución" || p.estado === "Activo"
  ).length;

  const totalAvaluos = avaluos.length;

  const vehiculosOperativos = vehiculos.filter(
    (v) => v.estado === "No Disponible"
  ).length;

  const totalCompras = compras.reduce((sum, c) => sum + c.monto_total, 0);

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <main className="p-6">

        <div>
          <h1 className="text-3xl font-bold text-[var(--color-primary)] mb-2">
            Dashboard Principal
          </h1>
          <p className="text-gray-600">
            Resumen general del sistema ACONSA
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-8">

          <Card title="Proyectos">
            <p className="text-gray-600">Total: {proyectos.length}</p>
            <p className="font-semibold text-[var(--color-primary)]">
              Activos: {proyectosActivos}
            </p>
          </Card>

          <Card title="Avalúos Realizados">
            <p className="text-gray-600">Total registrados:</p>
            <p className="font-semibold text-[var(--color-primary)]">
              {totalAvaluos}
            </p>
          </Card>

          <Card title="Vehículos Operativos">
            <p className="text-gray-600">Registrados: {vehiculos.length}</p>
            <p className="font-semibold text-[var(--color-primary)]">
              Operativos: {vehiculosOperativos}
            </p>
          </Card>

          <Card title="Total en Compras">
            <p className="text-gray-600">Monto invertido:</p>
            <p className="font-semibold text-[var(--color-primary)]">
              C${totalCompras.toLocaleString("es-NI")}
            </p>
          </Card>

        </div>

        <div className="mt-8 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">

          <div className="grid grid-cols-5 font-semibold text-[#1A2E81] bg-gray-100 p-3 border-b">
            <span>Proyecto</span>
            <span>Estado</span>
            <span>Presupuesto</span>
            <span>Fecha Inicio</span>
            <span>Avalúos</span>
          </div>

          <div className="divide-y divide-gray-200">
            {tableData.length > 0 ? (
              tableData.map((p, idx) => (
                <div
                  key={p.id}
                  className={`grid grid-cols-5 items-center px-3 py-2 ${
                    idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-gray-100 transition`}
                >
                  <span>{p.Nombre}</span>

                  <span className="font-medium">{p.Estado}</span>

                  <span className="font-semibold text-green-700">
                    {p.Presupuesto}
                  </span>

                  <span>{p["Fecha Inicio"]}</span>

                  <span className="text-left font-semibold text-[#1A2E81]">
                    {p.Avaluos}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-4">
                No hay proyectos registrados.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
