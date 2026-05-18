import { useMemo, useState } from "react";
import DeleteConfirmationModal from "../components/ui/DeleteConfirmationModal";

import { useMenus } from "../hooks/useMenus";
import MenusForm from "../components/menus/MenusForm";
import MenusTable from "../components/menus/MenusTable";

export default function MenusPage() {
  const { items: menus, loading, add, edit, remove, reload } = useMenus();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  const [busqueda, setBusqueda] = useState("");

  const [mostrarEliminar, setMostrarEliminar] = useState(false);
  const [menuAEliminar, setMenuAEliminar] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [mensaje, setMensaje] = useState(null);

  const mostrarMensaje = (tipo, texto) => {
    setMensaje({ tipo, texto });

    setTimeout(() => {
      setMensaje(null);
    }, 3500);
  };

  const menusFiltrados = useMemo(() => {
    const q = busqueda.toLowerCase().trim();

    if (!q) return menus || [];

    return (menus || []).filter((m) => {
      return (
        m.nombre?.toLowerCase().includes(q) ||
        m.url?.toLowerCase().includes(q) ||
        String(m.id ?? "").toLowerCase().includes(q) ||
        String(m.padre_id ?? m.padreId ?? "").toLowerCase().includes(q)
      );
    });
  }, [menus, busqueda]);

  const totalMenus = menus.length;

  const totalSubmenus = menus.filter(
    (m) => m.esSubmenu || m.padre_id || m.padreId
  ).length;

  const totalPrincipales = totalMenus - totalSubmenus;

  const abrirNuevo = () => {
    setSelectedItem(null);
    setIsEdit(false);
    setIsModalOpen(true);
  };

  const abrirEditar = (menu) => {
    setSelectedItem(menu);
    setIsEdit(true);
    setIsModalOpen(true);
  };

  const handleSubmit = async (formData) => {
    try {
      if (isEdit) {
        await edit(formData.id, formData);
        mostrarMensaje("success", "Menú actualizado correctamente.");
      } else {
        await add(formData);
        mostrarMensaje("success", "Menú registrado correctamente.");
      }

      setIsModalOpen(false);
      await reload();
    } catch (error) {
      mostrarMensaje("error", "No se pudo guardar el menú.");
    }
  };

  const abrirEliminar = (menu) => {
    setMenuAEliminar(menu);
    setMostrarEliminar(true);
  };

  const cerrarEliminar = () => {
    setMostrarEliminar(false);
    setMenuAEliminar(null);
  };

  const eliminarMenu = async () => {
    if (!menuAEliminar) return;

    setIsDeleting(true);

    try {
      await remove(menuAEliminar.id);
      await reload();
      cerrarEliminar();
      mostrarMensaje("success", "Menú eliminado correctamente.");
    } catch (error) {
      mostrarMensaje("error", "No se pudo eliminar el menú.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100dvh-64px)] w-full items-center justify-center overflow-y-auto bg-slate-200 px-3 sm:px-4">
        <div className="rounded-3xl border border-slate-300 bg-slate-100 px-8 py-6 text-center shadow-xl">
          <p className="text-sm font-bold text-slate-800">
            Cargando menús...
          </p>

          <p className="mt-1 text-sm text-slate-600">
            Espere un momento mientras se cargan los datos.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100dvh-64px)] w-full overflow-y-auto overflow-x-hidden bg-slate-200 px-3 py-4 sm:px-4 lg:px-5 xl:px-6">
      <div className="flex min-h-full w-full min-w-0 flex-col gap-5 pb-8">
        <section className="w-full shrink-0 overflow-hidden rounded-3xl border border-slate-700/40 bg-slate-900 shadow-xl">
          <div className="w-full bg-gradient-to-r from-slate-950 via-blue-950 to-cyan-900 px-5 py-5 text-white sm:px-7 lg:px-8">
            <div className="flex w-full flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-cyan-100">
                  Configuración del sistema
                </p>

                <h1 className="mt-1 text-sm font-bold tracking-tight text-white">
                  Gestión de menús
                </h1>

                <p className="mt-2 text-sm text-slate-300">
                  Administre los menús, submenús, rutas y accesos visibles del
                  sistema.
                </p>
              </div>

              <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-3 xl:w-[560px]">
                <HeaderBox label="Menús" value={totalMenus} />
                <HeaderBox label="Principales" value={totalPrincipales} />
                <HeaderBox label="Submenús" value={totalSubmenus} />
              </div>
            </div>
          </div>
        </section>

        <section className="w-full shrink-0 rounded-3xl border border-slate-300 bg-slate-100 p-4 shadow-md sm:p-5">
          <div className="flex w-full flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div className="w-full min-w-0 xl:flex-1">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Buscar menú
              </label>

              <input
                type="text"
                placeholder="Buscar por nombre, ruta, ID o menú padre..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
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

            <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-end xl:w-auto">
              <div className="rounded-2xl border border-blue-200 bg-blue-100 px-4 py-3">
                <p className="text-sm font-semibold text-blue-700">
                  Resultados
                </p>

                <p className="mt-1 text-sm font-bold text-blue-900">
                  {menusFiltrados.length}
                </p>
              </div>

              <button
                type="button"
                onClick={abrirNuevo}
                className="
                  w-full
                  rounded-2xl
                  bg-gradient-to-r
                  from-blue-800
                  to-cyan-700
                  px-5
                  py-3
                  text-sm
                  font-bold
                  text-white
                  shadow-lg
                  transition
                  hover:scale-[1.01]
                  hover:shadow-xl
                  sm:w-auto
                "
              >
                Añadir Menú
              </button>
            </div>
          </div>

          {mensaje && (
            <div
              className={`
                mt-4 rounded-2xl border px-4 py-3 text-sm font-bold shadow-sm
                ${
                  mensaje.tipo === "success"
                    ? "border-emerald-200 bg-emerald-100 text-emerald-800"
                    : "border-red-200 bg-red-100 text-red-800"
                }
              `}
            >
              {mensaje.texto}
            </div>
          )}
        </section>

        <section className="flex min-h-[520px] w-full flex-col overflow-hidden rounded-3xl border border-slate-300 bg-slate-100 p-3 shadow-md sm:p-5">
          <div className="mb-4 flex w-full shrink-0 flex-col gap-2 border-b border-slate-300 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Lista de menús
              </h2>

              <p className="mt-1 text-sm text-slate-600">
                Visualice, edite o elimine los menús registrados en el sistema.
              </p>
            </div>

            <span className="w-fit rounded-full border border-slate-300 bg-slate-200 px-4 py-2 text-sm font-bold text-slate-700">
              {menusFiltrados.length} registro(s)
            </span>
          </div>

          <div className="min-h-0 w-full flex-1 overflow-y-auto overflow-x-hidden pr-1">
            <div className="w-full min-w-0">
              {menusFiltrados.length > 0 ? (
                <MenusTable
                  menus={menusFiltrados}
                  onEdit={abrirEditar}
                  onDelete={abrirEliminar}
                />
              ) : (
                <EmptyBox />
              )}
            </div>
          </div>
        </section>

        {isModalOpen && (
          <MenusForm
            initialData={selectedItem}
            isEdit={isEdit}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleSubmit}
            menus={menus}
          />
        )}

        {mostrarEliminar && (
          <DeleteConfirmationModal
            isOpen={mostrarEliminar}
            onClose={cerrarEliminar}
            onConfirm={eliminarMenu}
            itemName={menuAEliminar?.nombre || ""}
            loading={isDeleting}
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

const EmptyBox = () => (
  <div className="flex min-h-[300px] w-full items-center justify-center rounded-3xl border border-dashed border-slate-400 bg-slate-200 px-6 py-10 text-center shadow-sm">
    <div>
      <p className="text-sm font-bold text-slate-800">
        No hay menús para mostrar
      </p>

      <p className="mt-1 text-sm text-slate-600">
        Intente cambiar la búsqueda o registre un nuevo menú.
      </p>
    </div>
  </div>
);