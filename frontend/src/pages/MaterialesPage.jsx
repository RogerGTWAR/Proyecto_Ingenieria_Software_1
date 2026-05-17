import { useState } from "react";
import DeleteConfirmationModal from "../components/ui/DeleteConfirmationModal";

import MaterialesCard from "../components/materiales/MaterialesCard";
import MaterialesTable from "../components/materiales/MaterialesTable";
import MaterialesDetails from "../components/materiales/MaterialesDetails";
import MaterialesForm from "../components/materiales/MaterialesForm";

import { useMateriales } from "../hooks/useMateriales";

function MaterialesPage() {
  const { items: materiales, loading, add, edit, remove, reload } = useMateriales();

  const [busqueda, setBusqueda] = useState("");
  const [materialSeleccionado, setMaterialSeleccionado] = useState(null);
  const [vistaDetalle, setVistaDetalle] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [materialAEditar, setMaterialAEditar] = useState(null);
  const [mostrarEliminar, setMostrarEliminar] = useState(false);
  const [materialAEliminar, setMaterialAEliminar] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [vistaTarjetas, setVistaTarjetas] = useState(false);

  const materialesFiltrados = materiales.filter((m) =>
    m.nombre_material.toLowerCase().includes(busqueda.toLowerCase())
  );

  const abrirFormulario = () => {
    setMaterialAEditar(null);
    setModoEdicion(false);
    setMostrarFormulario(true);
  };

  const editarMaterial = (material) => {
    setMaterialAEditar(material);
    setModoEdicion(true);
    setMostrarFormulario(true);
  };

  const cerrarFormulario = () => {
    setMostrarFormulario(false);
    setMaterialAEditar(null);
    setModoEdicion(false);
  };

  const guardarMaterial = async (data) => {
    try {
      if (modoEdicion && materialAEditar) {
        await edit(materialAEditar.id, data);
      } else {
        await add(data);
      }

      await reload();
      cerrarFormulario();
    } catch (e) {
      console.error("Error al guardar material:", e);
      alert("No se pudo guardar el material.");
    }
  };

  const abrirDetalles = (material) => {
    setMaterialSeleccionado(material);
    setVistaDetalle(true);
  };

  const cerrarDetalles = () => {
    setVistaDetalle(false);
    setMaterialSeleccionado(null);
  };

  const abrirEliminar = (material) => {
    setMaterialAEliminar(material);
    setMostrarEliminar(true);
  };

  const cerrarEliminar = () => {
    setMostrarEliminar(false);
    setMaterialAEliminar(null);
  };

  const eliminarMaterial = async () => {
    if (!materialAEliminar) return;

    setIsDeleting(true);

    try {
      await remove(materialAEliminar.id);
      await reload();
      cerrarEliminar();
    } catch (e) {
      console.error("Error al eliminar material:", e);
      alert("No se pudo eliminar el material.");
    } finally {
      setIsDeleting(false);
    }
  };

  const totalMateriales = materiales.length;

  const totalStock = materiales.reduce(
    (acc, m) => acc + Number(m.cantidad_en_stock ?? 0),
    0
  );

  const valorInventario = materiales.reduce(
    (acc, m) =>
      acc + Number(m.cantidad_en_stock ?? 0) * Number(m.precio_unitario ?? 0),
    0
  );

  const money = (value) => Number(value ?? 0).toLocaleString("es-NI");

  if (loading) {
    return (
      <div className="flex h-[calc(100dvh-64px)] w-full items-center justify-center bg-slate-200 px-4">
        <div className="rounded-3xl border border-slate-300 bg-slate-100 px-8 py-6 text-center shadow-xl">
          <p className="text-sm font-bold text-slate-800">
            Cargando materiales...
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
        <section
          className="
            shrink-0
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
                  Inventario
                </p>

                <h1 className="mt-1 text-sm font-bold tracking-tight text-white">
                  Materiales
                </h1>

                <p className="mt-2 text-sm text-slate-300">
                  Gestión de materiales y suministros disponibles en inventario.
                </p>
              </div>

              <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-3 xl:w-auto">
                <div className="rounded-2xl border border-white/10 bg-slate-900/50 px-4 py-3 text-left shadow-sm backdrop-blur xl:text-right">
                  <p className="text-sm font-medium text-cyan-100">
                    Materiales
                  </p>

                  <p className="mt-1 text-sm font-bold text-white">
                    {totalMateriales}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-900/50 px-4 py-3 text-left shadow-sm backdrop-blur xl:text-right">
                  <p className="text-sm font-medium text-cyan-100">
                    Stock total
                  </p>

                  <p className="mt-1 text-sm font-bold text-white">
                    {totalStock.toLocaleString("es-NI")}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-900/50 px-4 py-3 text-left shadow-sm backdrop-blur xl:text-right">
                  <p className="text-sm font-medium text-cyan-100">
                    Valor inventario
                  </p>

                  <p className="mt-1 text-sm font-bold text-white">
                    C${money(valorInventario)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="shrink-0 rounded-3xl border border-slate-300 bg-slate-100 p-4 shadow-md sm:p-5">
          <div className="flex w-full flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div className="w-full xl:flex-1">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Buscar material
              </label>

              <input
                type="text"
                placeholder="Buscar material por nombre..."
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
                  {materialesFiltrados.length}
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
                Añadir Material
              </button>
            </div>
          </div>
        </section>

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
                Lista de materiales
              </h2>

              <p className="mt-1 text-sm text-slate-600">
                Visualice, edite o elimine los materiales registrados.
              </p>
            </div>

            <span className="w-fit rounded-full border border-slate-300 bg-slate-200 px-4 py-2 text-sm font-bold text-slate-700">
              {vistaTarjetas ? "Vista tarjetas" : "Vista tabla"}
            </span>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto pr-1">
            {vistaTarjetas ? (
              <MaterialesCard
                materiales={materialesFiltrados}
                onEdit={editarMaterial}
                onDelete={abrirEliminar}
                onVerDetalles={abrirDetalles}
              />
            ) : (
              <MaterialesTable
                materiales={materialesFiltrados}
                onEdit={editarMaterial}
                onDelete={abrirEliminar}
                onVerDetalles={abrirDetalles}
              />
            )}
          </div>
        </section>

        {vistaDetalle && materialSeleccionado && (
          <MaterialesDetails
            material={materialSeleccionado}
            onClose={cerrarDetalles}
            onEdit={editarMaterial}
            onDelete={abrirEliminar}
          />
        )}

        {mostrarFormulario && (
          <MaterialesForm
            onSubmit={guardarMaterial}
            onClose={cerrarFormulario}
            initialData={materialAEditar}
            isEdit={modoEdicion}
          />
        )}

        {mostrarEliminar && (
          <DeleteConfirmationModal
            isOpen={mostrarEliminar}
            onClose={cerrarEliminar}
            onConfirm={eliminarMaterial}
            itemName={materialAEliminar?.nombre_material || ""}
            loading={isDeleting}
          />
        )}
      </div>
    </div>
  );
}

export default MaterialesPage;