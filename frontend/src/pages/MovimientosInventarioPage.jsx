import { useState } from "react";

import DeleteConfirmationModal from "../components/ui/DeleteConfirmationModal";

import MovimientosInventarioTable from "../components/movimientos_inventario/MovimientosInventarioTable";
import MovimientosInventarioDetails from "../components/movimientos_inventario/MovimientosInventarioDetails";
import MovimientosInventarioForm from "../components/movimientos_inventario/MovimientosInventarioForm";

import { useMovimientosInventario } from "../hooks/useMovimientosInventario";

function MovimientosInventarioPage() {
  const {
    items: movimientos,
    loading,
    entrada,
    salida,
    ajuste,
    remove,
    reload,
  } = useMovimientosInventario();

  const [busqueda, setBusqueda] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState("");

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [tipoMovimiento, setTipoMovimiento] = useState("Entrada");

  const [vistaDetalle, setVistaDetalle] = useState(false);
  const [movimientoSeleccionado, setMovimientoSeleccionado] = useState(null);

  const [mostrarEliminar, setMostrarEliminar] = useState(false);
  const [movimientoAEliminar, setMovimientoAEliminar] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [modalMensaje, setModalMensaje] = useState({
    open: false,
    type: "success",
    title: "",
    message: "",
  });

  const mostrarMensaje = (type, title, message) => {
    setModalMensaje({
      open: true,
      type,
      title,
      message,
    });
  };

  const cerrarMensaje = () => {
    setModalMensaje({
      open: false,
      type: "success",
      title: "",
      message: "",
    });
  };

  const movimientosFiltrados = (movimientos || []).filter((m) => {
    const q = busqueda.toLowerCase();

    const coincideBusqueda =
      m.materialNombre?.toLowerCase().includes(q) ||
      m.tipoMovimiento?.toLowerCase().includes(q) ||
      m.referencia?.toLowerCase().includes(q) ||
      m.descripcion?.toLowerCase().includes(q) ||
      m.usuarioNombre?.toLowerCase().includes(q) ||
      m.empleadoNombre?.toLowerCase().includes(q);

    const coincideTipo = tipoFiltro ? m.tipoMovimiento === tipoFiltro : true;

    return coincideBusqueda && coincideTipo;
  });

  const abrirFormulario = (tipo) => {
    setTipoMovimiento(tipo);
    setMostrarFormulario(true);
  };

  const cerrarFormulario = () => {
    setMostrarFormulario(false);
    setTipoMovimiento("Entrada");
  };

  const guardarMovimiento = async (data) => {
    try {
      let resultado = null;

      if (data.tipo_movimiento === "Entrada") {
        resultado = await entrada(data);

        mostrarMensaje(
          "success",
          "Entrada registrada",
          "La entrada de inventario se registró correctamente."
        );
      }

      if (data.tipo_movimiento === "Salida") {
        resultado = await salida(data);

        mostrarMensaje(
          "success",
          "Salida registrada",
          "La salida de inventario se registró correctamente."
        );
      }

      if (data.tipo_movimiento === "Ajuste") {
        resultado = await ajuste(data);

        mostrarMensaje(
          "success",
          "Ajuste registrado",
          "El ajuste de inventario se registró correctamente."
        );
      }

      await reload();
      cerrarFormulario();

      return resultado;
    } catch (error) {
      mostrarMensaje(
        "error",
        "Error al registrar movimiento",
        error.message || "No se pudo registrar el movimiento de inventario."
      );

      return null;
    }
  };

  const verDetalles = (movimiento) => {
    setMovimientoSeleccionado(movimiento);
    setVistaDetalle(true);
  };

  const cerrarDetalles = () => {
    setMovimientoSeleccionado(null);
    setVistaDetalle(false);
  };

  const abrirEliminar = (movimiento) => {
    setMovimientoAEliminar(movimiento);
    setMostrarEliminar(true);
  };

  const cerrarEliminar = () => {
    setMovimientoAEliminar(null);
    setMostrarEliminar(false);
  };

  const eliminarMovimiento = async () => {
    if (!movimientoAEliminar) return;

    setIsDeleting(true);

    try {
      await remove(movimientoAEliminar.id);
      await reload();

      mostrarMensaje(
        "success",
        "Movimiento eliminado",
        "El movimiento de inventario se eliminó correctamente."
      );

      cerrarEliminar();
      cerrarDetalles();
    } catch (error) {
      mostrarMensaje(
        "error",
        "Error al eliminar movimiento",
        error.message || "No se pudo eliminar el movimiento de inventario."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const totalMovimientos = movimientos.length;

  const totalEntradas = movimientos.filter(
    (m) => m.tipoMovimiento === "Entrada"
  ).length;

  const totalSalidas = movimientos.filter(
    (m) => m.tipoMovimiento === "Salida"
  ).length;

  const totalAjustes = movimientos.filter(
    (m) => m.tipoMovimiento === "Ajuste"
  ).length;

  if (loading) {
    return (
      <div className="flex h-[calc(100dvh-64px)] w-full items-center justify-center bg-slate-200 px-4">
        <div className="rounded-3xl border border-slate-300 bg-slate-100 px-8 py-6 text-center shadow-xl">
          <p className="text-sm font-bold text-slate-800">
            Cargando movimientos...
          </p>

          <p className="mt-1 text-sm text-slate-600">
            Espere un momento mientras se cargan los datos.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100dvh-64px)] w-full overflow-hidden bg-slate-200 px-3 py-4 sm:px-4 lg:px-5 xl:px-6">
      <div className="flex h-full w-full flex-col gap-4">
        <section className="shrink-0 overflow-hidden rounded-3xl border border-slate-700/40 bg-slate-900 shadow-xl">
          <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-cyan-900 px-5 py-5 text-white sm:px-7 lg:px-8">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <p className="text-sm font-medium text-cyan-100">
                  Inventario
                </p>

                <h1 className="mt-1 text-sm font-bold tracking-tight text-white">
                  Movimientos de Inventario
                </h1>

                <p className="mt-2 text-sm text-slate-300">
                  Registro de entradas, salidas y ajustes realizados sobre los
                  materiales.
                </p>
              </div>

              <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-4 xl:w-[680px]">
                <HeaderBox label="Movimientos" value={totalMovimientos} />
                <HeaderBox label="Entradas" value={totalEntradas} />
                <HeaderBox label="Salidas" value={totalSalidas} />
                <HeaderBox label="Ajustes" value={totalAjustes} />
              </div>
            </div>
          </div>
        </section>

        <section className="shrink-0 rounded-3xl border border-slate-300 bg-slate-100 p-4 shadow-md sm:p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-2 xl:flex-1">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Buscar movimiento
                </label>

                <input
                  type="text"
                  placeholder="Buscar por material, tipo, referencia, usuario o descripción..."
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

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Filtrar por tipo
                </label>

                <select
                  value={tipoFiltro}
                  onChange={(e) => setTipoFiltro(e.target.value)}
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
                    focus:border-blue-600
                    focus:bg-white
                    focus:ring-4
                    focus:ring-blue-100
                  "
                >
                  <option value="">Todos los movimientos</option>
                  <option value="Entrada">Entradas</option>
                  <option value="Salida">Salidas</option>
                  <option value="Ajuste">Ajustes</option>
                </select>
              </div>
            </div>

            <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-3 xl:w-auto">
              <button
                type="button"
                onClick={() => abrirFormulario("Entrada")}
                className="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:scale-[1.01] hover:bg-emerald-700"
              >
                Nueva Entrada
              </button>

              <button
                type="button"
                onClick={() => abrirFormulario("Salida")}
                className="rounded-2xl bg-red-600 px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:scale-[1.01] hover:bg-red-700"
              >
                Nueva Salida
              </button>

              <button
                type="button"
                onClick={() => abrirFormulario("Ajuste")}
                className="rounded-2xl bg-amber-500 px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:scale-[1.01] hover:bg-amber-600"
              >
                Nuevo Ajuste
              </button>
            </div>
          </div>
        </section>

        <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-3xl border border-slate-300 bg-slate-100 p-3 shadow-xl sm:p-5">
          <div className="mb-4 flex shrink-0 flex-col gap-2 border-b border-slate-300 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Tabla de movimientos
              </h2>

              <p className="mt-1 text-sm text-slate-600">
                La tabla ocupa el espacio principal para revisar mejor el
                historial del inventario.
              </p>
            </div>

            <span className="w-fit rounded-full border border-blue-200 bg-blue-100 px-4 py-2 text-sm font-bold text-blue-800">
              Resultados: {movimientosFiltrados.length}
            </span>
          </div>

          <div className="min-h-0 flex-1 overflow-auto rounded-3xl border border-slate-300 bg-slate-200">
            <MovimientosInventarioTable
              movimientos={movimientosFiltrados}
              onDelete={abrirEliminar}
              onVerDetalles={verDetalles}
            />
          </div>
        </section>

        {mostrarFormulario && (
          <MovimientosInventarioForm
            tipo={tipoMovimiento}
            onSubmit={guardarMovimiento}
            onClose={cerrarFormulario}
          />
        )}

        {vistaDetalle && movimientoSeleccionado && (
          <MovimientosInventarioDetails
            movimiento={movimientoSeleccionado}
            onClose={cerrarDetalles}
            onDelete={abrirEliminar}
          />
        )}

        {mostrarEliminar && (
          <DeleteConfirmationModal
            isOpen={mostrarEliminar}
            onClose={cerrarEliminar}
            onConfirm={eliminarMovimiento}
            itemName={
              movimientoAEliminar?.materialNombre ||
              movimientoAEliminar?.tipoMovimiento ||
              ""
            }
            loading={isDeleting}
          />
        )}

        {modalMensaje.open && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/60 px-4 backdrop-blur-sm">
            <div
              className={`
                w-full max-w-md overflow-hidden rounded-3xl border bg-white shadow-2xl
                ${
                  modalMensaje.type === "error"
                    ? "border-red-200"
                    : "border-emerald-200"
                }
              `}
            >
              <div className="px-6 py-6">
                <div className="flex items-start gap-4">
                  <div
                    className={`
                      flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl font-black
                      ${
                        modalMensaje.type === "error"
                          ? "bg-red-100 text-red-600"
                          : "bg-emerald-100 text-emerald-600"
                      }
                    `}
                  >
                    {modalMensaje.type === "error" ? "!" : "✓"}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-black text-slate-900">
                      {modalMensaje.title}
                    </h3>

                    <p className="mt-2 whitespace-pre-line text-sm font-medium leading-relaxed text-slate-600">
                      {modalMensaje.message}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end border-t border-slate-200 bg-slate-50 px-6 py-4">
                <button
                  type="button"
                  onClick={cerrarMensaje}
                  className={`
                    rounded-2xl px-5 py-2.5 text-sm font-bold text-white shadow-md transition
                    ${
                      modalMensaje.type === "error"
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-emerald-600 hover:bg-emerald-700"
                    }
                  `}
                >
                  Entendido
                </button>
              </div>
            </div>
          </div>
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

export default MovimientosInventarioPage;