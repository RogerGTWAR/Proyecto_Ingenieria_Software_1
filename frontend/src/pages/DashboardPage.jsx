import { useMemo } from "react";

import { useProyectos } from "../hooks/useProyectos";
import { useAvaluos } from "../hooks/useAvaluos";
import { useVehiculos } from "../hooks/useVehiculos";
import { useCompras } from "../hooks/useCompras";
import { useClientes } from "../hooks/useClientes";
import { useMateriales } from "../hooks/useMateriales";
import { useServicios } from "../hooks/useServicios";

export default function DashboardPage() {
  const { items: proyectos = [] } = useProyectos();
  const { items: avaluos = [] } = useAvaluos();
  const { items: vehiculos = [] } = useVehiculos();
  const { items: compras = [] } = useCompras();
  const { items: clientes = [] } = useClientes();
  const { items: materiales = [] } = useMateriales();
  const { items: servicios = [] } = useServicios();

  const money = (value) => Number(value ?? 0).toLocaleString("es-NI");

  const estadosValidosParaDinero = ["Activo", "En Espera", "Completado"];

  const proyectosValidosParaDinero = useMemo(() => {
    return proyectos.filter((p) => estadosValidosParaDinero.includes(p.estado));
  }, [proyectos]);

  const proyectosValidosIds = useMemo(() => {
    return new Set(proyectosValidosParaDinero.map((p) => Number(p.id)));
  }, [proyectosValidosParaDinero]);

  const totalProyectos = proyectos.length;

  const proyectosActivos = proyectos.filter((p) => p.estado === "Activo").length;

  const proyectosEnEspera = proyectos.filter(
    (p) => p.estado === "En Espera"
  ).length;

  const proyectosCompletados = proyectos.filter(
    (p) => p.estado === "Completado"
  ).length;

  const proyectosCancelados = proyectos.filter(
    (p) => p.estado === "Cancelado"
  ).length;

  const presupuestoValido = proyectosValidosParaDinero.reduce(
    (sum, p) => sum + Number(p.presupuestoTotal ?? 0),
    0
  );

  const totalAvaluos = avaluos.length;

  const avaluosValidos = avaluos.filter((a) =>
    proyectosValidosIds.has(Number(a.proyectoId))
  );

  const montoAvaluosValidos = avaluosValidos.reduce(
    (sum, a) => sum + Number(a.montoEjecutado ?? 0),
    0
  );

  const totalDiasAvaluos = avaluos.reduce(
    (sum, a) => sum + Number(a.tiempoTotalDias ?? 0),
    0
  );

  const totalClientes = clientes.length;

  const clientesConTelefono = clientes.filter((c) => c.telefono).length;

  const clientesConContacto = clientes.filter((c) => c.nombreContacto).length;

  const totalMateriales = materiales.length;

  const stockTotal = materiales.reduce(
    (sum, m) => sum + Number(m.cantidad_en_stock ?? 0),
    0
  );

  const valorInventario = materiales.reduce(
    (sum, m) =>
      sum + Number(m.cantidad_en_stock ?? 0) * Number(m.precio_unitario ?? 0),
    0
  );

  const materialesBajoStock = materiales.filter((m) => {
    const stock = Number(m.cantidad_en_stock ?? 0);
    const minimo = Number(m.stock_minimo ?? 0);

    if (!m.stock_minimo && m.stock_minimo !== 0) return false;

    return stock <= minimo;
  }).length;

  const totalServicios = servicios.length;

  const totalCostoDirectoServicios = servicios.reduce(
    (sum, s) => sum + Number(s.totalCostoDirecto ?? 0),
    0
  );

  const totalCostoVentaServicios = servicios.reduce(
    (sum, s) => sum + Number(s.costoVenta ?? 0),
    0
  );

  const vehiculosDisponibles = vehiculos.filter(
    (v) => v.estado === "Disponible"
  ).length;

  const vehiculosMantenimiento = vehiculos.filter(
    (v) => v.estado === "En Mantenimiento"
  ).length;

  const vehiculosNoDisponibles = vehiculos.filter(
    (v) => v.estado === "No Disponible"
  ).length;

  const comprasPagadas = compras.filter((c) => c.estado === "Pagada").length;

  const comprasPendientes = compras.filter(
    (c) => c.estado === "Pendiente"
  ).length;

  const totalCompras = compras.reduce(
    (sum, c) => sum + Number(c.monto_total ?? c.montoTotal ?? 0),
    0
  );

  const proyectosRecientes = [...proyectos]
    .sort((a, b) => new Date(b.fechaInicio || 0) - new Date(a.fechaInicio || 0))
    .slice(0, 6);

  const proyectosConMasAvaluos = proyectos
    .map((p) => {
      const avaluosProyecto = avaluos.filter(
        (a) => Number(a.proyectoId) === Number(p.id)
      );

      const montoEjecutado = avaluosProyecto.reduce(
        (sum, a) => sum + Number(a.montoEjecutado ?? 0),
        0
      );

      return {
        ...p,
        cantidadAvaluos: avaluosProyecto.length,
        montoEjecutado,
      };
    })
    .sort((a, b) => b.cantidadAvaluos - a.cantidadAvaluos)
    .slice(0, 6);

  const materialesMayorValor = [...materiales]
    .map((m) => ({
      ...m,
      valorTotal:
        Number(m.cantidad_en_stock ?? 0) * Number(m.precio_unitario ?? 0),
    }))
    .sort((a, b) => b.valorTotal - a.valorTotal)
    .slice(0, 6);

  const serviciosMasCostosos = [...servicios]
    .sort((a, b) => Number(b.costoVenta ?? 0) - Number(a.costoVenta ?? 0))
    .slice(0, 6);

  const alertas =
    proyectosCancelados + vehiculosNoDisponibles + comprasPendientes;

  return (
    <div className="h-[calc(100dvh-64px)] w-full overflow-y-auto overflow-x-hidden bg-slate-200 px-3 py-4 sm:px-4 lg:px-5 xl:px-6">
      <div className="flex min-h-full w-full min-w-0 flex-col gap-5 pb-8">
        <section className="w-full shrink-0 overflow-hidden rounded-3xl border border-slate-700/40 bg-slate-900 shadow-xl">
          <div className="w-full bg-gradient-to-r from-slate-950 via-blue-950 to-cyan-900 px-5 py-6 text-white sm:px-7 lg:px-8">
            <div className="flex w-full flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
              <div className="min-w-0 flex-1">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-3xl border border-white/10 bg-white/10 shadow-sm">
                  <img
                    src="/icons/dashboard.svg"
                    alt="Dashboard"
                    className="h-7 w-7 brightness-0 invert"
                  />
                </div>

                <p className="text-sm font-medium text-cyan-100">
                  Panel administrativo
                </p>

                <h1 className="mt-1 text-xl font-extrabold tracking-tight text-white sm:text-2xl">
                  Dashboard Principal
                </h1>

                <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
                  Resumen general de proyectos, avalúos, clientes, inventario,
                  servicios, vehículos y compras del sistema ACONSA.
                </p>
              </div>

              <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-3 xl:w-[680px]">
                <HeaderBox
                  label="Presupuesto válido"
                  value={`C$${money(presupuestoValido)}`}
                  text="Sin proyectos cancelados"
                />

                <HeaderBox
                  label="Avalúos válidos"
                  value={`C$${money(montoAvaluosValidos)}`}
                  text={`${avaluosValidos.length} avalúo(s)`}
                />

                <HeaderBox
                  label="Valor inventario"
                  value={`C$${money(valorInventario)}`}
                  text={`${totalMateriales} material(es)`}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            title="Proyectos"
            value={totalProyectos}
            subtitle="Total registrados"
            icon="/icons/projects.svg"
            color="blue"
            items={[
              { label: "Activos", value: proyectosActivos },
              { label: "En espera", value: proyectosEnEspera },
            ]}
          />

          <MetricCard
            title="Avalúos"
            value={totalAvaluos}
            subtitle={`Días totales: ${totalDiasAvaluos}`}
            icon="/icons/avaluos.svg"
            color="teal"
            items={[
              { label: "Válidos", value: avaluosValidos.length },
              { label: "Monto", value: `C$${money(montoAvaluosValidos)}` },
            ]}
          />

          <MetricCard
            title="Clientes"
            value={totalClientes}
            subtitle="Empresas registradas"
            icon="/icons/clients.svg"
            color="cyan"
            items={[
              { label: "Con contacto", value: clientesConContacto },
              { label: "Con teléfono", value: clientesConTelefono },
            ]}
          />

          <MetricCard
            title="Compras"
            value={compras.length}
            subtitle={`Total: C$${money(totalCompras)}`}
            icon="/icons/buy.svg"
            color="purple"
            items={[
              { label: "Pagadas", value: comprasPagadas },
              { label: "Pendientes", value: comprasPendientes },
            ]}
          />
        </section>

        <section className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            title="Inventario"
            value={totalMateriales}
            subtitle={`Stock total: ${stockTotal.toLocaleString("es-NI")}`}
            icon="/icons/inventory.svg"
            color="amber"
            items={[
              { label: "Bajo stock", value: materialesBajoStock },
              { label: "Valor", value: `C$${money(valorInventario)}` },
            ]}
          />

          <MetricCard
            title="Servicios"
            value={totalServicios}
            subtitle={`Venta: C$${money(totalCostoVentaServicios)}`}
            icon="/icons/tool.svg"
            color="rose"
            items={[
              {
                label: "Costo directo",
                value: `C$${money(totalCostoDirectoServicios)}`,
              },
              { label: "Registrados", value: totalServicios },
            ]}
          />

          <MetricCard
            title="Vehículos"
            value={vehiculos.length}
            subtitle="Flota registrada"
            icon="/icons/car.svg"
            color="emerald"
            items={[
              { label: "Disponibles", value: vehiculosDisponibles },
              { label: "Mantenimiento", value: vehiculosMantenimiento },
            ]}
          />

          <MetricCard
            title="Alertas"
            value={alertas}
            subtitle="Elementos que requieren revisión"
            icon="/icons/alert.svg"
            color="red"
            items={[
              { label: "Cancelados", value: proyectosCancelados },
              { label: "No disponibles", value: vehiculosNoDisponibles },
            ]}
          />
        </section>

        <section className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatusCard
            title="Proyectos completados"
            value={proyectosCompletados}
            text="Finalizados correctamente"
            color="blue"
          />

          <StatusCard
            title="Proyectos cancelados"
            value={proyectosCancelados}
            text="No suman al presupuesto válido"
            color="red"
          />

          <StatusCard
            title="Compras pendientes"
            value={comprasPendientes}
            text="Pendientes de pago o revisión"
            color="amber"
          />

          <StatusCard
            title="Materiales bajo stock"
            value={materialesBajoStock}
            text="Requieren revisión de inventario"
            color="purple"
          />
        </section>

        <section className="grid w-full grid-cols-1 gap-5 xl:grid-cols-[1.4fr_0.8fr]">
          <Panel
            title="Proyectos recientes"
            description="Últimos proyectos registrados con presupuesto, estado y avalúos asociados."
            badge={`${proyectosRecientes.length} registro(s)`}
          >
            <div className="max-h-[520px] overflow-y-auto overflow-x-auto pr-1">
              <div className="hidden min-w-[780px] overflow-hidden rounded-2xl border border-slate-300 bg-slate-100 xl:block">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 z-10 bg-gradient-to-r from-slate-950 via-blue-950 to-cyan-900 text-white">
                    <tr>
                      <th className="px-5 py-4 text-left font-bold">
                        Proyecto
                      </th>

                      <th className="px-5 py-4 text-center font-bold">
                        Estado
                      </th>

                      <th className="px-5 py-4 text-right font-bold">
                        Presupuesto
                      </th>

                      <th className="px-5 py-4 text-center font-bold">
                        Inicio
                      </th>

                      <th className="px-5 py-4 text-center font-bold">
                        Avalúos
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-300">
                    {proyectosRecientes.length > 0 ? (
                      proyectosRecientes.map((p, index) => {
                        const cantidadAvaluos = avaluos.filter(
                          (a) => Number(a.proyectoId) === Number(p.id)
                        ).length;

                        return (
                          <tr
                            key={p.id}
                            className={`
                              transition hover:bg-blue-50
                              ${index % 2 === 0 ? "bg-white" : "bg-slate-50"}
                            `}
                          >
                            <td className="px-5 py-4">
                              <p className="font-bold text-slate-900">
                                {p.nombreProyecto || "—"}
                              </p>

                              <p className="mt-1 text-sm text-slate-600">
                                {p.clienteNombre || "Sin cliente"}
                              </p>
                            </td>

                            <td className="px-5 py-4 text-center">
                              <EstadoBadge estado={p.estado} />
                            </td>

                            <td className="px-5 py-4 text-right font-bold text-emerald-700">
                              C${money(p.presupuestoTotal)}
                            </td>

                            <td className="px-5 py-4 text-center font-medium text-slate-700">
                              {p.fechaInicio || "—"}
                            </td>

                            <td className="px-5 py-4 text-center">
                              <span className="rounded-full border border-blue-200 bg-blue-100 px-3 py-1 text-sm font-bold text-blue-800">
                                {cantidadAvaluos}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan="5"
                          className="px-5 py-10 text-center text-sm font-bold text-slate-500"
                        >
                          No hay proyectos registrados.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="grid grid-cols-1 gap-3 xl:hidden">
                {proyectosRecientes.length > 0 ? (
                  proyectosRecientes.map((p) => {
                    const cantidadAvaluos = avaluos.filter(
                      (a) => Number(a.proyectoId) === Number(p.id)
                    ).length;

                    return (
                      <div
                        key={p.id}
                        className="rounded-2xl border border-slate-300 bg-slate-200 p-4 shadow-sm"
                      >
                        <div className="mb-4 border-b border-slate-300 pb-3">
                          <p className="text-sm font-bold text-slate-900">
                            {p.nombreProyecto || "—"}
                          </p>

                          <p className="mt-1 text-sm text-slate-600">
                            {p.clienteNombre || "Sin cliente"}
                          </p>
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <MiniBox
                            label="Presupuesto"
                            value={`C$${money(p.presupuestoTotal)}`}
                          />

                          <MiniBox label="Avalúos" value={cantidadAvaluos} />

                          <MiniBox label="Inicio" value={p.fechaInicio || "—"} />

                          <div className="rounded-xl border border-slate-300 bg-slate-100 p-3">
                            <p className="text-sm font-semibold text-slate-600">
                              Estado
                            </p>

                            <div className="mt-2">
                              <EstadoBadge estado={p.estado} />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <EmptyBox text="No hay proyectos registrados." />
                )}
              </div>
            </div>
          </Panel>

          <div className="flex flex-col gap-5">
            <Panel
              title="Estado de vehículos"
              description="Distribución general de la flota registrada."
            >
              <div className="grid max-h-[360px] grid-cols-1 gap-3 overflow-y-auto pr-1">
                <ProgressItem
                  label="Disponibles"
                  value={vehiculosDisponibles}
                  total={vehiculos.length}
                  color="emerald"
                />

                <ProgressItem
                  label="En mantenimiento"
                  value={vehiculosMantenimiento}
                  total={vehiculos.length}
                  color="amber"
                />

                <ProgressItem
                  label="No disponibles"
                  value={vehiculosNoDisponibles}
                  total={vehiculos.length}
                  color="red"
                />
              </div>
            </Panel>

            <Panel
              title="Proyectos con más avalúos"
              description="Ordenados por cantidad de avalúos registrados."
            >
              <div className="max-h-[420px] space-y-3 overflow-y-auto pr-1">
                {proyectosConMasAvaluos.length > 0 ? (
                  proyectosConMasAvaluos.map((p) => (
                    <InfoListItem
                      key={p.id}
                      title={p.nombreProyecto || "—"}
                      subtitle={`Monto ejecutado: C$${money(p.montoEjecutado)}`}
                      badge={p.cantidadAvaluos}
                    />
                  ))
                ) : (
                  <EmptyBox text="No hay datos de avalúos." />
                )}
              </div>
            </Panel>
          </div>
        </section>

        <section className="grid w-full grid-cols-1 gap-5 xl:grid-cols-2">
          <Panel
            title="Materiales de mayor valor"
            description="Calculado por stock disponible y precio unitario."
          >
            <div className="max-h-[420px] space-y-3 overflow-y-auto pr-1">
              {materialesMayorValor.length > 0 ? (
                materialesMayorValor.map((m) => (
                  <InfoListItem
                    key={m.id}
                    title={m.nombre_material || "—"}
                    subtitle={`Stock: ${Number(
                      m.cantidad_en_stock ?? 0
                    ).toLocaleString("es-NI")}`}
                    badge={`C$${money(m.valorTotal)}`}
                    green
                  />
                ))
              ) : (
                <EmptyBox text="No hay materiales registrados." />
              )}
            </div>
          </Panel>

          <Panel
            title="Servicios con mayor costo de venta"
            description="Primeros servicios ordenados por costo de venta."
          >
            <div className="max-h-[420px] space-y-3 overflow-y-auto pr-1">
              {serviciosMasCostosos.length > 0 ? (
                serviciosMasCostosos.map((s) => (
                  <InfoListItem
                    key={s.id}
                    title={s.nombreServicio || "—"}
                    subtitle={`Costo directo: C$${money(s.totalCostoDirecto)}`}
                    badge={`C$${money(s.costoVenta)}`}
                    green
                  />
                ))
              ) : (
                <EmptyBox text="No hay servicios registrados." />
              )}
            </div>
          </Panel>
        </section>
      </div>
    </div>
  );
}

const HeaderBox = ({ label, value, text }) => (
  <div className="rounded-2xl border border-white/10 bg-slate-900/50 px-4 py-3 text-left shadow-sm backdrop-blur xl:text-right">
    <p className="text-sm font-medium text-cyan-100">{label}</p>
    <p className="mt-1 truncate text-sm font-bold text-white">{value}</p>
    <p className="mt-1 text-xs font-medium text-slate-300">{text}</p>
  </div>
);

const MetricCard = ({ title, value, subtitle, icon, color = "blue", items }) => {
  const colorClass = {
    blue: "border-blue-200 bg-blue-100",
    cyan: "border-cyan-200 bg-cyan-100",
    emerald: "border-emerald-200 bg-emerald-100",
    amber: "border-amber-200 bg-amber-100",
    purple: "border-purple-200 bg-purple-100",
    rose: "border-rose-200 bg-rose-100",
    teal: "border-teal-200 bg-teal-100",
    red: "border-red-200 bg-red-100",
  };

  const valueClass = {
    blue: "text-blue-800",
    cyan: "text-cyan-800",
    emerald: "text-emerald-800",
    amber: "text-amber-800",
    purple: "text-purple-800",
    rose: "text-rose-800",
    teal: "text-teal-800",
    red: "text-red-800",
  };

  return (
    <div className="group min-h-[205px] overflow-hidden rounded-3xl border border-slate-300 bg-slate-100 shadow-md transition hover:-translate-y-1 hover:border-blue-400 hover:shadow-xl">
      <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-cyan-900 px-5 py-4 text-white">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-medium text-cyan-100">Indicador</p>

          <span
            className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${
              colorClass[color] || colorClass.blue
            }`}
          >
            <img src={icon} alt={title} className="h-6 w-6" />
          </span>
        </div>

        <h3 className="mt-2 truncate text-sm font-bold text-white">{title}</h3>
      </div>

      <div className="p-5">
        <div className="flex items-end justify-between gap-3">
          <p
            className={`text-3xl font-extrabold ${
              valueClass[color] || valueClass.blue
            }`}
          >
            {value}
          </p>

          <p className="text-right text-sm font-medium text-slate-600">
            {subtitle}
          </p>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {items.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-slate-300 bg-slate-200 p-3 shadow-sm"
            >
              <p className="text-sm font-semibold text-slate-600">
                {item.label}
              </p>

              <p className="mt-1 truncate text-sm font-extrabold text-slate-900">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const StatusCard = ({ title, value, text, color = "blue" }) => {
  const styles = {
    blue: "from-blue-800 to-cyan-700",
    red: "from-red-700 to-rose-800",
    amber: "from-amber-500 to-orange-700",
    purple: "from-purple-700 to-indigo-800",
  };

  return (
    <div
      className={`
        min-h-[135px] rounded-3xl border border-slate-700/20
        bg-gradient-to-r p-5 text-white shadow-md transition
        hover:-translate-y-1 hover:shadow-xl
        ${styles[color] || styles.blue}
      `}
    >
      <p className="text-sm font-bold text-white/90">{title}</p>

      <p className="mt-2 text-3xl font-extrabold text-white">{value}</p>

      <p className="mt-1 text-sm font-medium text-white/80">{text}</p>
    </div>
  );
};

const Panel = ({ title, description, badge, children }) => (
  <section className="rounded-3xl border border-slate-300 bg-slate-100 p-4 shadow-md sm:p-5">
    <div className="mb-4 flex flex-col gap-2 border-b border-slate-300 pb-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-sm font-bold text-slate-900">{title}</h2>

        <p className="mt-1 text-sm text-slate-600">{description}</p>
      </div>

      {badge && (
        <span className="w-fit rounded-full border border-blue-200 bg-blue-100 px-4 py-2 text-sm font-bold text-blue-800">
          {badge}
        </span>
      )}
    </div>

    {children}
  </section>
);

const MiniBox = ({ label, value }) => (
  <div className="rounded-xl border border-slate-300 bg-slate-100 p-3 shadow-sm">
    <p className="text-sm font-bold text-slate-600">{label}</p>

    <p className="mt-1 truncate text-sm font-extrabold text-slate-900">
      {value}
    </p>
  </div>
);

const EstadoBadge = ({ estado }) => {
  const styles = {
    Activo: "border-emerald-200 bg-emerald-100 text-emerald-800",
    "En Espera": "border-amber-200 bg-amber-100 text-amber-800",
    Completado: "border-blue-200 bg-blue-100 text-blue-800",
    Cancelado: "border-red-200 bg-red-100 text-red-800",
    "En ejecución": "border-emerald-200 bg-emerald-100 text-emerald-800",
  };

  return (
    <span
      className={`
        rounded-full border px-3 py-1 text-sm font-bold
        ${styles[estado] || "border-slate-300 bg-slate-200 text-slate-700"}
      `}
    >
      {estado || "—"}
    </span>
  );
};

const ProgressItem = ({ label, value, total, color = "emerald" }) => {
  const percent =
    total > 0 ? Math.round((Number(value) / Number(total)) * 100) : 0;

  const barClass = {
    emerald: "from-emerald-500 to-emerald-700",
    amber: "from-amber-500 to-orange-600",
    red: "from-red-500 to-rose-700",
  };

  const textClass = {
    emerald: "text-emerald-800",
    amber: "text-amber-800",
    red: "text-red-800",
  };

  return (
    <div className="rounded-2xl border border-slate-300 bg-slate-200 p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className={`text-sm font-extrabold ${textClass[color]}`}>
          {label}
        </p>

        <p className="text-sm font-bold text-slate-700">
          {value}/{total || 0}
        </p>
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${
            barClass[color] || barClass.emerald
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>

      <p className="mt-2 text-sm font-semibold text-slate-600">
        {percent}% del total
      </p>
    </div>
  );
};

const InfoListItem = ({ title, subtitle, badge, green = false }) => (
  <div className="rounded-2xl border border-slate-300 bg-slate-200 p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-400 hover:bg-blue-100 hover:shadow-md">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <p className="truncate text-sm font-extrabold text-slate-900">
          {title}
        </p>

        <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
      </div>

      <span
        className={`
          w-fit shrink-0 rounded-full border px-3 py-1 text-sm font-bold
          ${
            green
              ? "border-emerald-200 bg-emerald-100 text-emerald-800"
              : "border-blue-200 bg-blue-100 text-blue-800"
          }
        `}
      >
        {badge}
      </span>
    </div>
  </div>
);

const EmptyBox = ({ text }) => (
  <div className="rounded-2xl border border-dashed border-slate-400 bg-slate-200 px-6 py-8 text-center">
    <p className="text-sm font-bold text-slate-700">{text}</p>
  </div>
);