import { Link } from "react-router-dom";

const modulosPrincipales = [
  {
    id: "empleados",
    nombre: "Empleados",
    ruta: "/empleados",
    descripcion: "Gestiona el personal, roles laborales y datos generales.",
    icono: "/icons/employee.svg",
    color: "blue",
  },
  {
    id: "clientes",
    nombre: "Clientes",
    ruta: "/clientes",
    descripcion: "Administra empresas, contactos y datos de clientes.",
    icono: "/icons/clients.svg",
    color: "cyan",
  },
  {
    id: "proyectos",
    nombre: "Proyectos",
    ruta: "/proyectos",
    descripcion: "Controla proyectos, presupuestos, estados y avances.",
    icono: "/icons/projects.svg",
    color: "emerald",
  },
  {
    id: "inventario",
    nombre: "Inventario",
    ruta: "/materiales",
    descripcion: "Consulta materiales, existencias y stock disponible.",
    icono: "/icons/inventory.svg",
    color: "amber",
  },
  {
    id: "proveedores",
    nombre: "Proveedores",
    ruta: "/proveedores",
    descripcion: "Organiza proveedores y datos de abastecimiento.",
    icono: "/icons/suppliers.svg",
    color: "indigo",
  },
  {
    id: "compras",
    nombre: "Compras",
    ruta: "/compras",
    descripcion: "Registra compras, facturas y entradas de materiales.",
    icono: "/icons/buy.svg",
    color: "purple",
  },
  {
    id: "servicios",
    nombre: "Servicios",
    ruta: "/servicios",
    descripcion: "Administra servicios, costos directos e indirectos.",
    icono: "/icons/tool.svg",
    color: "rose",
  },
  {
    id: "avaluos",
    nombre: "Avalúos",
    ruta: "/avaluos",
    descripcion: "Gestiona avalúos, detalles técnicos y ejecución.",
    icono: "/icons/avaluos.svg",
    color: "teal",
  },
];

const accesosAdministracion = [
  {
    nombre: "Usuarios",
    ruta: "/usuarios",
    descripcion: "Cuentas de acceso del sistema.",
    icono: "/icons/user.svg",
  },
  {
    nombre: "Permisos",
    ruta: "/permisos",
    descripcion: "Control de acceso por usuario.",
    icono: "/icons/permisos.svg",
  },
  {
    nombre: "Menús",
    ruta: "/menus",
    descripcion: "Configuración de rutas y módulos.",
    icono: "/icons/menu.svg",
  },
];

const flujoTrabajo = [
  {
    nombre: "Empleados",
    icono: "/icons/employee.svg",
  },
  {
    nombre: "Clientes",
    icono: "/icons/clients.svg",
  },
  {
    nombre: "Proyectos",
    icono: "/icons/projects.svg",
  },
  {
    nombre: "Inventario",
    icono: "/icons/inventory.svg",
  },
  {
    nombre: "Proveedores",
    icono: "/icons/suppliers.svg",
  },
  {
    nombre: "Compras",
    icono: "/icons/buy.svg",
  },
  {
    nombre: "Servicios",
    icono: "/icons/tool.svg",
  },
  {
    nombre: "Avalúos",
    icono: "/icons/avaluos.svg",
  },
];

export default function InicioPage() {
  const totalModulos = modulosPrincipales.length;
  const totalAdministracion = accesosAdministracion.length;

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
                    alt="Inicio"
                    className="h-7 w-7 brightness-0 invert"
                  />
                </div>

                <p className="text-sm font-medium text-cyan-100">
                  Panel principal
                </p>

                <h1 className="mt-1 text-xl font-extrabold tracking-tight text-white sm:text-2xl">
                  Bienvenido al sistema de gestión
                </h1>

                <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
                  Desde esta página puedes acceder rápidamente a los módulos
                  principales del sistema, administrar usuarios, controlar
                  permisos y seguir el flujo recomendado de trabajo.
                </p>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <Link
                    to="/proyectos"
                    className="w-full rounded-2xl bg-gradient-to-r from-blue-800 to-cyan-700 px-6 py-3 text-center text-sm font-bold text-white shadow-lg transition hover:scale-[1.01] hover:shadow-xl sm:w-auto"
                  >
                    Ir a Proyectos
                  </Link>

                  <Link
                    to="/empleados"
                    className="w-full rounded-2xl border border-white/20 bg-white/10 px-6 py-3 text-center text-sm font-bold text-white shadow-sm backdrop-blur transition hover:bg-white/20 sm:w-auto"
                  >
                    Ver Empleados
                  </Link>
                </div>
              </div>

              <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-3 xl:w-[560px]">
                <HeaderBox label="Módulos" value={totalModulos} />
                <HeaderBox label="Administración" value={totalAdministracion} />
                <HeaderBox label="Estado" value="Activo" />
              </div>
            </div>
          </div>
        </section>

        <section className="grid w-full grid-cols-1 gap-5 xl:grid-cols-[1.4fr_0.8fr]">
          <div className="rounded-3xl border border-slate-300 bg-slate-100 p-4 shadow-md sm:p-5">
            <div className="mb-4 flex flex-col gap-2 border-b border-slate-300 pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Módulos principales
                </h2>

                <p className="mt-1 text-sm text-slate-600">
                  Acceda a las áreas principales de trabajo del sistema.
                </p>
              </div>

              <span className="w-fit rounded-full border border-blue-200 bg-blue-100 px-4 py-2 text-sm font-bold text-blue-800">
                {totalModulos} disponibles
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
              {modulosPrincipales.map((modulo) => (
                <ModuloCard key={modulo.id} modulo={modulo} />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <section className="rounded-3xl border border-slate-300 bg-slate-100 p-4 shadow-md sm:p-5">
              <div className="mb-4 border-b border-slate-300 pb-4">
                <h2 className="text-sm font-bold text-slate-900">
                  Administración
                </h2>

                <p className="mt-1 text-sm text-slate-600">
                  Accesos para configuración y seguridad.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {accesosAdministracion.map((item) => (
                  <Link
                    key={item.nombre}
                    to={item.ruta}
                    className="group rounded-2xl border border-slate-300 bg-slate-200 p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-400 hover:bg-blue-100 hover:shadow-md"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-800 group-hover:bg-blue-700">
                        <img
                          src={item.icono}
                          alt={item.nombre}
                          className="h-5 w-5 group-hover:brightness-0 group-hover:invert"
                        />
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-900">
                          {item.nombre}
                        </p>

                        <p className="mt-1 text-sm leading-5 text-slate-600">
                          {item.descripcion}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-slate-300 bg-slate-100 p-4 shadow-md sm:p-5">
              <div className="mb-4 border-b border-slate-300 pb-4">
                <h2 className="text-sm font-bold text-slate-900">
                  Flujo recomendado
                </h2>

                <p className="mt-1 text-sm text-slate-600">
                  Orden sugerido para trabajar dentro del sistema.
                </p>
              </div>

              <div className="space-y-3">
                {flujoTrabajo.map((item, index) => (
                  <div
                    key={item.nombre}
                    className="flex items-center gap-3 rounded-2xl border border-slate-300 bg-slate-200 px-4 py-3"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-700 shadow-sm">
                      <img
                        src={item.icono}
                        alt={item.nombre}
                        className="h-5 w-5 brightness-0 invert"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-slate-800">
                        {String(index + 1).padStart(2, "0")} · {item.nombre}
                      </p>
                    </div>

                    {index < flujoTrabajo.length - 1 && (
                      <span className="ml-auto text-sm font-black text-slate-500">
                        →
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-300 bg-slate-100 p-4 shadow-md sm:p-5">
          <div className="mb-4 border-b border-slate-300 pb-4">
            <h2 className="text-sm font-bold text-slate-900">
              Recomendaciones de uso
            </h2>

            <p className="mt-1 text-sm text-slate-600">
              Consejos rápidos para mantener la información ordenada.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <InfoBox
              icon="/icons/employee.svg"
              title="Registre primero los empleados"
              text="Esto permite asignar responsables a proyectos, usuarios y permisos."
            />

            <InfoBox
              icon="/icons/inventory.svg"
              title="Mantenga actualizado el inventario"
              text="Así podrá controlar materiales disponibles, compras y consumos."
            />

            <InfoBox
              icon="/icons/permisos.svg"
              title="Revise los permisos"
              text="Cada usuario debe tener acceso únicamente a los módulos que necesita."
            />
          </div>
        </section>
      </div>
    </div>
  );
}

const HeaderBox = ({ label, value }) => (
  <div className="rounded-2xl border border-white/10 bg-slate-900/50 px-4 py-3 text-left shadow-sm backdrop-blur xl:text-right">
    <p className="text-sm font-medium text-cyan-100">{label}</p>
    <p className="mt-1 text-sm font-bold text-white">{value}</p>
  </div>
);

const ModuloCard = ({ modulo }) => {
  const colorClass = {
    blue: "border-blue-200 bg-blue-100",
    cyan: "border-cyan-200 bg-cyan-100",
    emerald: "border-emerald-200 bg-emerald-100",
    amber: "border-amber-200 bg-amber-100",
    indigo: "border-indigo-200 bg-indigo-100",
    purple: "border-purple-200 bg-purple-100",
    rose: "border-rose-200 bg-rose-100",
    teal: "border-teal-200 bg-teal-100",
  };

  return (
    <Link
      to={modulo.ruta}
      className="group flex min-h-[210px] flex-col justify-between overflow-hidden rounded-3xl border border-slate-300 bg-slate-200 shadow-md transition hover:-translate-y-1 hover:border-blue-400 hover:shadow-xl"
    >
      <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-cyan-900 px-5 py-4 text-white">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-medium text-cyan-100">
            Módulo del sistema
          </p>

          <span
            className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${
              colorClass[modulo.color]
            }`}
          >
            <img
              src={modulo.icono}
              alt={modulo.nombre}
              className="h-6 w-6"
            />
          </span>
        </div>

        <h3 className="mt-2 truncate text-sm font-bold text-white">
          {modulo.nombre}
        </h3>
      </div>

      <div className="flex flex-1 flex-col justify-between p-5">
        <p className="text-sm leading-6 text-slate-700">
          {modulo.descripcion}
        </p>

        <div className="mt-5 flex items-center justify-between">
          <span className="rounded-full border border-slate-300 bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700">
            Abrir módulo
          </span>

          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-700 text-sm font-black text-white transition group-hover:bg-cyan-700">
            →
          </span>
        </div>
      </div>
    </Link>
  );
};

const InfoBox = ({ icon, title, text }) => (
  <div className="rounded-2xl border border-slate-300 bg-slate-200 p-4 shadow-sm">
    <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100">
      <img src={icon} alt={title} className="h-5 w-5" />
    </div>

    <p className="text-sm font-bold text-slate-900">{title}</p>

    <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
  </div>
);