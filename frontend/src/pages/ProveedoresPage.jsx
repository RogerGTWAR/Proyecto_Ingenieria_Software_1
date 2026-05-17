import { useState } from "react";
import DeleteConfirmationModal from "../components/ui/DeleteConfirmationModal";

import ProveedoresCard from "../components/proveedores/ProveedoresCard";
import ProveedoresTable from "../components/proveedores/ProveedoresTable";
import ProveedoresDetails from "../components/proveedores/ProveedoresDetails";
import ProveedoresForm from "../components/proveedores/ProveedoresForm";

import { useProveedores } from "../hooks/useProveedores";

function ProveedoresPage() {
  const {
    items: proveedores,
    loading,
    add,
    edit,
    remove,
    reload,
  } = useProveedores();

  const [busqueda, setBusqueda] = useState("");
  const [vistaTarjetas, setVistaTarjetas] = useState(false);

  const [vistaDetalle, setVistaDetalle] = useState(false);
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState(null);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [proveedorAEditar, setProveedorAEditar] = useState(null);

  const [mostrarEliminar, setMostrarEliminar] = useState(false);
  const [proveedorAEliminar, setProveedorAEliminar] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const proveedoresFiltrados = (proveedores || []).filter((p) => {
    const txt = busqueda.toLowerCase();

    return (
      p.nombre_empresa?.toLowerCase().includes(txt) ||
      p.categoriaNombre?.toLowerCase().includes(txt) ||
      p.ciudad?.toLowerCase().includes(txt) ||
      p.pais?.toLowerCase().includes(txt)
    );
  });

  const abrirFormulario = () => {
    setProveedorAEditar(null);
    setModoEdicion(false);
    setMostrarFormulario(true);
  };

  const editarProveedor = (proveedor) => {
    setProveedorAEditar(proveedor);
    setModoEdicion(true);
    setMostrarFormulario(true);
    setVistaDetalle(false);
  };

  const cerrarFormulario = () => {
    setMostrarFormulario(false);
    setProveedorAEditar(null);
    setModoEdicion(false);
  };

  const guardarProveedor = async (data) => {
    try {
      if (modoEdicion && proveedorAEditar) {
        await edit(proveedorAEditar.id, data);
      } else {
        await add(data);
      }

      await reload();
      cerrarFormulario();
    } catch (error) {
      console.error("Error al guardar proveedor:", error);
      alert("No se pudo guardar el proveedor.");
    }
  };

  const verDetalles = (proveedor) => {
    setProveedorSeleccionado(proveedor);
    setVistaDetalle(true);
  };

  const cerrarDetalles = () => {
    setVistaDetalle(false);
    setProveedorSeleccionado(null);
  };

  const abrirEliminar = (proveedor) => {
    setProveedorAEliminar(proveedor);
    setMostrarEliminar(true);
  };

  const cerrarEliminar = () => {
    setMostrarEliminar(false);
    setProveedorAEliminar(null);
  };

  const eliminarProveedor = async () => {
    if (!proveedorAEliminar) return;

    setIsDeleting(true);

    try {
      await remove(proveedorAEliminar.id);
      await reload();
      setVistaDetalle(false);
    } catch (error) {
      console.error("Error al eliminar proveedor:", error);
      alert("No se pudo eliminar el proveedor.");
    } finally {
      setIsDeleting(false);
      cerrarEliminar();
    }
  };

  const totalProveedores = proveedores.length;

  const proveedoresPorPais = [
    ...new Set(proveedores.map((p) => p.pais).filter(Boolean)),
  ].length;

  const proveedoresPorCategoria = [
    ...new Set(proveedores.map((p) => p.categoriaNombre).filter(Boolean)),
  ].length;

  if (loading) {
    return (
      <div className="flex h-[calc(100dvh-64px)] w-full items-center justify-center bg-slate-200 px-4">
        <div className="rounded-3xl border border-slate-300 bg-slate-100 px-8 py-6 text-center shadow-xl">
          <p className="text-sm font-bold text-slate-800">
            Cargando proveedores...
          </p>

          <p className="mt-1 text-sm text-slate-600">
            Espere un momento mientras se cargan los datos.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="
        flex
        h-[calc(100dvh-64px)]
        w-full
        flex-col
        overflow-hidden
        bg-slate-200
        px-3
        py-4
        sm:px-5
        lg:px-8
      "
    >
      <div className="flex h-full w-full flex-col gap-5 overflow-hidden">

        {/* Hero / estadísticas */}
        <section
          className="
            shrink-0
            overflow-hidden
            rounded-3xl
            border
            border-slate-700/40
            bg-slate-900
            shadow-xl
          "
        >
          <div
            className="
              bg-gradient-to-r
              from-slate-950
              via-blue-950
              to-cyan-900
              px-5
              py-5
              text-white
              sm:px-7
              lg:px-8
            "
          >
            <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <p className="text-sm font-medium text-cyan-100">
                  Proveedores
                </p>

                <h1 className="mt-1 text-sm font-bold tracking-tight text-white">
                  Gestión de proveedores
                </h1>

                <p className="mt-2 text-sm text-slate-300">
                  Administre los proveedores registrados, sus datos de contacto y categorías.
                </p>
              </div>

              <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-3 xl:w-auto">
                <div className="rounded-2xl border border-white/10 bg-slate-900/50 px-4 py-3 text-left shadow-sm backdrop-blur xl:text-right">
                  <p className="text-sm font-medium text-cyan-100">
                    Proveedores
                  </p>

                  <p className="mt-1 text-sm font-bold text-white">
                    {totalProveedores}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-900/50 px-4 py-3 text-left shadow-sm backdrop-blur xl:text-right">
                  <p className="text-sm font-medium text-cyan-100">
                    Países
                  </p>

                  <p className="mt-1 text-sm font-bold text-white">
                    {proveedoresPorPais}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-900/50 px-4 py-3 text-left shadow-sm backdrop-blur xl:text-right">
                  <p className="text-sm font-medium text-cyan-100">
                    Categorías
                  </p>

                  <p className="mt-1 text-sm font-bold text-white">
                    {proveedoresPorCategoria}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Barra de búsqueda y acciones */}
        <section className="shrink-0 rounded-3xl border border-slate-300 bg-slate-100 p-4 shadow-md sm:p-5">
          <div className="flex w-full flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div className="w-full xl:flex-1">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Buscar proveedor
              </label>

              <input
                type="text"
                placeholder="Buscar por empresa, categoría, ciudad o país..."
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
                  {proveedoresFiltrados.length}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setVistaTarjetas(!vistaTarjetas)}
                className="
                  w-full
                  rounded-2xl
                  border
                  border-slate-400
                  bg-slate-200
                  px-5
                  py-3
                  text-sm
                  font-bold
                  text-slate-800
                  shadow-sm
                  transition
                  hover:bg-slate-300
                  sm:w-auto
                "
              >
                {vistaTarjetas ? "Ver como Tabla" : "Ver como Tarjetas"}
              </button>

              <button
                type="button"
                onClick={abrirFormulario}
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
                Registrar Proveedor
              </button>
            </div>
          </div>
        </section>

        {/* Lista */}
        <section
          className="
            flex
            min-h-0
            flex-1
            flex-col
            overflow-hidden
            rounded-3xl
            border
            border-slate-300
            bg-slate-100
            p-3
            shadow-md
            sm:p-5
          "
        >
          <div className="mb-4 flex shrink-0 flex-col gap-2 border-b border-slate-300 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Lista de proveedores
              </h2>

              <p className="mt-1 text-sm text-slate-600">
                Visualice, edite o elimine los proveedores registrados.
              </p>
            </div>

            <span className="w-fit rounded-full border border-slate-300 bg-slate-200 px-4 py-2 text-sm font-bold text-slate-700">
              {vistaTarjetas ? "Vista tarjetas" : "Vista tabla"}
            </span>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto pr-1">
            {vistaTarjetas ? (
              <ProveedoresCard
                proveedores={proveedoresFiltrados}
                onEdit={editarProveedor}
                onDelete={abrirEliminar}
                onVerDetalles={verDetalles}
              />
            ) : (
              <ProveedoresTable
                proveedores={proveedoresFiltrados}
                onEdit={editarProveedor}
                onDelete={abrirEliminar}
                onVerDetalles={verDetalles}
              />
            )}
          </div>
        </section>

        {vistaDetalle && proveedorSeleccionado && (
          <ProveedoresDetails
            proveedor={proveedores.find((p) => p.id === proveedorSeleccionado.id)}
            onClose={cerrarDetalles}
            onEdit={editarProveedor}
            onDelete={abrirEliminar}
          />
        )}

        {mostrarFormulario && (
          <ProveedoresForm
            onSubmit={guardarProveedor}
            onClose={cerrarFormulario}
            initialData={proveedorAEditar}
            isEdit={modoEdicion}
          />
        )}

        {mostrarEliminar && (
          <DeleteConfirmationModal
            isOpen={mostrarEliminar}
            onClose={cerrarEliminar}
            onConfirm={eliminarProveedor}
            itemName={proveedorAEliminar?.nombre_empresa || ""}
            loading={isDeleting}
          />
        )}
      </div>
    </div>
  );
}

export default ProveedoresPage;