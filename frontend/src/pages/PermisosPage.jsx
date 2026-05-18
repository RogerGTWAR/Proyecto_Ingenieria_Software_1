import { useState } from "react";
import DeleteConfirmationModal from "../components/ui/DeleteConfirmationModal";
import { usePermisos } from "../hooks/usePermisos";

export default function PermisosPage() {
  const {
    empleado,
    asignados,
    noAsignados,
    loading,
    error,
    buscar,
    loadMenus,
    loadAsignados,
    loadNoAsignados,
    asignar,
    remover,
  } = usePermisos();

  const [usuarioBuscado, setUsuarioBuscado] = useState("");
  const [seleccionAsignados, setSeleccionAsignados] = useState([]);
  const [seleccionNoAsignados, setSeleccionNoAsignados] = useState([]);
  const [confirmRemoveOpen, setConfirmRemoveOpen] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  const mostrarMensaje = (tipo, texto) => {
    setMensaje({ tipo, texto });

    setTimeout(() => {
      setMensaje(null);
    }, 3500);
  };

  const handleBuscarUsuario = async () => {
    if (!usuarioBuscado.trim()) {
      mostrarMensaje("error", "Ingrese un usuario para realizar la búsqueda.");
      return;
    }

    setMensaje(null);

    const emp = await buscar(usuarioBuscado.trim());

    if (!emp) {
      mostrarMensaje("error", "No se encontró un usuario con ese nombre.");
      return;
    }

    await loadMenus();
    await loadAsignados(emp.usuario_id);
    await loadNoAsignados(emp.usuario_id);

    setSeleccionAsignados([]);
    setSeleccionNoAsignados([]);

    mostrarMensaje("success", "Usuario encontrado correctamente.");
  };

  const toggleSeleccionAsignado = (id) => {
    setSeleccionAsignados((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSeleccionNoAsignado = (id) => {
    setSeleccionNoAsignados((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleAsignar = async () => {
    if (!empleado) {
      mostrarMensaje("error", "Primero debe buscar un usuario.");
      return;
    }

    if (seleccionNoAsignados.length === 0) {
      mostrarMensaje("error", "Debe seleccionar al menos un menú para asignar.");
      return;
    }

    await asignar(empleado.usuario_id, seleccionNoAsignados);
    setSeleccionNoAsignados([]);

    await loadAsignados(empleado.usuario_id);
    await loadNoAsignados(empleado.usuario_id);

    mostrarMensaje("success", "Permisos asignados correctamente.");
  };

  const confirmarRemover = () => {
    if (seleccionAsignados.length === 0) {
      mostrarMensaje("error", "Debe seleccionar al menos un permiso para remover.");
      return;
    }

    setConfirmRemoveOpen(true);
  };

  const handleRemover = async () => {
    if (!empleado) return;

    await remover(empleado.usuario_id, seleccionAsignados);

    setSeleccionAsignados([]);
    setConfirmRemoveOpen(false);

    await loadAsignados(empleado.usuario_id);
    await loadNoAsignados(empleado.usuario_id);

    mostrarMensaje("success", "Permisos removidos correctamente.");
  };

  const nombreCompleto = empleado
    ? `${empleado.empleados?.nombres || ""} ${
        empleado.empleados?.apellidos || ""
      }`.trim()
    : "—";

  const rolUsuario = empleado?.empleados?.roles?.cargo ?? "—";

  const totalAsignados = asignados.length;
  const totalDisponibles = noAsignados.length;

  return (
    <div className="h-[calc(100dvh-64px)] w-full overflow-y-auto overflow-x-hidden bg-slate-200 px-3 py-4 sm:px-4 lg:px-5 xl:px-6">
      <div className="flex min-h-full w-full min-w-0 flex-col gap-5 pb-8">
        <section className="w-full shrink-0 overflow-hidden rounded-3xl border border-slate-700/40 bg-slate-900 shadow-xl">
          <div className="w-full bg-gradient-to-r from-slate-950 via-blue-950 to-cyan-900 px-5 py-5 text-white sm:px-7 lg:px-8">
            <div className="flex w-full flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-cyan-100">
                  Seguridad del sistema
                </p>

                <h1 className="mt-1 text-sm font-bold tracking-tight text-white">
                  Gestión de permisos
                </h1>

                <p className="mt-2 text-sm text-slate-300">
                  Asigne o remueva el acceso de los usuarios a los módulos y
                  submenús del sistema.
                </p>
              </div>

              <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-3 xl:w-[560px]">
                <HeaderBox label="Asignados" value={totalAsignados} />
                <HeaderBox label="Disponibles" value={totalDisponibles} />
                <HeaderBox
                  label="Seleccionados"
                  value={seleccionAsignados.length + seleccionNoAsignados.length}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="w-full shrink-0 rounded-3xl border border-slate-300 bg-slate-100 p-4 shadow-md sm:p-5">
          <div className="flex w-full flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div className="w-full min-w-0 xl:flex-1">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Buscar usuario
              </label>

              <input
                type="text"
                placeholder="Ingrese el nombre de usuario..."
                value={usuarioBuscado}
                onChange={(e) => setUsuarioBuscado(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleBuscarUsuario();
                }}
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-300
                  bg-slate-200
                  px-4
                  py-3
                  text-sm
                  text-slate-800
                  shadow-sm
                  outline-none
                  transition
                  placeholder:text-sm
                  placeholder:text-slate-500
                  focus:border-blue-600
                  focus:bg-white
                  focus:ring-4
                  focus:ring-blue-100
                "
              />
            </div>

            <button
              type="button"
              onClick={handleBuscarUsuario}
              disabled={loading}
              className="
                w-full
                rounded-2xl
                bg-gradient-to-r
                from-blue-800
                to-cyan-700
                px-6
                py-3
                text-sm
                font-bold
                text-white
                shadow-lg
                transition
                hover:scale-[1.01]
                hover:shadow-xl
                disabled:cursor-not-allowed
                disabled:opacity-70
                sm:w-auto
              "
            >
              {loading ? "Buscando..." : "Buscar usuario"}
            </button>
          </div>

          {(mensaje || error) && (
            <div
              className={`
                mt-4 rounded-2xl border px-4 py-3 text-sm font-bold shadow-sm
                ${
                  mensaje?.tipo === "success"
                    ? "border-emerald-200 bg-emerald-100 text-emerald-800"
                    : "border-red-200 bg-red-100 text-red-800"
                }
              `}
            >
              {mensaje?.texto || error}
            </div>
          )}
        </section>

        {empleado ? (
          <>
            <section className="w-full shrink-0 rounded-3xl border border-slate-300 bg-slate-100 p-4 shadow-md sm:p-5">
              <div className="mb-4 flex flex-col gap-2 border-b border-slate-300 pb-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-sm font-bold text-slate-900">
                    Usuario encontrado
                  </h2>

                  <p className="mt-1 text-sm text-slate-600">
                    Revise los datos del usuario antes de modificar sus permisos.
                  </p>
                </div>

                <span className="w-fit rounded-full border border-emerald-200 bg-emerald-100 px-4 py-2 text-sm font-bold text-emerald-800">
                  Activo
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <InfoBox label="Nombre completo" value={nombreCompleto || "—"} />

                <InfoBox
                  label="Usuario"
                  value={empleado.usuario || "—"}
                  variant="blue"
                />

                <InfoBox label="Rol" value={rolUsuario} />
              </div>
            </section>

            <section className="grid w-full grid-cols-1 gap-5 xl:grid-cols-2">
              <PermisosPanel
                title="Permisos asignados"
                description="Módulos y submenús a los que el usuario ya tiene acceso."
                count={asignados.length}
                selectedCount={seleccionAsignados.length}
                emptyText="No hay permisos asignados."
                items={asignados}
                getId={(item) => item.menuId}
                getKey={(item) => item.permisoId}
                selectedItems={seleccionAsignados}
                onToggle={toggleSeleccionAsignado}
                actionLabel="Remover seleccionados"
                actionColor="danger"
                onAction={confirmarRemover}
              />

              <PermisosPanel
                title="Menús disponibles"
                description="Módulos y submenús que todavía puede recibir el usuario."
                count={noAsignados.length}
                selectedCount={seleccionNoAsignados.length}
                emptyText="No hay menús disponibles."
                items={noAsignados}
                getId={(item) => item.id}
                getKey={(item) => item.id}
                selectedItems={seleccionNoAsignados}
                onToggle={toggleSeleccionNoAsignado}
                actionLabel="Asignar seleccionados"
                actionColor="primary"
                onAction={handleAsignar}
              />
            </section>
          </>
        ) : (
          <section className="flex min-h-[360px] w-full items-center justify-center rounded-3xl border border-dashed border-slate-400 bg-slate-100 px-6 py-10 text-center shadow-md">
            <div className="max-w-md">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-100 text-2xl font-black text-blue-800">
                🔐
              </div>

              <h2 className="text-sm font-bold text-slate-900">
                Busque un usuario para administrar permisos
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Ingrese el nombre de usuario en el buscador superior. Después
                podrá ver sus permisos asignados y los módulos disponibles.
              </p>
            </div>
          </section>
        )}

        {confirmRemoveOpen && (
          <DeleteConfirmationModal
            isOpen={confirmRemoveOpen}
            onClose={() => setConfirmRemoveOpen(false)}
            onConfirm={handleRemover}
            itemName="los permisos seleccionados"
          />
        )}
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

const InfoBox = ({ label, value, variant = "default" }) => {
  const styles = {
    default: "border-slate-300 bg-slate-200 text-slate-800",
    blue: "border-blue-200 bg-blue-100 text-blue-800",
  };

  return (
    <div className={`rounded-2xl border p-4 ${styles[variant]}`}>
      <p className="text-sm font-semibold opacity-80">{label}</p>
      <p className="mt-1 truncate text-sm font-bold">{value}</p>
    </div>
  );
};

const PermisosPanel = ({
  title,
  description,
  count,
  selectedCount,
  emptyText,
  items,
  getId,
  getKey,
  selectedItems,
  onToggle,
  actionLabel,
  actionColor,
  onAction,
}) => {
  const isDanger = actionColor === "danger";

  return (
    <div className="flex min-h-[560px] w-full flex-col overflow-hidden rounded-3xl border border-slate-300 bg-slate-100 shadow-md">
      <div className="border-b border-slate-300 bg-slate-100 p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">{title}</h3>

            <p className="mt-1 text-sm leading-6 text-slate-600">
              {description}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-blue-200 bg-blue-100 px-4 py-2 text-sm font-bold text-blue-800">
              {count} total
            </span>

            <span
              className={`
                rounded-full border px-4 py-2 text-sm font-bold
                ${
                  selectedCount > 0
                    ? "border-emerald-200 bg-emerald-100 text-emerald-800"
                    : "border-slate-300 bg-slate-200 text-slate-700"
                }
              `}
            >
              {selectedCount} seleccionado(s)
            </span>
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto bg-slate-200 p-3 sm:p-4">
        {items.length === 0 ? (
          <div className="flex min-h-[360px] items-center justify-center rounded-3xl border border-dashed border-slate-400 bg-slate-100 px-6 py-10 text-center">
            <div>
              <p className="text-sm font-bold text-slate-800">{emptyText}</p>

              <p className="mt-1 text-sm text-slate-600">
                No hay elementos para mostrar en esta sección.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {items.map((item) => {
              const id = getId(item);
              const checked = selectedItems.includes(id);

              return (
                <label
                  key={getKey(item)}
                  className={`
                    group flex cursor-pointer items-start gap-3 rounded-2xl border p-4 shadow-sm transition
                    ${
                      checked
                        ? "border-blue-300 bg-blue-100 shadow-md"
                        : "border-slate-300 bg-slate-100 hover:border-blue-300 hover:bg-blue-50"
                    }
                  `}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggle(id)}
                    className="mt-1 h-4 w-4 cursor-pointer accent-blue-700"
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <p className="truncate text-sm font-bold text-slate-900">
                        {item.nombre}
                      </p>

                      <span
                        className={`
                          w-fit rounded-full border px-3 py-1 text-sm font-bold
                          ${
                            item.esSubmenu
                              ? "border-cyan-200 bg-cyan-100 text-cyan-800"
                              : "border-indigo-200 bg-indigo-100 text-indigo-800"
                          }
                        `}
                      >
                        {item.esSubmenu ? "Submenú" : "Menú"}
                      </span>
                    </div>

                    <p className="mt-2 truncate text-sm text-slate-600">
                      {item.url || "Sin ruta definida"}
                    </p>
                  </div>
                </label>
              );
            })}
          </div>
        )}
      </div>

      <div className="border-t border-slate-300 bg-slate-100 p-4 sm:p-5">
        <button
          type="button"
          onClick={onAction}
          className={`
            w-full rounded-2xl px-5 py-3 text-sm font-bold text-white shadow-lg transition
            hover:scale-[1.01] hover:shadow-xl
            ${
              isDanger
                ? "bg-red-600 hover:bg-red-700"
                : "bg-gradient-to-r from-blue-800 to-cyan-700"
            }
          `}
        >
          {actionLabel}
        </button>
      </div>
    </div>
  );
};