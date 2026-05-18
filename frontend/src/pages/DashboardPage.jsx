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

  return (
    <div className="h-full w-full overflow-hidden bg-gradient-to-br from-sky-100 via-cyan-50 to-emerald-100">
      <div className="h-full w-full overflow-y-auto overflow-x-hidden px-3 py-5 sm:px-5 lg:px-8">
        <div className="mx-auto flex w-full max-w-[1800px] flex-col gap-6 pb-10">
          <section className="overflow-hidden rounded-[2rem] border border-cyan-300 bg-slate-950 shadow-2xl shadow-cyan-900/20">
            <div className="bg-gradient-to-r from-slate-950 via-blue-900 to-cyan-700 px-5 py-6 text-white sm:px-7 lg:px-8">
              <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-bold uppercase tracking-wide text-cyan-200">
                    Panel Administrativo
                  </p>

                  <h1 className="mt-2 text-xl font-extrabold tracking-tight text-white sm:text-2xl">
                    Dashboard Principal
                  </h1>

                  <p className="mt-2 max-w-3xl text-sm leading-6 text-cyan-50">
                    Resumen general de proyectos, avalúos, clientes, inventario,
                    servicios, vehículos y compras del sistema ACONSA.
                  </p>
                </div>

                <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-3 xl:w-[720px]">
                  <HeroStat
                    label="Presupuesto válido"
                    value={`C$${money(presupuestoValido)}`}
                    description="Sin proyectos cancelados"
                  />

                  <HeroStat
                    label="Avalúos válidos"
                    value={`C$${money(montoAvaluosValidos)}`}
                    description={`${avaluosValidos.length} avalúo(s)`}
                  />

                  <HeroStat
                    label="Valor inventario"
                    value={`C$${money(valorInventario)}`}
                    description={`${totalMateriales} material(es)`}
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MainMetric
              title="Proyectos"
              value={totalProyectos}
              subtitle="Total registrados"
              firstLabel="Activos"
              firstValue={proyectosActivos}
              secondLabel="En espera"
              secondValue={proyectosEnEspera}
              variant="blue"
            />

            <MainMetric
              title="Avalúos"
              value={totalAvaluos}
              subtitle={`Días totales: ${totalDiasAvaluos}`}
              firstLabel="Válidos"
              firstValue={avaluosValidos.length}
              secondLabel="Monto"
              secondValue={`C$${money(montoAvaluosValidos)}`}
              variant="emerald"
            />

            <MainMetric
              title="Clientes"
              value={totalClientes}
              subtitle="Empresas registradas"
              firstLabel="Con contacto"
              firstValue={clientesConContacto}
              secondLabel="Con teléfono"
              secondValue={clientesConTelefono}
              variant="cyan"
            />

            <MainMetric
              title="Compras"
              value={compras.length}
              subtitle={`Total: C$${money(totalCompras)}`}
              firstLabel="Pagadas"
              firstValue={comprasPagadas}
              secondLabel="Pendientes"
              secondValue={comprasPendientes}
              variant="amber"
            />
          </section>

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MainMetric
              title="Inventario"
              value={totalMateriales}
              subtitle={`Stock total: ${stockTotal.toLocaleString("es-NI")}`}
              firstLabel="Bajo stock"
              firstValue={materialesBajoStock}
              secondLabel="Valor"
              secondValue={`C$${money(valorInventario)}`}
              variant="violet"
            />

            <MainMetric
              title="Servicios"
              value={totalServicios}
              subtitle={`Venta: C$${money(totalCostoVentaServicios)}`}
              firstLabel="Directos"
              firstValue={`C$${money(totalCostoDirectoServicios)}`}
              secondLabel="Registrados"
              secondValue={totalServicios}
              variant="green"
            />

            <MainMetric
              title="Vehículos"
              value={vehiculos.length}
              subtitle="Flota registrada"
              firstLabel="Disponibles"
              firstValue={vehiculosDisponibles}
              secondLabel="Mantenimiento"
              secondValue={vehiculosMantenimiento}
              variant="sky"
            />

            <MainMetric
              title="Alertas"
              value={
                proyectosCancelados + vehiculosNoDisponibles + comprasPendientes
              }
              subtitle="Elementos que requieren revisión"
              firstLabel="Cancelados"
              firstValue={proyectosCancelados}
              secondLabel="No disponibles"
              secondValue={vehiculosNoDisponibles}
              variant="red"
            />
          </section>

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatusCard
              title="Proyectos completados"
              value={proyectosCompletados}
              text="Finalizados correctamente"
              variant="blue"
            />

            <StatusCard
              title="Proyectos cancelados"
              value={proyectosCancelados}
              text="No suman al presupuesto válido"
              variant="red"
            />

            <StatusCard
              title="Compras pendientes"
              value={comprasPendientes}
              text="Pendientes de pago o revisión"
              variant="amber"
            />

            <StatusCard
              title="Materiales bajo stock"
              value={materialesBajoStock}
              text="Requieren revisión de inventario"
              variant="violet"
            />
          </section>

          <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.35fr_0.9fr]">
            <Panel
              title="Proyectos recientes"
              description="Últimos proyectos registrados con presupuesto, estado y avalúos asociados."
              badge={`${proyectosRecientes.length} registro(s)`}
            >
              <div className="max-h-[520px] overflow-y-auto overflow-x-auto pr-1">
                <div className="hidden min-w-[780px] overflow-hidden rounded-3xl border border-cyan-200 bg-white xl:block">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 z-10 bg-gradient-to-r from-slate-950 to-cyan-800 text-white">
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

                    <tbody className="divide-y divide-cyan-100">
                      {proyectosRecientes.length > 0 ? (
                        proyectosRecientes.map((p, index) => {
                          const cantidadAvaluos = avaluos.filter(
                            (a) => Number(a.proyectoId) === Number(p.id)
                          ).length;

                          return (
                            <tr
                              key={p.id}
                              className={`
                                transition hover:bg-cyan-100
                                ${index % 2 === 0 ? "bg-white" : "bg-cyan-50"}
                              `}
                            >
                              <td className="px-5 py-4">
                                <p className="font-bold text-slate-900">
                                  {p.nombreProyecto || "—"}
                                </p>

                                <p className="mt-1 text-sm font-medium text-slate-600">
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
                                <span className="rounded-full border border-cyan-300 bg-cyan-100 px-3 py-1 text-sm font-bold text-cyan-800">
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
                          className="rounded-2xl border border-cyan-200 bg-white p-4 shadow-md"
                        >
                          <div className="mb-4 border-b border-cyan-100 pb-3">
                            <p className="text-sm font-bold text-slate-900">
                              {p.nombreProyecto || "—"}
                            </p>

                            <p className="mt-1 text-sm font-medium text-slate-600">
                              {p.clienteNombre || "Sin cliente"}
                            </p>
                          </div>

                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <MiniBox
                              label="Presupuesto"
                              value={`C$${money(p.presupuestoTotal)}`}
                              green
                            />

                            <MiniBox label="Avalúos" value={cantidadAvaluos} />

                            <MiniBox
                              label="Inicio"
                              value={p.fechaInicio || "—"}
                            />

                            <div className="rounded-xl border border-cyan-200 bg-cyan-50 p-3">
                              <p className="text-sm font-semibold text-cyan-800">
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

            <div className="grid grid-cols-1 gap-6">
              <Panel
                title="Estado de vehículos"
                description="Distribución general de la flota."
              >
                <div className="grid max-h-[360px] grid-cols-1 gap-3 overflow-y-auto pr-1">
                  <ProgressItem
                    label="Disponibles"
                    value={vehiculosDisponibles}
                    total={vehiculos.length}
                    variant="green"
                  />

                  <ProgressItem
                    label="En mantenimiento"
                    value={vehiculosMantenimiento}
                    total={vehiculos.length}
                    variant="amber"
                  />

                  <ProgressItem
                    label="No disponibles"
                    value={vehiculosNoDisponibles}
                    total={vehiculos.length}
                    variant="red"
                  />
                </div>
              </Panel>

              <Panel
                title="Proyectos con más avalúos"
                description="Ordenados por cantidad de avalúos."
              >
                <div className="max-h-[420px] space-y-3 overflow-y-auto pr-1">
                  {proyectosConMasAvaluos.length > 0 ? (
                    proyectosConMasAvaluos.map((p) => (
                      <InfoListItem
                        key={p.id}
                        title={p.nombreProyecto || "—"}
                        subtitle={`Monto ejecutado: C$${money(
                          p.montoEjecutado
                        )}`}
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

          <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
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
                      subtitle={`Costo directo: C$${money(
                        s.totalCostoDirecto
                      )}`}
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
    </div>
  );
}

const HeroStat = ({ label, value, description }) => (
  <div className="rounded-3xl border border-white/20 bg-white/15 px-5 py-4 shadow-lg backdrop-blur transition hover:bg-white/20">
    <p className="text-sm font-bold text-cyan-100">{label}</p>

    <p className="mt-2 truncate text-lg font-extrabold text-white">{value}</p>

    <p className="mt-1 text-sm font-medium text-cyan-50">{description}</p>
  </div>
);

const MainMetric = ({
  title,
  value,
  subtitle,
  firstLabel,
  firstValue,
  secondLabel,
  secondValue,
  variant = "blue",
}) => {
  const styles = {
    blue: {
      card: "border-blue-300 bg-gradient-to-br from-white via-blue-50 to-blue-100",
      label: "border-blue-400 bg-blue-600 text-white",
      value: "text-blue-800",
      shadow: "hover:shadow-blue-300/40",
    },
    emerald: {
      card: "border-emerald-300 bg-gradient-to-br from-white via-emerald-50 to-emerald-100",
      label: "border-emerald-400 bg-emerald-600 text-white",
      value: "text-emerald-800",
      shadow: "hover:shadow-emerald-300/40",
    },
    cyan: {
      card: "border-cyan-300 bg-gradient-to-br from-white via-cyan-50 to-cyan-100",
      label: "border-cyan-400 bg-cyan-600 text-white",
      value: "text-cyan-800",
      shadow: "hover:shadow-cyan-300/40",
    },
    amber: {
      card: "border-amber-300 bg-gradient-to-br from-white via-amber-50 to-amber-100",
      label: "border-amber-400 bg-amber-500 text-white",
      value: "text-amber-800",
      shadow: "hover:shadow-amber-300/40",
    },
    violet: {
      card: "border-violet-300 bg-gradient-to-br from-white via-violet-50 to-violet-100",
      label: "border-violet-400 bg-violet-600 text-white",
      value: "text-violet-800",
      shadow: "hover:shadow-violet-300/40",
    },
    green: {
      card: "border-green-300 bg-gradient-to-br from-white via-green-50 to-green-100",
      label: "border-green-400 bg-green-600 text-white",
      value: "text-green-800",
      shadow: "hover:shadow-green-300/40",
    },
    sky: {
      card: "border-sky-300 bg-gradient-to-br from-white via-sky-50 to-sky-100",
      label: "border-sky-400 bg-sky-600 text-white",
      value: "text-sky-800",
      shadow: "hover:shadow-sky-300/40",
    },
    red: {
      card: "border-red-300 bg-gradient-to-br from-white via-red-50 to-red-100",
      label: "border-red-400 bg-red-600 text-white",
      value: "text-red-800",
      shadow: "hover:shadow-red-300/40",
    },
  };

  const current = styles[variant] || styles.blue;

  return (
    <div
      className={`
        min-h-[190px] rounded-3xl border p-5 shadow-md transition
        hover:-translate-y-1 hover:shadow-xl
        ${current.card} ${current.shadow}
      `}
    >
      <div className="flex items-start justify-between gap-4">
        <div className={`rounded-2xl border px-4 py-2 shadow-sm ${current.label}`}>
          <p className="text-sm font-bold">{title}</p>
        </div>

        <p className={`text-2xl font-extrabold ${current.value}`}>{value}</p>
      </div>

      <p className="mt-4 text-sm font-semibold text-slate-700">{subtitle}</p>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/80 bg-white/80 p-3 shadow-sm">
          <p className="text-sm font-semibold text-slate-600">{firstLabel}</p>

          <p className="mt-1 truncate text-sm font-extrabold text-slate-900">
            {firstValue}
          </p>
        </div>

        <div className="rounded-2xl border border-white/80 bg-white/80 p-3 shadow-sm">
          <p className="text-sm font-semibold text-slate-600">{secondLabel}</p>

          <p className="mt-1 truncate text-sm font-extrabold text-slate-900">
            {secondValue}
          </p>
        </div>
      </div>
    </div>
  );
};

const StatusCard = ({ title, value, text, variant = "blue" }) => {
  const styles = {
    blue: "border-blue-300 bg-gradient-to-br from-blue-500 to-blue-700 text-white",
    red: "border-red-300 bg-gradient-to-br from-red-500 to-red-700 text-white",
    amber:
      "border-amber-300 bg-gradient-to-br from-amber-400 to-orange-600 text-white",
    violet:
      "border-violet-300 bg-gradient-to-br from-violet-500 to-purple-700 text-white",
  };

  return (
    <div
      className={`
        min-h-[130px] rounded-3xl border p-5 shadow-md
        transition hover:-translate-y-1 hover:shadow-xl
        ${styles[variant] || styles.blue}
      `}
    >
      <p className="text-sm font-bold text-white/90">{title}</p>

      <p className="mt-2 text-2xl font-extrabold text-white">{value}</p>

      <p className="mt-1 text-sm font-medium text-white/85">{text}</p>
    </div>
  );
};

const Panel = ({ title, description, badge, children }) => (
  <section className="rounded-3xl border border-cyan-200 bg-white p-4 shadow-lg shadow-cyan-900/10 sm:p-5">
    <div className="mb-5 flex flex-col gap-3 border-b border-cyan-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-sm font-extrabold text-cyan-900">{title}</h2>

        <p className="mt-1 text-sm font-medium text-slate-600">
          {description}
        </p>
      </div>

      {badge && (
        <span className="w-fit rounded-full border border-cyan-300 bg-cyan-100 px-4 py-2 text-sm font-bold text-cyan-800">
          {badge}
        </span>
      )}
    </div>

    {children}
  </section>
);

const MiniBox = ({ label, value, green = false }) => (
  <div
    className={`
      rounded-xl border p-3 shadow-sm
      ${
        green
          ? "border-emerald-300 bg-emerald-100 text-emerald-800"
          : "border-cyan-200 bg-cyan-50 text-cyan-800"
      }
    `}
  >
    <p className="text-sm font-bold opacity-80">{label}</p>

    <p className="mt-1 truncate text-sm font-extrabold">{value}</p>
  </div>
);

const EstadoBadge = ({ estado }) => {
  const styles = {
    Activo: "border-emerald-300 bg-emerald-100 text-emerald-800",
    "En Espera": "border-amber-300 bg-amber-100 text-amber-800",
    Completado: "border-blue-300 bg-blue-100 text-blue-800",
    Cancelado: "border-red-300 bg-red-100 text-red-800",
    "En ejecución": "border-emerald-300 bg-emerald-100 text-emerald-800",
  };

  return (
    <span
      className={`
        rounded-full border px-3 py-1 text-sm font-bold
        ${styles[estado] || "border-cyan-300 bg-cyan-100 text-cyan-800"}
      `}
    >
      {estado || "—"}
    </span>
  );
};

const ProgressItem = ({ label, value, total, variant = "green" }) => {
  const percent =
    total > 0 ? Math.round((Number(value) / Number(total)) * 100) : 0;

  const styles = {
    green: "from-emerald-400 to-emerald-600",
    amber: "from-amber-400 to-orange-500",
    red: "from-red-400 to-red-600",
  };

  const textStyles = {
    green: "text-emerald-800",
    amber: "text-amber-800",
    red: "text-red-800",
  };

  return (
    <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className={`text-sm font-extrabold ${textStyles[variant]}`}>
          {label}
        </p>

        <p className="text-sm font-bold text-slate-700">
          {value}/{total || 0}
        </p>
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-white">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${styles[variant]}`}
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
  <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 shadow-sm transition hover:border-cyan-400 hover:bg-cyan-100">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <p className="truncate text-sm font-extrabold text-slate-900">
          {title}
        </p>

        <p className="mt-1 text-sm font-medium text-slate-600">{subtitle}</p>
      </div>

      <span
        className={`
          w-fit shrink-0 rounded-full border px-3 py-1 text-sm font-bold
          ${
            green
              ? "border-emerald-300 bg-emerald-100 text-emerald-800"
              : "border-cyan-300 bg-cyan-100 text-cyan-800"
          }
        `}
      >
        {badge}
      </span>
    </div>
  </div>
);

const EmptyBox = ({ text }) => (
  <div className="rounded-2xl border border-dashed border-cyan-300 bg-cyan-50 px-6 py-8 text-center">
    <p className="text-sm font-bold text-cyan-800">{text}</p>
  </div>
);