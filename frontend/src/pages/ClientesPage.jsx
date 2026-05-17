import { useState } from "react";
import DeleteConfirmationModal from "../components/ui/DeleteConfirmationModal";

import ClientesCard from "../components/clientes/ClientesCard";
import ClientesTable from "../components/clientes/ClientesTable";
import ClientesForm from "../components/clientes/ClientesForm";
import ClientesDetails from "../components/clientes/ClientesDetails";

import ActionFeedback from "../components/ui/ActionFeedback";

import { useClientes } from "../hooks/useClientes";

function ClientesPage() {
  const { items: clientes, loading, add, edit, remove } = useClientes();

  const [busqueda, setBusqueda] = useState("");
  const [vistaDetalle, setVistaDetalle] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [clienteAEditar, setClienteAEditar] = useState(null);

  const [mostrarEliminar, setMostrarEliminar] = useState(false);
  const [clienteAEliminar, setClienteAEliminar] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [vistaTarjetas, setVistaTarjetas] = useState(true);

  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const clientesFiltrados = (clientes || []).filter((c) => {
    const q = busqueda.toLowerCase();

    return (
      c.nombreEmpresa?.toLowerCase().includes(q) ||
      c.nombreContacto?.toLowerCase().includes(q)
    );
  });

  const abrirFormulario = () => {
    setClienteAEditar(null);
    setModoEdicion(false);
    setMostrarFormulario(true);
  };

  const editarCliente = (cliente) => {
    setClienteAEditar(cliente);
    setModoEdicion(true);
    setMostrarFormulario(true);
    setVistaDetalle(false);
  };

  const cerrarFormulario = () => {
    setMostrarFormulario(false);
    setClienteAEditar(null);
    setModoEdicion(false);
  };

  const guardarCliente = async (data) => {
    try {
      const datos = {
        id: data.id,
        nombreEmpresa: data.nombreEmpresa,
        nombreContacto: data.nombreContacto,
        cargoContacto: data.cargoContacto,
        direccion: data.direccion,
        ciudad: data.ciudad,
        pais: data.pais,
        telefono: data.telefono,
      };

      if (modoEdicion && clienteAEditar) {
        const actualizado = await edit(clienteAEditar.id, datos);

        if (vistaDetalle && clienteSeleccionado?.id === clienteAEditar.id) {
          setClienteSeleccionado(actualizado);
        }

        setFeedbackMessage("Cliente actualizado con éxito");
      } else {
        await add(datos);
        setFeedbackMessage("Cliente creado con éxito");
      }

      setFeedbackOpen(true);
      cerrarFormulario();
    } catch (error) {
      console.error("Error al guardar cliente:", error);
    }
  };

  const verDetalles = (cliente) => {
    setClienteSeleccionado(cliente);
    setVistaDetalle(true);
  };

  const cerrarDetalles = () => {
    setVistaDetalle(false);
    setClienteSeleccionado(null);
  };

  const abrirEliminar = (cliente) => {
    setClienteAEliminar(cliente);
    setMostrarEliminar(true);
  };

  const cerrarEliminar = () => {
    setMostrarEliminar(false);
    setClienteAEliminar(null);
  };

  const eliminarCliente = async () => {
    if (!clienteAEliminar) return;

    setIsDeleting(true);

    try {
      await remove(clienteAEliminar.id);

      setFeedbackMessage("Cliente eliminado con éxito");
      setFeedbackOpen(true);

      cerrarEliminar();
      cerrarDetalles();
    } catch (error) {
      console.error("Error al eliminar cliente:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const totalClientes = clientes.length;

  const clientesConTelefono = clientes.filter((c) => c.telefono).length;

  const clientesConContacto = clientes.filter((c) => c.nombreContacto).length;

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-slate-200 px-4">
        <div className="rounded-3xl border border-slate-300 bg-slate-100 px-8 py-6 text-center shadow-xl">
          <p className="text-sm font-bold text-slate-800">
            Cargando clientes...
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
        h-full
        w-full
        min-w-0
        overflow-hidden
        bg-slate-200
        px-3
        py-4
        sm:px-5
        lg:px-8
      "
    >
      <div className="flex h-full w-full min-w-0 flex-col gap-5 overflow-hidden">
        <section
          className="
            w-full
            shrink-0
            overflow-hidden
            rounded-3xl
            border
            border-slate-700/40
            bg-slate-900
            shadow-xl
          "
        >
          <div className="w-full bg-gradient-to-r from-slate-950 via-blue-950 to-cyan-900 px-5 py-5 text-white sm:px-7 lg:px-8">
            <div className="flex w-full flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-cyan-100">Clientes</p>

                <h1 className="mt-1 text-sm font-bold tracking-tight text-white">
                  Gestión de clientes
                </h1>

                <p className="mt-2 text-sm text-slate-300">
                  Administración de clientes registrados, contactos y datos de
                  ubicación.
                </p>
              </div>

              <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-3 xl:w-[520px]">
                <div className="rounded-2xl border border-white/10 bg-slate-900/50 px-4 py-3 text-left shadow-sm backdrop-blur xl:text-right">
                  <p className="text-sm font-medium text-cyan-100">
                    Clientes
                  </p>

                  <p className="mt-1 text-sm font-bold text-white">
                    {totalClientes}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-900/50 px-4 py-3 text-left shadow-sm backdrop-blur xl:text-right">
                  <p className="text-sm font-medium text-cyan-100">
                    Con contacto
                  </p>

                  <p className="mt-1 text-sm font-bold text-white">
                    {clientesConContacto}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-900/50 px-4 py-3 text-left shadow-sm backdrop-blur xl:text-right">
                  <p className="text-sm font-medium text-cyan-100">
                    Con teléfono
                  </p>

                  <p className="mt-1 text-sm font-bold text-white">
                    {clientesConTelefono}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full shrink-0 rounded-3xl border border-slate-300 bg-slate-100 p-4 shadow-md sm:p-5">
          <div className="flex w-full flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div className="w-full min-w-0 xl:flex-1">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Buscar cliente
              </label>

              <input
                type="text"
                placeholder="Buscar por empresa o contacto..."
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
                  {clientesFiltrados.length}
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
                Añadir Cliente
              </button>
            </div>
          </div>
        </section>

        <section
          className="
            flex
            min-h-0
            w-full
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
          <div className="mb-4 flex w-full shrink-0 flex-col gap-2 border-b border-slate-300 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Lista de clientes
              </h2>

              <p className="mt-1 text-sm text-slate-600">
                Visualice, edite o elimine los clientes registrados.
              </p>
            </div>

            <span className="w-fit rounded-full border border-slate-300 bg-slate-200 px-4 py-2 text-sm font-bold text-slate-700">
              {vistaTarjetas ? "Vista tarjetas" : "Vista tabla"}
            </span>
          </div>

          <div className="min-h-0 w-full flex-1 overflow-y-auto overflow-x-hidden pr-1">
            <div className="w-full min-w-0">
              {vistaTarjetas ? (
                <ClientesCard
                  clientes={clientesFiltrados}
                  onEdit={editarCliente}
                  onDelete={abrirEliminar}
                  onVerDetalles={verDetalles}
                />
              ) : (
                <ClientesTable
                  clientes={clientesFiltrados}
                  onEdit={editarCliente}
                  onDelete={abrirEliminar}
                  onVerDetalles={verDetalles}
                />
              )}
            </div>
          </div>
        </section>

        {vistaDetalle && (
          <ClientesDetails
            cliente={clienteSeleccionado}
            onClose={cerrarDetalles}
            onEdit={editarCliente}
            onDelete={abrirEliminar}
          />
        )}

        {mostrarFormulario && (
          <ClientesForm
            onSubmit={guardarCliente}
            onClose={cerrarFormulario}
            initialData={clienteAEditar}
            isEdit={modoEdicion}
          />
        )}

        {mostrarEliminar && (
          <DeleteConfirmationModal
            isOpen={mostrarEliminar}
            onClose={cerrarEliminar}
            onConfirm={eliminarCliente}
            itemName={clienteAEliminar?.nombreEmpresa || ""}
            loading={isDeleting}
          />
        )}

        <ActionFeedback
          open={feedbackOpen}
          onClose={() => setFeedbackOpen(false)}
          message={feedbackMessage}
        />
      </div>
    </div>
  );
}

export default ClientesPage;